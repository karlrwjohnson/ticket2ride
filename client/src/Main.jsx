import _map from 'lodash/map';
import React from 'react';
import {
    root,
    boardContainer,
    board,
    boardLocation,
} from './main';

let id = 0;
const DEG_90 = Math.PI / 180 * 90;
const DEG_180 = Math.PI / 180 * 180;
const DEG_270 = Math.PI / 180 * 270;

const BOARD = {
    locations: [
        { id: (++id), x: 0.1, y: 0.2 },
        { id: (++id), x: 0.9, y: 0.2 },
        { id: (++id), x: 0.1, y: 0.8 },
    ],
    paths: [
        { begin: 1, end: 2, markers: [
            { id: (++id), x: 0.2, y: 0.2, rotation: 0 },
            { id: (++id), x: 0.4, y: 0.2, rotation: 0 },
            { id: (++id), x: 0.6, y: 0.2, rotation: 0 },
            { id: (++id), x: 0.8, y: 0.2, rotation: 0 },
        ] },
        { begin: 1, end: 3, markers: [
            { id: (++id), x: 0.1, y: 0.3, rotation: DEG_90 },
            { id: (++id), x: 0.1, y: 0.5, rotation: DEG_90 },
            { id: (++id), x: 0.1, y: 0.7, rotation: DEG_90 },
        ] },
    ],
};

class Location extends React.Component {
    render() {
        const {
            props: {
                locationData: {
                    x,
                    y,
                }
            }
        } = this;

        return (
            <circle cx={x} cy={y} r={0.02} className={boardLocation} />
        );
    }
}

class Path extends React.Component {
    render() {
        const {
            begin,
            end,
            pathData: {
                markers,
            },
        } = this.props;
    }
}

class Board extends React.Component {
    render() {
        const boardData = BOARD;
        const {
            locations,
            paths,
        } = boardData;

        const SIZE = 800;
        const scale = SIZE;

        return (
            <svg className={board} width={SIZE} height={SIZE}>
                <g transform={`scale(${SIZE}, ${SIZE})`}>
                    <g>
                        { _map(locations, x => <Location key={x.id} locationData={x} scale={scale} />) }
                    </g>
                    <g>
                        { _map(paths, x =>
                            <Path
                                key={x.id}
                                pathData={x}
                                begin={_find(locations, { id: x.begin })}
                                end={_find(locations, { id: x.end })}
                                scale={scale}
                            />
                        ) }
                    </g>
                </g>
            </svg>
        );
    }
}

class Game extends React.Component {
    render() {
        return (
            <div className={boardContainer}>
                <Board />
            </div>
        );
    }
}

export default class Main extends React.Component {
    render() {
        return (
            <div className={root}>
                <header>Ticket 2 Ride</header>
                <Game />
            </div>
        );
    }
}
