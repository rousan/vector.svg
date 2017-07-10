
Vector.merge(Element.prototype, {

    addListener: function (eventName, listener, options) {
        if (this._domElement === null)
            return this;
        this._domElement.addEventListener(eventName, listener, options);
        return this;
    },

    removeListener: function (eventName, listener, options) {
        if (this._domElement === null)
            return this;
        this._domElement.removeEventListener(eventName, listener, options);
        return this;
    },

    on: function (eventName, listener, options) {
        return this.addListener(eventName, listener, options);
    },

    once: function (eventName, listener, options) {
        if (this._domElement === null)
            return this;
        if (isObject(options))
            options.once = true;
        else {
            options = {
                once: true,
                capture: options
            };
        }
        return this.addListener(eventName, listener, options);
    }

});