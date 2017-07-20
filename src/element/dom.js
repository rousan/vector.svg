
// Addition of the Document Tree manipulation functionality
Vector.merge(Element.prototype, {

    /**
     * Returns all child SVGElement as Array of wrappers
     * @returns {Array}
     */
    children: function () {
        var dom = this._domElement,
            outs = [],
            i = 0,
            length,
            node,
            nodes;
        nodes = dom.childNodes;
        length = nodes.length;
        for(; i<length; ++i) {
            node = nodes.item(i);
            if (node instanceof window.SVGElement)
                outs.push(Vector.wrap(node));
        }
        return outs;
    },

    insert: function (elem, index) {
        if (!(elem instanceof Element))
            return this;
        if (isNullOrUndefined(index)) {
            return this.append(elem);
        }

        var children = this.children();
        if (children.length === 0) {
            return this.append(elem);
        }

        index = +index;
        index = isNaN(index) ? 0 : index;
        index = max(0, index);
        index = floor(index);

        if (index >= children.length) {
            return this.append(elem);
        }

        this.node().insertBefore(elem.node(), children[index].node());
        return this;
    },

    append: function (elem) {
        if (!(elem instanceof Element))
            return this;
        this.node().appendChild(elem.node());
        return this;
    },

    /**
     * Here if index is out of bounds then nothing will happen
     *
     * @param elem can be any wrapper element or index of element
     * @returns {*}
     */
    remove: function (elem) {
        if (elem instanceof Element) {
            this.node().removeChild(elem.node());
        } else if (typeof elem === "number") {
            return this.remove(this.children()[elem]);
        }
        return this;
    },

    has: function (elem) {
        if (!(elem instanceof Element))
            return false;
        var children = this.children(),
            length = children.length,
            i = 0;
        for(; i<length; ++i) {
            if (children[i].node() === elem.node())
                return true;
        }
        return false;
    },

    replace: function (newElem, oldElem) {
        if (!(newElem instanceof Element) || !(oldElem instanceof Element))
            return this;

        this.node().replaceChild(newElem.node(), oldElem.node());
        return this;
    },

    /**
     * This method sets text content of any node.
     * It is useful for <title> or <desc> elements
     * @param text
     * @returns {*}
     */
    textContent: function (text) {
        if (text === undefined)
            return this.node().textContent;
        else {
            this.node().textContent = text;
            return this;
        }
    },

    byId: function () {

    },

    query: function () {

    },

    queryAll: function () {

    }
});