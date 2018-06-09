import React from 'react';
import {
    boardContainer,
    gameContainer,
} from '../styles/main.scss';
import {
    _min,
} from '../util/lodash';
import Dimensions from '../components/Dimensions';
import { Board } from '../components/Board';
import PropTypes from 'prop-types';

let id = 0;
const BOARD = {
    nodes: [
        { id: (++id), x: 0.1, y: 0.2 },
        { id: (++id), x: 0.9, y: 0.2 },
        { id: (++id), x: 0.1, y: 0.8 },
    ],
    paths: [
        { id: (++id), begin: 1, end: 2, segments: 4 },
        { id: (++id), begin: 1, end: 3, segments: 3 },
    ],
};

@Dimensions({ className: boardContainer })
export class BoardContainer extends React.PureComponent {
    static propTypes = {
        width: PropTypes.number,
        height: PropTypes.number,
    };

    render() {
        const { width, height, ...props } = this.props;

        if (!width || !height) {
            return null;
        }

        const size = _min([width, height]);
        return <Board {...props} size={size} />;
    }
}


export class ResourcesPane extends React.PureComponent {
    render() {
        return (
            <div>

            </div>
        );
    }
}



export class Game extends React.PureComponent {
    state = {
        boardData: BOARD,
    };

    render() {
        const {
            boardData,
        } = this.state;

        return (
            <div className={gameContainer}>
                <BoardContainer
                    boardData={boardData}
                />
                <ResourcesPane />
            </div>
        );
    }
}
