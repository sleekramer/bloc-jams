
var pointsArray = document.getElementsByClassName('point'), revealPoint;
var animatePoints = function (points) {
    "use strict";
    
    forEach(points, function (element) {
        element.style.opacity = 1;
        element.style.transform = "scaleX(1) translateY(0)";
        element.style.msTransform = "scaleX(1) translateY(0)";
        element.style.WebkitTransform = "scaleX(1) translateY(0)";
    });

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