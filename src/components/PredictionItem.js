import React from 'react';

function PredictionItem(props) {
    const totalSecondsLeft = Math.floor(
        (props.prediction.arrivalTime - props.currentTime) / 1000
    );

    const minutesLeft = Math.floor(totalSecondsLeft / 60);
    const secondsLeft = totalSecondsLeft - 60 * minutesLeft;

    const containerStyle = {backgroundColor: props.prediction.color};

    return (
        <div className='PredictionItem' style={containerStyle}>
            <div className='left'>
                <div className='line'>
                    {props.prediction.lineName}
                </div>

                <div className='status'>
                    {props.prediction.status}
                </div>
            </div>
            <div className='right'>
                <div className='arrival'>
                    {minutesLeft}:{secondsLeft.toString().padStart(2, '0')}
                </div>
            </div>
        </div>
    );
}

export default PredictionItem;