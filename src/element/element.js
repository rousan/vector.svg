
/**
 * Base class for all the SVG DOM wrapper elements.
 */
var Element = Vector.Element = function Element() {
    this._domElement = null;
    this._events = {};
};

Vector.merge(Element.prototype, {

    /**
     * If params in form of:
     *      # (attrName, value, namespace) then sets attr and returns element, [3 args]
     *      # (attrName, value) then namespace = null and sets attr and returns element, [2 args]
     *      # (attrName, null, namespace) then deletes attr and returns element, [3 args]
     *      # (attrName, null) then namespace = null and deletes attr and returns element, [2 args]
     *      # (attrObject, namespace) then sets attrs and returns element, [2 args]
     *      # (attrObject) then namespace = null and sets attrs and returns element, [1 args]
     *      # (attrName, namespace) then returns attrValue, [2 args]
     *      # (attrName) then namespace = null and returns attrValue, [1 args]
     *      # (attrNamesArr) namespace = null and then returns attrValue as Array in order, [1 args]
     *      # (attrNamesArr, null) namespace = null and then deletes attrs and return element, [2 args]
     *      # () then returns all attributes as key/value pairs. [0 args]
     *
     * @param params
     */
    attr: function (params) {
        if (arguments.length === 0) {
            var node = this._domElement,
                attrs,
                i = 0,
                length,
                attr,
                outs = {};

            attrs = node.attributes;
            if (window.NamedNodeMap && attrs instanceof window.NamedNodeMap) {
                length = attrs.length;
                for(; i<length; ++i) {
                    attr = attrs.item(i);
                    outs[attr.localName] = attr.value;
                }
            }
        }
    },

    byId: function () {

    },

    query: function () {

    },

    queryAll: function () {

    }
});

/*
 * If element reference can be retrieved from attrValue then
 * wrapper element reference is returned otherwise attrValue is returned
 *
 * if attrName is:
 *      # 'mask', 'clip-path', 'fill', 'stroke', 'href', 'xlink:href' then extract id and then return wrapper element,
 *      # 'transform' etc then extract operations as JSON format and return it.
 */
var getElementRefFromAttr = function (attrName, value, namespaceURI) {

};