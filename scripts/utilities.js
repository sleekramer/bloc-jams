function forEach(array, callback) {
    "use strict";
    var i = 0;
    for (i; i < array.length; i += 1) {
        callback(array[i]);
    }
}