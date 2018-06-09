import _each from 'lodash/each';
import _size from 'lodash/size';
import _zip from 'lodash/zip';

export function arraysShallowEqual(a, b) {
    return _size(a) === _size(b) && _each(_zip(a, b), ([aItem, bItem]) => aItem === bItem);
}

export function memoizeOne(fn) {
    let prev = null;
    let hasPrev = false;
    let prevArgs = [];
    return (...args) => {
        if (hasPrev && arraysShallowEqual(args, prevArgs)) {
            return prev;
        }

        prev = fn(...args);
        prevArgs = args;
        hasPrev = true;
        return prev;
    };
}

