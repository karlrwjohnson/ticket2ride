import React from 'react';
import {
    root,
    boardContainer,
    board,
    node,
    path,
} from './main';
import {
    _find,
    _map,
} from './util/lodash';

let id = 0;
const DEG_90 = Math.PI / 180 * 90;
const DEG_180 = Math.PI / 180 * 180;
const DEG_270 = Math.PI / 180 * 270;

const BOARD = {
    nodes: [
        { id: (++id), x: 0.1, y: 0.2 },
        { id: (++id), x: 0.9, y: 0.2 },
        { id: (++id), x: 0.1, y: 0.8 },
    ],
    paths: [
        { id: (++id), begin: 1, end: 2, markers: [
            { id: (++id), x: 0.2, y: 0.2, rotation: 0 },
            { id: (++id), x: 0.4, y: 0.2, rotation: 0 },
            { id: (++id), x: 0.6, y: 0.2, rotation: 0 },
            { id: (++id), x: 0.8, y: 0.2, rotation: 0 },
        ] },
        { id: (++id), begin: 1, end: 3, markers: [
            { id: (++id), x: 0.1, y: 0.3, rotation: DEG_90 },
            { id: (++id), x: 0.1, y: 0.5, rotation: DEG_90 },
            { id: (++id), x: 0.1, y: 0.7, rotation: DEG_90 },
        ] },
    ],
};

class Node extends React.Component {
    render() {
        const {
            props: {
                boardSize,
                locationData: {
                    x,
                    y,
                }
            }
        } = this;

        return (
            <circle cx={x * boardSize} cy={y * boardSize} r={20} className={node} />
        );
    }
}

class Path extends React.Component {
    render() {
        const {
            begin,
            boardSize,
            end,
            pathData: {
                markers,
            },
        } = this.props;

        return (
            <g>
                <line
                    className={path}
                    x1={boardSize * begin.x}
                    y1={boardSize * begin.x}
                    x2={boardSize * begin.x}
                    y2={boardSize * begin.x}
                />
            </g>
        )
    }
}

class Board extends React.Component {
    render() {
        const boardData = BOARD;
        const {
            nodes,
            paths,
        } = boardData;

        const boardSize = 800;

        return (
            <svg className={board} width={boardSize} height={boardSize}>
                { _map(nodes, x => <Node key={x.id} locationData={x} boardSize={boardSize} />) }
                { _map(paths, x =>
                    <Path
                        key={x.id}
                        pathData={x}
                        begin={_find(nodes, { id: x.begin })}
                        end={_find(nodes, { id: x.end })}
                        boardSize={boardSize}
                    />
                ) }
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
