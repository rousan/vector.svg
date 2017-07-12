
/**
 * @param container
 * @constructor
 */
var Vector = function (container) {

};

/**
 * This method copies all own properties(enumerable and non-enumerable)
 * carefully with descriptors from source objects to target and merges them.
 * It does not make deep copy of properties.
 *
 * @param target object which will be merged by sources
 * @returns target object
 */
Vector.merge = function (target) {
    if (isNullOrUndefined(target))
        throw new TypeError("Target object can't be null or undefined");
    target = Object(target);
    var i,
        source,
        descriptors;

    for(i = 1; i<arguments.length; ++i) {
        source = arguments[i];
        if (isNullOrUndefined(source))
            continue;
        source = Object(source);
        descriptors = Object.getOwnPropertyNames(source).reduce(function (descriptors, nextKey) {
            descriptors[nextKey] = Object.getOwnPropertyDescriptor(source, nextKey);
            return descriptors;
        }, {});
        defineProperties(target, descriptors);
    }

    return target;
};