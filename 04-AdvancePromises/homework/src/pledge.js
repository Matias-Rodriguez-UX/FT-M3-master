'use strict';
/*----------------------------------------------------------------
Promises Workshop: construye la libreria de ES6 promises, pledge.js
----------------------------------------------------------------*/
// // TU CÓDIGO AQUÍ:

function $Promise(executor) {
    if (typeof executor !== 'function') throw new TypeError("Executor Function");

    this._state = "pending";
    this._handlerGroups = []
    executor(this._internalResolve.bind(this), this._internalReject.bind(this))
}

$Promise.prototype._internalResolve = function (data) {
    if (this._state === "pending") {
        this._state = "fulfilled"
        this._value = data
        this._handlerCalls()
    }
}

$Promise.prototype._internalReject = function (error) {
    if (this._state === "pending") {
        this._state = "rejected"
        this._value = error
        this._handlerCalls()
    }
}

$Promise.prototype.then = function (successCb, errorCb) {
    if (typeof successCb !== 'function') {
        successCb = false
    }
    if (typeof errorCb !== 'function') {
        errorCb = false
    }
    const downstreamPromise = new $Promise(function () { })
    this._handlerGroups.push({ successCb, errorCb, downstreamPromise })
    if (this._state !== 'pending') this._handlerCalls()
    return downstreamPromise;
}

$Promise.prototype.catch = function (errorCb) {
    return this.then(null, errorCb)

}

$Promise.prototype._handlerCalls = function () {
    while (this._handlerGroups.length > 0) {
        let current = this._handlerGroups.shift()
        if (this._state === "fulfilled") {
            if (!current.successCb) {
                current.downstreamPromise._internalResolve(this._value)
            } else {
                try {
                    const res = current.successCb(this._value)
                    if (res instanceof $Promise) {
                        res.then(val => current.downstreamPromise._internalResolve(val), err => current.downstreamPromise._internalReject(err))
                    } else {
                        current.downstreamPromise._internalResolve(res)
                    }
                } catch (error) {
                    current.downstreamPromise._internalReject(error)
                }
            }
            //current.successCb && current.successCb(this._value)
        }
        if (this._state === "rejected") {
            if (!current.errorCb) {
                current.downstreamPromise._internalReject(this._value)
            } else {
                try {
                    const res = current.errorCb(this._value)
                    if (res instanceof $Promise) {
                        res.then(val => current.downstreamPromise._internalResolve(val), err => current.downstreamPromise._internalReject(err))
                    } else {
                        current.downstreamPromise._internalResolve(res)
                    }
                } catch (error) {
                    current.downstreamPromise._internalReject(error)
                }
            }
            //current.errorCb && current.errorCb(this._value)
        }
    }
}

module.exports = $Promise;
/*-------------------------------------------------------
El spec fue diseñado para funcionar con Test'Em, por lo tanto no necesitamos
realmente usar module.exports. Pero aquí está para referencia:

module.exports = $Promise;

Entonces en proyectos Node podemos esribir cosas como estas:

var Promise = require('pledge');
…
var promise = new Promise(function (resolve, reject) { … });
--------------------------------------------------------*/
