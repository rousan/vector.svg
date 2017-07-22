
Vector.merge(Element.prototype, {

    /**
     * Attach the binder function that will be called every time when
     * bind() method is called and the passed data to bind() function
     * to be passed to this binderFn argument.
     *
     * Note: at a time, a single binder function can be attached i.e. setting a new
     * binder replaces the previous one.
     * Pass null as first argument resets the binder function and sets it to null value.
     *
     * @param binderFn The binder function or null to reset
     * @param thisArg the this value of 'this' keyword, default value is current element object
     * @returns {Element}
     */
    binder: function (binderFn, thisArg) {
        if(binderFn === null) {
            this._binder = null;
            return this;
        }
        if (!isCallable(binderFn))
            throw new TypeError("Binder must be a callable");
        thisArg = isNullOrUndefined(thisArg) ? this : thisArg;
        this._binder = binderFn.bind(thisArg);
        return this;
    },

    /**
     * It calls the binder function with the specified data argument.
     * If the binder function is not set then it does nothing.
     *
     * @param data any data to be passed to te binder function
     * @returns {Element}
     */
    bind: function (data) {
        var binder = this._binder;
        if (!isCallable(binder))
            return this;
        binder(data);
        return this;
    }

});