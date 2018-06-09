import { extent } from 'd3-array';
import scaleLinear from 'd3-scale/src/linear';
import { voronoi } from 'd3-voronoi';
import _indexOf from 'lodash/indexOf';
import _map from 'lodash/map';
import _range from 'lodash/range';

const SEGMENTS_PER_MAP_EDGE = 10;

export function euclideanDistance(x1, y1, x2, y2) {
    const dx = x1 - x2;
    const dy = y1 - y2;
    return Math.sqrt(dx * dx + dy * dy);
}

export function randomBoard(pointCount) {
    const rawNodes = _map(_range(pointCount), () => [Math.random(), Math.random()]);
    const xscale = scaleLinear().domain(extent(rawNodes, n => n[0]));
    const yscale = scaleLinear().domain(extent(rawNodes, n => n[1]));
    const normalizedNodes = _map(rawNodes, ([x, y]) => [xscale(x), yscale(y)]);
    // const relaxedNodes = _map(rawNodes, (node) => {
    //     const [x, y] = node;
    //     _map(rawNodes, (other) => {
    //         if (node === other) return [0, 0];
    //
    //         const [x2, y2] = other;
    //         const force = 1 / ((x - x2) * (x - x2) + (y - y2) * (y - y2));
    //         const euclideanDistance =
    //     });
    // });
    const nodes = _map(normalizedNodes, ([x, y], i) => ({ id: i, x, y }));
    const rawPaths = voronoi()
        .x(d => d.x)
        .y(d => d.y)
        .links(nodes);
    const paths = _map(rawPaths, ({ source, target }, i) => {
        const segments = Math.ceil(euclideanDistance(source.x, source.y, target.x, target.y) * SEGMENTS_PER_MAP_EDGE);

        const color_id = Math.random() < 0.5 ? 0 : (Math.random() * 5 + 1 | 0);

        return {
            id: i,
            begin_id: _indexOf(nodes, source),
            end_id: _indexOf(nodes, target),
            color_id,
            segments,
        };
    });
    return { nodes, paths };
}


let id = 0;
// eslint-disable-next-line no-unused-vars
export const SAMPLE_BOARD = {
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
