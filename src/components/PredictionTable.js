import React from 'react';

import PredictionItem from './PredictionItem';

function PredictionTable(props) {
    const currentTime = Date.now();
    const items = props.predictions.map((pred, index) => {
        return <PredictionItem key={index} currentTime={currentTime} prediction={pred} />;
    });

    return (
        <div>
            <p>{props.predictions.length} predictions loaded.</p>
            <table className='PredictionTable'>
                {items}
            </table>
        </div>
    );
};

export default PredictionTable;