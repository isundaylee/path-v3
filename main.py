import logging
import threading
import requests
import os
import time
import sched

from flask import Flask
from flask import request, send_from_directory


app = Flask("path-v3", static_folder="build", static_url_path="/")
scheduler = sched.scheduler(time.time, time.sleep)


@app.route('/')
def index():
    return send_from_directory('build', 'index.html')

@app.route("/remind", methods=["POST"])
def remind():
    def send_reminder(line_name, seconds_left):
        app.logger.info("Sending reminder.")

        message = "Train to {} arrives in {}:{:02d}.".format(
            line_name, seconds_left // 60, seconds_left % 60
        )
        requests.post(
            os.environ["MBOT_ROOT_URI"] + "/relay",
            json={"message": message, "secret": os.environ["MBOT_RELAY_SECRET"]},
        )

    data = request.get_json()

    line_name = data["lineName"]
    arrival_timestamp = data["arrivalTimestamp"]

    for reminder_minutes in [8, 7, 6]:
        timestamp = arrival_timestamp - 60 * reminder_minutes

        if timestamp > time.time():
            scheduler.enterabs(
                timestamp, 0, send_reminder, (line_name, 60 * reminder_minutes)
            )

    return {"success": True}


if __name__ == "__main__":
    logging.basicConfig(level=logging.INFO)

    # Add a loog task to keep the scheduler running
    loop_task = lambda: scheduler.enter(1.0, 0, loop_task)
    scheduler.enter(1.0, 0, loop_task)

    thread = threading.Thread(target=scheduler.run)
    thread.start()

    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port)
