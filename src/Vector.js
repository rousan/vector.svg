/**
 *
 * @param container
 * @constructor
 */
var Vector = function (container) {

};


/**
 * This method copies all own properties(enumerable and non-enumerable)
 * carefully with descriptors from source objects to target.
 * It does not make deep copy.
 *
 * @param target object which will be extended by sources
 * @returns target object
 */
Vector.extend = function (target) {
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
        Object.defineProperties(target, descriptors);
    }

    return target;
};