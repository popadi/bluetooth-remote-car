/**
 * Get the base URL on the page we are at and make it the baseURL
 * (without a specific server, this will be in the most cases your
 * private IP or localhost).
 * Then, connect to the Socket.IO server using the baseURL.
 */
baseURL = location.protocol + '//' + location.host;
let socket = io.connect(baseURL);


/**
 * Empty the table (if there are any devices) and add the new
 * ones we just received. If there are any errors received the
 * device discovery went wrong), a error message is displayed.
 *
 * @param receivedData: Dictionary that can contain a list of
 * errors or a list of devices.
 */
socket.on('print_devices', function (receivedData) {
    /* Decode the recieved result & clear the table */
    let decoded = JSON.parse(JSON.stringify(receivedData));
    $("#device-table-content").empty();
    $("#device-table").show();

    /* If we did not found any bluetooth connection or the computer does not
     * have a bluetooth device, display an error message.
     */
    if (decoded['data']['errors']) {
        newRow = "<tr><td colspan='3'>" + decoded['data']['errors'] + "</td></tr>";
        $("#device-table-content").append(newRow);
    }

    /* Add the devices to the table */
    if (decoded['data']['devices']) {
        function createTD(content) {
            return "<td align='center'>" + content + "</td>";
        }

        for (let i = 0; i < decoded['data']['devices'].length; i++) {
            let newRow = '';
            newRow += createTD(decoded['data']['devices'][i].name);
            newRow += createTD(decoded['data']['devices'][i].address);
            newRow += createTD("<img class='connect-icon' " +
                "onclick='connectBluetooth(this.name)' " +
                "name='" + decoded['data']['devices'][i].address + "'>");

            newRow = "<tr>" + newRow + "</tr>";
            $("#device-table-content").append(newRow);
        }
    }

    /* Add icon image to the connect buttons & Turn the radar backwards */
    $(".connect-icon").attr("src", "http://i.imgur.com/bBwMSrI.png");
    $("#middle-content").toggleClass('flipped');
});


/**
 * Start the connection animation and emit a message to the python
 * backend to create a connection with a specific device.
 * @param deviceAddress: the address of the device to connect to.
 */
function connectBluetooth(deviceAddress) {
    /* Remove the alert (if any) */
    let alertBox = $("#conn-mess");
    alertBox.removeClass("in");
    alertBox.removeClass("alert-danger");

    /* Function: connect-animation.js file */
    resetAnimation();

    /* Send a message and attempt to connect */
    socket.emit('connect_device', {"address": deviceAddress});
}


/**
 * This function receives the result of the previous function call,
 * to connect to a device. If the connection was successful, display
 * a check of the animation. If we received an error, we display the
 * error and display a x-mark in the middle.
 * Also, if the connection was successful, add a click event handler for
 * the alert. If the user will click on it, the listening and sending
 * python background thread will be started.
 *
 * @param {Object} connectionData: dictionary containing the connection
 * status and an success/error message
 */
socket.on('connection_status', function (connectionData) {
    let decoded = JSON.parse(JSON.stringify(connectionData));
    let connStatus = decoded['data']['status'];

    setTimeout(function () {
        /* Function: connect-animation.js file */
        toggleAnimationEnd(connStatus);

        let graphics = connStatus ? $("#success-graphics") : $("#error-graphics");
        $(graphics).css("display", "block");

        let alertBox = $("#conn-mess");
        alertBox.empty().append(decoded['data']['message']);
        alertBox.addClass(connStatus ? "alert-success in" : "alert-danger in");

        if (alertBox.hasClass("alert-success"))
            alertBox.click(function () {
                window.location = "/menu/"
            });

    }, 1000);
});

/**
 * Start the radar animation and emit a message to actually
 * start the BluetoothScraper in the python backend.
 */
$("#get-devices-btn").click(function () {
    socket.emit("get_devices");
    $("#middle-content").toggleClass('flipped');
    setTimeout(function () {
        $(".slide").addClass("slide-up");
    }, 2000);
});

$("#action-up").click(() => {
    return trigger_W();
});

$("#action-down").click(function () {
    trigger_S();
});


$("#action-left").click(function () {
    trigger_A();
});


$("#action-right").click(function () {
    trigger_D()
});


$("#action-space").click(function () {
    trigger_X();
});

let map = {
    87: false,
    65: false,
    83: false,
    68: false,
    32: false
};

function trigger_W() {
    if (map[87]) {
        console.log("W");
        socket.emit('move_car', {"direction": "W"});
        $("#action-up").attr('class', "btn btn-warning carbtn");
    } else {
        console.log("w");
        socket.emit('move_car', {"direction": "w"});
        $("#action-up").attr('class', 'btn btn-success carbtn');
    }
}

function trigger_A() {
    if (map[65]) {
        console.log("A");
        socket.emit('move_car', {"direction": "A"});
        $("#action-left").attr('class', "btn btn-warning carbtn");
    } else {
        console.log("a");
        socket.emit('move_car', {"direction": "a"});
        $("#action-left").attr('class', 'btn btn-success carbtn');
    }
}

function trigger_S() {
    if (map[83]) {
        console.log("S");
        socket.emit('move_car', {"direction": "S"});
        $("#action-down").attr('class', "btn btn-warning carbtn");
    } else {
        console.log("s");
        socket.emit('move_car', {"direction": "s"});
        $("#action-down").attr('class', 'btn btn-success carbtn');
    }
}

function trigger_D() {
    if (map[68]) {
        console.log("D");
        socket.emit('move_car', {"direction": "D"});
        $("#action-right").attr('class', "btn btn-warning carbtn");
    } else {
        console.log("d");
        socket.emit('move_car', {"direction": "d"});
        $("#action-right").attr('class', 'btn btn-success carbtn');
    }
}

function trigger_X() {
    if (map[32]) {
        console.log("X");
        socket.emit('move_car', {"direction": "X"});
        $("#action-space").attr('class', "btn btn-warning carbtn");
    } else {
        console.log("x");
        socket.emit('move_car', {"direction": "x"});
        $("#action-space").attr('class', 'btn btn-success carbtn');
    }
}


/**
 *
 */
$(document).keydown(function (e) {
    map[e.keyCode] = true;
    sendKeys(e.keyCode);

}).keyup(function (e) {
    map[e.keyCode] = false;
    sendKeys(e.keyCode);
});

/**
 *
 */
function sendKeys(key) {
    let keyName = String.fromCharCode(key).toUpperCase();
    //console.log("keyname=", keyName);

    switch (keyName) {
        case " ":
            trigger_X();
            break;
        case "W":
            trigger_W();
            break;
        case "S":
            trigger_S();
            break;
        case "A":
            trigger_A();
            break;
        case "D":
            trigger_D();
            break;
    }
}