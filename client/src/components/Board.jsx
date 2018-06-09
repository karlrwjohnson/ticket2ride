import PropTypes from 'prop-types';
import React from 'react';
import {
    board,
    node,
    path,
    segment,
    backgroundStar,
} from '../styles/board.scss';
import {
    _find,
    _map,
    _range,
} from '../util/lodash';

const NODE_RADIUS_FACTOR = 1/50;

class Background extends React.PureComponent {
    static propTypes = {
        boardSize: PropTypes.number,
    };

    state = {
        backgroundStars: [],
    };

    componentDidMount() {
        this.initBackgroundStars();
    }

    initBackgroundStars() {
        const { boardSize } = this.props;
        const backgroundStars = _map(_range(boardSize * boardSize / PIXELS_PER_STAR), () => [ Math.random(), Math.random() ]);
        this.setState({ backgroundStars });
    }

    render() {
        const { backgroundStars } = this.state;
        const { boardSize } = this.props;

        return (
            <g>
                {_map(backgroundStars, ([x, y], i) =>
                    <circle key={i} cx={boardSize * x} cy={boardSize * y} r="2" className={backgroundStar} />
                )}
            </g>
        );
    }
}

class Node extends React.PureComponent {
    static propTypes = {
        boardSize: PropTypes.number,
        locationData: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
    };

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
            <circle cx={x * boardSize} cy={y * boardSize} r={boardSize* NODE_RADIUS_FACTOR} className={node} />
        );
    }
}

class Segment extends React.PureComponent {
    static propTypes = {
        boardSize: PropTypes.number,
        begin: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
        end: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
        index: PropTypes.number,
        segmentCount: PropTypes.number,
    };

    render() {
        const {
            boardSize,
            begin: { x: beginX, y: beginY },
            end: { x: endX, y: endY },
            index,
            segmentCount,
        } = this.props;

        const rectSize = boardSize/50;

        const t = (index + 0.5) / segmentCount;
        const x = beginX * t + endX * (1 - t);
        const y = beginY * t + endY * (1 - t);

        return (
            <rect
                className={segment}
                x={0}
                y={0}
                width={rectSize}
                height={rectSize}
                transform={`translate(${-rectSize/2 + x * boardSize}, ${-rectSize/2 + y * boardSize})`}
            />
        );
    }
}

class Path extends React.PureComponent {
    static propTypes = {
        boardSize: PropTypes.number,
        begin: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
        end: PropTypes.shape({
            x: PropTypes.number,
            y: PropTypes.number,
        }),
        pathData: PropTypes.shape({
            segments: PropTypes.number,
        }),
    };

    render() {
        const {
            begin,
            boardSize,
            end,
            pathData: {
                segments,
            },
        } = this.props;

        return (
            <g>
                <line
                    className={path}
                    x1={boardSize * begin.x}
                    y1={boardSize * begin.y}
                    x2={boardSize * end.x}
                    y2={boardSize * end.y}
                    strokeWidth={boardSize / 50}
                />
                { _map(_range(segments), (i) =>
                    <Segment
                        begin={begin}
                        end={end}
                        key={i}
                        index={i}
                        segmentCount={segments}
                        boardSize={boardSize}
                    />
                ) }
            </g>
        );
    }
}

const PIXELS_PER_STAR = 10000;

export class Board extends React.PureComponent {
    static propTypes = {
        boardData: PropTypes.any,
        size: PropTypes.number,
    };

    render() {
        const {
            boardData: {
                nodes = [],
                paths = [],
            } = {},
            size,
        } = this.props;

        return (
            <svg className={board} width={size} height={size}>
                <Background boardSize={size} />
                { _map(paths, x =>
                    <Path
                        key={x.id}
                        pathData={x}
                        begin={_find(nodes, { id: x.begin })}
                        end={_find(nodes, { id: x.end })}
                        boardSize={size}
                    />
                ) }
                { _map(nodes, x => <Node key={x.id} locationData={x} boardSize={size} />) }
            </svg>
        );
    }
}
