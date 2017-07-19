/**
 * This class is the super class of all the containers
 *
 * These containers provide container based methods to add elements
 * and these methods are copied to actual svg wrapper class, so
 * remember these containers are not in the prototype chain of actual svg wrapper classes.
 *
 * @constructor
 */
var Container = function () {

};

Vector.merge(Container, {

    makeInheritance: function (wrapperClass) {
        Vector.merge(wrapperClass.prototype, this.prototype);
    }

});