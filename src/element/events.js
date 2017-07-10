
Vector.merge(Element.prototype, {

    // Old IE browsers does not support useCapture parameter and 'this' value
    // in the listener, so to overcome this a wrapper listener is used.
    on: function (eventName, listener, useCapture) {
        if (this._domElement === null)
            return this;
        if (!isCallable(listener))
            throw new TypeError("EventListener is not callable");

        eventName = String(eventName);
        useCapture = Boolean(useCapture);

        var eventArr,
            self = this,
            wrapper,
            i = 0;

        eventArr = this._events[eventName];
        wrapper = function () {
            listener.apply(self, slice.call(arguments));
        };
        if (eventArr) {
            for (; i < eventArr.length; ++i) {
                if (eventArr[i].listener === listener && eventArr[i].useCapture === useCapture)
                    return this;
            }
        } else {
            eventArr = this._events[eventName] = [];
        }
        eventArr.push({listener: listener, wrapperListener: wrapper, useCapture: useCapture});

        if (this._domElement.addEventListener)
            this._domElement.addEventListener(eventName, wrapper, useCapture);
        else
            this._domElement.attachEvent("on" + eventName, wrapper);

        return self;
    }



});