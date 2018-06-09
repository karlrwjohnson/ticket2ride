import PropTypes from 'prop-types';
import React from 'react';
import Dimensions from '../components/Dimensions';
import { Board } from '../components/Board';
import {
    boardContainer,
    gameContainer,
} from '../styles/main.scss';
import {
    _min,
} from '../util/lodash';
import { randomBoard } from '../util/boardGeneration';


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
        boardData: randomBoard(10),
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
