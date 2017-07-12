
// Add DOM Event wrappers to Element
Vector.merge(Element.prototype, {

    /**
     * Attach event listener to element.
     * Old IE browsers does not support useCapture parameter and 'this' value
     * in the listener, so to overcome this a wrapper listener is used instead of
     * actual listener.
     *
     * @param eventName
     * @param listener
     * @param context
     * @param useCapture
     * @returns {Element}
     */
    on: function (eventName, listener, context, useCapture) {
        if (this._domElement === null)
            return this;
        if (!isCallable(listener))
            throw new TypeError("EventListener is not callable");

        eventName = String(eventName);
        useCapture = Boolean(useCapture);
        context = arguments.length >= 3 ? context: this;

        var eventArr,
            self = this,
            wrapper,
            i = 0;

        eventArr = this._events[eventName];
        wrapper = function () {
            listener.apply(context, slice.call(arguments));
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
    },

    /**
     * Remove the listeners which was previously added via 'on' method
     *
     * @param eventName
     * @param listener
     * @param useCapture
     * @returns {Element}
     */
    off: function (eventName, listener, useCapture) {
        if (this._domElement === null)
            return this;

        var _events = this._events,
            self = this;

        if (arguments.length === 0) {
            Object.keys(_events).forEach(function (key) {
                _events[key].forEach(function (event) {
                    if (self._domElement.removeEventListener)
                        self._domElement.removeEventListener(key, event.wrapperListener, event.useCapture);
                    else
                        self._domElement.detachEvent("on" + key, event.wrapperListener);
                });
            });
            this._events = {};

        } else if (arguments.length === 1) {
            eventName = String(eventName);
            if (!_events[eventName])
                return self;
            _events[eventName].forEach(function (event) {
                if (self._domElement.removeEventListener)
                    self._domElement.removeEventListener(eventName, event.wrapperListener, event.useCapture);
                else
                    self._domElement.detachEvent("on" + eventName, event.wrapperListener);
            });
            delete _events[eventName];

        } else {
            if (!isCallable(listener))
                throw new TypeError("EventListener is not callable");

            eventName = String(eventName);
            useCapture = Boolean(useCapture);

            var eventArr,
                wrapper,
                i = 0;
            eventArr = this._events[eventName];
            if (!eventArr)
                return self;

            for (; i < eventArr.length; ++i) {
                if (eventArr[i].listener === listener && eventArr[i].useCapture === useCapture) {
                    if (self._domElement.removeEventListener)
                        self._domElement.removeEventListener(eventName, eventArr[i].wrapperListener, eventArr[i].useCapture);
                    else
                        self._domElement.detachEvent("on" + eventName, eventArr[i].wrapperListener);
                    eventArr.splice(i, 1);
                    break;
                }
            }

            if (eventArr.length === 0)
                delete _events[eventName];
        }

        return self;
    },

    once: function (eventName, listener, context, useCapture) {
        if (this._domElement === null)
            return this;
        if (!isCallable(listener))
            throw new TypeError("EventListener is not callable");

        eventName = String(eventName);
        useCapture = Boolean(useCapture);
        context = arguments.length >= 3 ? context: this;

        var eventArr,
            self = this,
            wrapper,
            i = 0;

        eventArr = this._events[eventName];
        wrapper = function () {
            listener.apply(context, slice.call(arguments));
            self.off(eventName, listener, useCapture);
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
    },

    // If this method is called to emit event then
    // listener will receive a CustomEvent object.
    // If it is need to emit 'click' or 'dblclick' event, then
    // call click or dblclick method instead of this.
    emit: function (eventName, data, bubbles) {
        if (this._domElement === null)
            return this;
        eventName = String(eventName);
        bubbles = Boolean(bubbles);
        var event;

        if (isCallable(window.CustomEvent)) {
            event = new window.CustomEvent(eventName, {
                detail: data,
                bubbles: bubbles,
                cancelable: true
            });

        } else if (isCallable(document.createEvent)) {
            event = document.createEvent("CustomEvent");
            event.initCustomEvent(eventName, bubbles, true, data);

        } else {
            event = document.createEventObject();
            event.detail = data;
        }

        if (isCallable(this._domElement.dispatchEvent))
            this._domElement.dispatchEvent(event);
        else
            this._domElement.fireEvent("on" + eventName, event);

        return this;
    },

    focus: function () {
        if (this._domElement === null)
            return this;
        this._domElement.focus();
    },

    blur: function () {
        if (this._domElement === null)
            return this;
        this._domElement.blur();
    },

    focusin: function () {
        if (this._domElement === null)
            return this;
        this._domElement.focus();
    },

    focuseout: function () {
        if (this._domElement === null)
            return this;
        this._domElement.blur();
    },

    click: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "click");
        return this;
    },

    dblclick: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "dblclick");
        return this;
    },

    mousedown: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "mousedown");
        return this;
    },

    mouseup: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "mouseup");
        return this;
    },

    mousemove: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "mousemove");
        return this;
    },

    mouseout: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "mouseout");
        return this;
    },

    mouseover: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "mouseover");
        return this;
    },

    mouseenter: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "mouseenter");
        return this;
    },

    mouseleave: function () {
        if (this._domElement === null)
            return this;
        triggerMouseEvent(this, "mouseleave");
        return this;
    },

    keydown: function () {
        if (this._domElement === null)
            return this;
        triggerKeyboardEvent(this, "keydown");
        return this;
    },

    keypress: function () {
        if (this._domElement === null)
            return this;
        triggerKeyboardEvent(this, "keypress");
        return this;
    },

    keyup: function () {
        if (this._domElement === null)
            return this;
        triggerKeyboardEvent(this, "keyup");
        return this;
    },

    // Listener should be null or callable,
    // If no argument is passed then previously attached listener
    // will be returned.
    onclick: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onclick", listener, context);
    },

    ondblclick: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ondblclick", listener, context);
    },

    onmousedown: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onmousedown", listener, context);
    },

    onmousemove: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onmousemove", listener, context);
    },

    onmouseout: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onmouseout", listener, context);
    },

    onmouseover: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onmouseover", listener, context);
    },

    onmouseup: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onmouseup", listener, context);
    },

    onmouseenter: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onmouseenter", listener, context);
    },

    onmouseleave: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onmouseleave", listener, context);
    },

    ontouchstart: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ontouchstart", listener, context);
    },

    ontouchend: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ontouchend", listener, context);
    },

    ontouchmove: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ontouchmove", listener, context);
    },

    ontouchcancel: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ontouchcancel", listener, context);
    },

    ondrag: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ondrag", listener, context);
    },

    ondragend: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ondragend", listener, context);
    },

    ondragenter: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ondragenter", listener, context);
    },

    ondragleave: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ondragleave", listener,context);
    },

    ondragover: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ondragover", listener, context);
    },

    ondragstart: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "oondragstart", listener, context);
    },

    ondrop: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "ondrop", listener, context);
    },

    onblur: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onblur", listener, context);
    },

    onfocus: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onfocus", listener, context);
    },

    oncontextmenu: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "oncontextmenu", listener, context);
    },

    onkeydown: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onkeydown", listener, context);
    },

    onkeypress: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onkeypress", listener, context);
    },

    onkeyup: function (listener, context) {
        if (arguments.length >= 1 && listener !== null && !isCallable(listener))
            throw new TypeError("Listener is not null or callable");
        context = arguments.length >= 2 ? context : this;
        return setEventAttribute(this, "onkeyup", listener, context);
    }

});

var constructMouseEventObject = function (eventName) {
    var event;
    if (isCallable(window.MouseEvent)) {
        event = new window.MouseEvent(eventName, {
            bubbles: true,
            cancelable: true,
            view: window,
            detail: 0,
            screenX: 0,
            screenY: 0,
            clientX: 0,
            clientY: 0,
            ctrlKey: false,
            altKey: false,
            shiftKey: false,
            metaKey: false,
            button: 0,
            buttons: 0,
            relatedTarget: null,
            region: null
        });
    } else if (isCallable(document.createEvent)) {
        event = document.createEvent("MouseEvent");
        event.initMouseEvent(eventName, true, true, window, 0, 0, 0, 0, 0, false, false, false, false, 0, null);

    } else {
        event = document.createEventObject();
    }
    return event;
};

var triggerMouseEvent = function (elem, eventName) {
    var eventObj = constructMouseEventObject(eventName);
    if (isCallable(elem._domElement.dispatchEvent))
        elem._domElement.dispatchEvent(eventObj);
    else
        elem._domElement.fireEvent("on" + eventName, eventObj);
};

var constructKeyboardEvent = function (eventName) {
    var event;
    if (isCallable(window.KeyboardEvent)) {
        event = new window.KeyboardEvent(eventName, {
            bubbles: true,
            cancelable: true,
            view: window,
            detail: 0,
            key: "",
            code: "",
            location: 0,
            ctrlKey: false,
            shiftKey: false,
            altKey: false,
            metaKey: false,
            repeat: false,
            isComposing: false,
            charCode: 0,
            keyCode: 0,
            which: 0
        });
    } else if (document.createEvent) {
        event = document.createEvent("KeyboardEvent");
        if (isCallable(event.initKeyboardEvent)) {
            if (isIEOrEdgeBrowser())
                event.initKeyboardEvent(eventName, true, true, window, "", 0, "", false, ""); //for IE and Edge
            else
                event.initKeyboardEvent(eventName, true, true, window); //For webkit, blink and DOM Level 3 Draft Spec
        } else
            event.initKeyEvent(eventName, true, true, window, false, false, false, false, 0, 0); //For Gecko

    } else {
        event = document.createEventObject();
    }
    return event;
};

var triggerKeyboardEvent = function (elem, eventName) {
    var eventObj = constructKeyboardEvent(eventName);
    if (isCallable(elem._domElement.dispatchEvent))
        elem._domElement.dispatchEvent(eventObj);
    else
        elem._domElement.fireEvent("on" + eventName, eventObj);
};

var setEventAttribute = function (elem, eventAttr, listener, context) {
    var wrapper;
    if (listener === null) {
        elem._domElement[eventAttr] = null;
        return elem;

    } else if(isCallable(listener)) {
        wrapper = listener.bind(context);
        wrapper._listener = listener;
        elem._domElement[eventAttr] = wrapper;
        return elem;

    } else {
        wrapper = elem._domElement[eventAttr];
        if (isCallable(wrapper) && isCallable(wrapper._listener))
            return wrapper._listener;
        else
            return null;
    }
};