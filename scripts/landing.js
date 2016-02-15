
var pointsArray = document.getElementsByClassName('point'), revealPoint;
var animatePoints = function (points) {
    "use strict";
    var i = 0;
    for (i; i < points.length; i += 1) {
        points[i].style.opacity = 1;
        points[i].style.transform = "scaleX(1) translateY(0)";
        points[i].style.msTransform = "scaleX(1) translateY(0)";
        points[i].style.WebkitTransform = "scaleX(1) translateY(0)";
    }

};

window.onload = function () {
    "use strict";
    if (window.innerHeight > 950) {
        animatePoints(pointsArray);
    }
    var sellingPoints = document.getElementsByClassName('selling-points')[0],
        scrollDistance = sellingPoints.getBoundingClientRect().top - window.innerHeight + 200;
    
    window.addEventListener('scroll', function (event) {
        if (document.documentElement.scrollTop >= scrollDistance || document.body.scrollTop >= scrollDistance) {
            animatePoints(pointsArray);
        }
    });
};