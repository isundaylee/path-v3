import React from 'react';

function PredictionItem(props) {
    const totalSecondsLeft = Math.floor(
        (props.prediction.arrivalTime - props.currentTime) / 1000
    );

    const minutesLeft = Math.floor(totalSecondsLeft / 60);
    const secondsLeft = totalSecondsLeft - 60 * minutesLeft;

    return (
        <tr>
            <td>{props.prediction.lineName}</td>
            <td>{minutesLeft}:{secondsLeft.toString().padStart(2, '0')}</td>
        </tr>
    );
}

export default PredictionItem;