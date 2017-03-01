function isEmptyObject(obj) {
    return !Object.keys(obj).length;
}

function isObject(obj) {
    return typeof obj === 'object';
}

export default {
    isEmptyObject: isEmptyObject,
    isObject: isObject
};