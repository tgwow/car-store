const loopMethods = ['map', 'forEach', 'reduce', 'reduceRight', 'filter', 'every', 'some'];
const testTypeMethods = ['isArray', 'isFunction', 'isNumber', 'isString', 'isBoolean', 'isNull'];

export default function DOM(element) {
    if (!(this instanceof DOM)){
        return new DOM(element)
    }
    this.element = document.querySelectorAll(element);
}

DOM.prototype.get = function get() {
    return this.element[0];
}

DOM.prototype.getAll = function getAll() {
    return this.element;
}

DOM.prototype.on = function on(event, callback) {
    if (event && callback)
        for( let i = 0; i < this.element.length; i++)
            this.element[i].addEventListener(event, callback);
}

DOM.prototype.off = function off(event, callback) {
    if (event && callback)
        for( let i = 0; i < this.element.length; i++)
            this.element[i].removeEventListener(event, callback);
}

loopMethods.forEach((item) => {
    DOM.prototype[item] = function () {
        return Array.prototype[item].apply(this.element, arguments);
    }
});

testTypeMethods.forEach((item) => {
    DOM[item] = function(object) {
        let stringType = Object.prototype.toString.call(object)
        return stringType === `[object ${item.slice(2)}]` || stringType ===  '[object Undefined]';
    }
});
