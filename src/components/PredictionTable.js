import React, { Component } from 'react';

import PredictionItem from './PredictionItem';


class PredictionTable extends Component {
    constructor() {
        super();

        this.state = {
            currentTime: Date.now()
        };
    }

    render() {
        const items = this.props.predictions.map((pred, index) => {
            return <PredictionItem key={index} currentTime={this.state.currentTime} prediction={pred} />;
        });

        return (
            <div>
                <div className='PredictionTable'>
                    {items}
                </div>
                <p>{this.props.predictions.length} predictions loaded.</p>
            </div>
        );
    }

    componentDidMount() {
        setInterval(() => {
            this.setState({ currentTime: Date.now() });
        }, 1000);
    }
}

export default PredictionTable;