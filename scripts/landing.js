var animatePoints = function () {
    "use strict";
    var points = document.getElementsByClassName('point'), revealPoint;
    
    revealPoint = function (points) {
        var i = 0;
        for (i; i < points.length; i += 1) {
            points[i].style.opacity = 1;
            points[i].style.transform = "scaleX(1) translateY(0)";
            points[i].style.msTransform = "scaleX(1) translateY(0)";
            points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
        }
    };
    revealPoint(points);
};