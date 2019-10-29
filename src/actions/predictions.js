import { setLoader } from "./loader";
import { DateTime } from "luxon";

function setPredictions(predictions) {
  return {
    type: "PREDICTIONS_SET",
    payload: predictions
  };
}

const STOP_ID_MAP = {
  grove_street: ["26728", "781726", "781727", "782496", "782497"],
  world_trade_center: [
    "26734",
    "781763",
    "781764",
    "781765",
    "781766",
    "782512",
    "794724"
  ]
};

const getServicesForDates = async dates => {
  const calendarsPromise = fetch("/path-nj-us/calendar.json");
  const calendarDatesPromise = fetch("/path-nj-us/calendar_dates.json");

  const [calendarResp, calendarDatesResp] = await Promise.all([
    calendarsPromise,
    calendarDatesPromise
  ]);

  const calendar = await calendarResp.json();
  const calendarDates = await calendarDatesResp.json();

  let dateServicesMap = {};

  dates.forEach(dateStr => {
    const year = parseInt(dateStr.substr(0, 4));
    const month = parseInt(dateStr.substr(4, 2));
    const day = parseInt(dateStr.substr(6, 2));
    const date = new Date(year, month - 1, day);
    const weekday = date.getDay();
    const weekdayName = [
      "sunday",
      "monday",
      "tuesday",
      "wednesday",
      "thursday",
      "friday",
      "saturday"
    ][weekday];

    dateServicesMap[dateStr] = [];

    calendar.forEach(calendarItem => {
      if (calendarItem[weekdayName] === "1") {
        dateServicesMap[dateStr].push(calendarItem.service_id);
      }
    });

    calendarDates.forEach(calendarDate => {
      if (calendarDate.date === dateStr) {
        switch (calendarDate.exception_type) {
          case "1":
            dateServicesMap[dateStr].push(calendarDate.service_id);
            break;
          case "2":
            dateServicesMap[dateStr] = dateServicesMap[dateStr].filter(
              serviceId => serviceId !== calendarDate.service_id
            );
            break;
          default:
            console.error(
              "Unexpected calendarDate exception type:" +
                calendarDate.exception_type
            );
        }
      }
    });
  });

  return dateServicesMap;
};

const getTripsForDates = async datesServicesMap => {
  const tripsResp = await fetch("/path-nj-us/trips.json");
  const trips = await tripsResp.json();

  let dateTripIdsMap = {};

  for (const dateStr in datesServicesMap) {
    const serviceIds = datesServicesMap[dateStr];
    dateTripIdsMap[dateStr] = trips
      .filter(trip => serviceIds.includes(trip.service_id))
      .map(trip => {
        return {
          tripId: trip.trip_id,
          tripHeadsign: trip.trip_headsign,
          routeId: trip.route_id
        };
      });
  }

  return dateTripIdsMap;
};

const getArrivalsForTrips = async (stopIds, dateTripsMap) => {
  const stopTimesResp = await fetch("/path-nj-us/stop_times.json");
  const stopTimes = await stopTimesResp.json();

  const stopTimesByTripId = {};
  const finalStopSeqByTripId = {};

  stopTimes.forEach(stopTime => {
    const stopSequence = parseInt(stopTime.stop_sequence);
    if (
      !(stopTime.trip_id in finalStopSeqByTripId) ||
      stopSequence > finalStopSeqByTripId[stopTime.trip_id]
    ) {
      finalStopSeqByTripId[stopTime.trip_id] = stopSequence;
    }

    if (!stopIds.includes(stopTime.stop_id)) {
      return;
    }

    if (stopTime.trip_id in stopTimesByTripId) {
      console.error("Duplicate trip ID: " + stopTime.trip_id);
    }

    stopTimesByTripId[stopTime.trip_id] = stopTime;
  });

  const dateArrivalsMap = {};

  for (const dateStr in dateTripsMap) {
    const year = parseInt(dateStr.substr(0, 4));
    const month = parseInt(dateStr.substr(4, 2));
    const day = parseInt(dateStr.substr(6, 2));

    dateArrivalsMap[dateStr] = dateTripsMap[dateStr]
      .map(trip => {
        const tripId = trip.tripId;

        if (!(tripId in stopTimesByTripId)) {
          return null;
        }

        const stopTime = stopTimesByTripId[tripId];

        const arrivalHour = parseInt(stopTime.arrival_time.substr(0, 2));
        const arrivalMin = parseInt(stopTime.arrival_time.substr(3, 2));
        const arrivalSec = parseInt(stopTime.arrival_time.substr(6, 2));

        const arrivalDate = new Date(
          year,
          month - 1,
          day,
          arrivalHour,
          arrivalMin,
          arrivalSec
        );

        return {
          tripId: tripId,
          tripHeadsign: trip.tripHeadsign,
          stopSequence: stopTime.stop_sequence,
          finalStopSequence: finalStopSeqByTripId[tripId],
          routeId: trip.routeId,
          arrivalTime: arrivalDate
        };
      })
      .filter(el => el !== null);
  }

  return dateArrivalsMap;
};

const getAnnotatedArrivalsForTrips = async dateArrivalsMap => {
  const routesResp = await fetch("/path-nj-us/routes.json");
  const routes = await routesResp.json();

  const routesById = {};
  routes.forEach(route => (routesById[route.route_id] = route));

  const dateArrivalsMapAnnotated = {};
  for (const dateStr in dateArrivalsMap) {
    dateArrivalsMapAnnotated[dateStr] = dateArrivalsMap[dateStr].map(
      arrival => {
        return {
          ...arrival,
          routeName: arrival.tripHeadsign,
          routeColor: routesById[arrival.routeId].route_color
        };
      }
    );
  }

  return dateArrivalsMapAnnotated;
};

const mergeAndFilterArrivals = dateArrivalsMapAnnotated => {
  let arrivals = [];

  for (const dateStr in dateArrivalsMapAnnotated) {
    dateArrivalsMapAnnotated[dateStr].forEach(arrival => {
      if (
        arrival.stopSequence < arrival.finalStopSequence &&
        arrival.arrivalTime > Date.now() &&
        arrival.arrivalTime < new Date(Date.now() + 12 * 60 * 60 * 1000)
      ) {
        arrivals.push(arrival);
      }
    });
  }

  return arrivals;
};

const getPredictions = arrivals => {
  return arrivals.map(arrival => {
    return {
      lineName: arrival.routeName,
      arrivalTime: arrival.arrivalTime,
      status: "From Schedule",
      color: "#" + arrival.routeColor
    };
  });
};

export function fetchPredictionsFromGlitch(stationName) {
  return async dispatch => {
    dispatch(setLoader(true));

    const today = DateTime.local();
    const tomorrow = today.plus({ days: 1 });
    const dateStrs = [today, tomorrow].map(date => date.toFormat("yyyyMMdd"));
    const dateServicesMap = await getServicesForDates(dateStrs);
    const dateTripsMap = await getTripsForDates(dateServicesMap);
    const dateArrivalsMap = await getArrivalsForTrips(
      STOP_ID_MAP[stationName],
      dateTripsMap
    );
    const dateArrivalsMapAnnotated = await getAnnotatedArrivalsForTrips(
      dateArrivalsMap
    );
    const filteredArrivals = mergeAndFilterArrivals(dateArrivalsMapAnnotated);
    const predictions = getPredictions(filteredArrivals);

    dispatch(setLoader(false));
    dispatch(setPredictions(predictions));
  };
}

export function fetchPredictions(stationName) {
  return function(dispatch) {
    dispatch(setLoader(true));

    return fetch(
      "https://path.api.razza.dev/v1/stations/" + stationName + "/realtime"
    ).then(
      response => {
        dispatch(setLoader(false));

        if (response.ok) {
          response.json().then(data => {
            if (!("upcomingTrains" in data)) {
              dispatch(setPredictions([]));
              return;
            }

            dispatch(
              setPredictions(
                data.upcomingTrains.map(pred => {
                  return {
                    lineName: pred.lineName,
                    arrivalTime: new Date(Date.parse(pred.projectedArrival)),
                    status: pred.status,
                    color: pred.lineColors[0]
                  };
                })
              )
            );
          });
        }
      },
      error => {
        dispatch(setLoader(false));
        dispatch(setPredictions([]));
      }
    );
  };
}
