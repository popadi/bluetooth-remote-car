// https://codepen.io/PavelCSS/pen/emvNYM
var peopleCount = 10;
var devices = [];
var time = 5;


for (var i = 0; i < peopleCount; i++) {
    devices.push({
        distance : Math.floor((Math.random() * 140) + 1),
        angle    : Math.floor((Math.random() * 360) + 1)
    });
}

(function radar(){

    var radius = 150;
    for (i = 0; i < devices.length; i++) {
        var disX = (90 < devices[i].angle + 90 < 270) ? radius - devices[i].distance : radius,
            disY = (180 < devices[i].angle + 90 < 360) ? radius - devices[i].distance : radius,
            angleNew = (devices[i].angle + 90) * Math.PI / 180,
            getDegX = disX + devices[i].distance - Math.round(devices[i].distance * Math.cos(angleNew)),
            getDegY = disY + devices[i].distance - Math.round(devices[i].distance * Math.sin(angleNew)),
            delay = time / 360 * devices[i].angle;

        $('#guides').append($('<span>')
            .addClass('dot')
            .css({
                left : getDegX,
                top  : getDegY,
                '-webkit-animation-delay' : delay + 's',
                'animation-delay' : delay + 's'
            })
            .attr({
                'data-atDeg' : devices[i].angle
            }));
      $("#radar").addClass('animated');
    }
})();

