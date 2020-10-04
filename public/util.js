// Load a text resource from a file over the network
let loadTextResource = function (url, callback) {
    let request = new XMLHttpRequest();
    request.open('GET', url + '?please-dont-cache=' + Math.random(), true);
    request.onload = function () {
        if (request.status < 200 || request.status > 299) {
            callback('Error: HTTP Status ' + request.status + ' on resource ' + url);
        } else {
            callback(null, request.responseText);
        }
    };
    request.send();
};

let loadImage = function (url, callback) {
    let image = new Image();
    image.onload = function () {
        callback(null, image);
    };
    image.src = url;
};

let loadJSONResource = function (url, callback) {
    loadTextResource(url, function (err, result) {
        if (err) {
            callback(err);
        } else {
            try {
                callback(null, JSON.parse(result));
            } catch (e) {
                callback(e);
            }
        }
    });
};