import PropTypes from 'prop-types';
import React from 'react';
import {
    board,
    node,
    path,
    pathBackground,
    segment,
    backgroundStar,
} from '../styles/board.scss';
import fpMap from 'lodash/fp/map';
import fpUpdate from 'lodash/fp/update';
import _find from 'lodash/find';
import _map from 'lodash/map';
import _range from 'lodash/range';
import { euclideanDistance } from '../util/boardGeneration';
import { memoizeOne } from '../util/memoization';
import { RADIANS } from '../util/moreMath';
import { COLORS } from '../util/colors';

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
        color: PropTypes.string,
        distance: PropTypes.number,
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
            color,
            distance,
            end: { x: endX, y: endY },
            index,
            segmentCount,
        } = this.props;

        const rectWidth = boardSize / 40;
        const halfRectWidth = rectWidth / 2;
        const borderRadius = rectWidth / 3;

        const rectLength = boardSize * distance / segmentCount;

        const t = (index + 0.5) / segmentCount;
        const x = beginX * t + endX * (1 - t);
        const y = beginY * t + endY * (1 - t);

        const angle = Math.atan2(beginY - endY, beginX - endX) * RADIANS;
        const translateX = x * boardSize;
        const translateY = y * boardSize;

        return (
            <rect
                className={segment}
                x={-rectLength / 2}
                y={-halfRectWidth}
                width={rectLength}
                height={rectWidth}
                rx={borderRadius}
                ry={borderRadius}
                transform={`translate(${translateX}, ${translateY}) rotate(${angle})`}
                style={{ fill: color, stroke: color }}
            />
        );
    }
}

class Path extends React.PureComponent {
    static propTypes = {
        boardSize: PropTypes.number,
        pathData: PropTypes.shape({
            begin: PropTypes.shape({
                x: PropTypes.number,
                y: PropTypes.number,
            }),
            color: PropTypes.string,
            distance: PropTypes.number,
            end: PropTypes.shape({
                x: PropTypes.number,
                y: PropTypes.number,
            }),
            segments: PropTypes.number,
        }),
    };

    render() {
        const {
            boardSize,
            pathData: {
                begin,
                color,
                distance,
                end,
                segments,
            },
        } = this.props;

        return (
            <g className={path}>
                <line
                    className={pathBackground}
                    x1={boardSize * begin.x}
                    y1={boardSize * begin.y}
                    x2={boardSize * end.x}
                    y2={boardSize * end.y}
                    strokeWidth={boardSize / 50}
                />
                {_map(_range(segments), (i) =>
                    <Segment
                        begin={begin}
                        color={color}
                        distance={distance}
                        end={end}
                        key={i}
                        index={i}
                        segmentCount={segments}
                        boardSize={boardSize}
                    />
                )}
            </g>
        );
    }
}

const PIXELS_PER_STAR = 10000;

export class Board extends React.PureComponent {
    static propTypes = {
        boardData: PropTypes.shape({
            nodes: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number,
                x: PropTypes.number,
                y: PropTypes.number,
            })),
            paths: PropTypes.arrayOf(PropTypes.shape({
                id: PropTypes.number,
                begin_id: PropTypes.number,
                end_id: PropTypes.number,
                segments: PropTypes.number,
            })),
        }),
        size: PropTypes.number,
    };

    importBoardData = memoizeOne(boardData => {
        const { nodes } = boardData;
        return fpUpdate('paths',
            fpMap(pathDatum => {
                const { begin_id, color_id, end_id } = pathDatum;

                const begin = _find(nodes, { id: begin_id });
                const end = _find(nodes, { id: end_id });

                const { x: x1, y: y1 } = begin;
                const { x: x2, y: y2 } = end;
                const distance = euclideanDistance(x1, y1, x2, y2);

                const color = COLORS[color_id];

                return {
                    ...pathDatum,
                    begin,
                    color,
                    distance,
                    end,
                };
            })
        )(boardData);
    });

    render() {
        const {
            boardData,
            size,
        } = this.props;

        const importedBoard = this.importBoardData(boardData);

        const {
            nodes = [],
            paths = [],
        } = importedBoard;

        return (
            <svg className={board} width={size} height={size}>
                <Background boardSize={size} />
                {_map(paths, x =>
                    <Path
                        key={x.id}
                        pathData={x}
                        boardSize={size}
                    />
                )}
                {_map(nodes, x =>
                    <Node key={x.id} locationData={x} boardSize={size} />
                )}
            </svg>
        );
    }
}
