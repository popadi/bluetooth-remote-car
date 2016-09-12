/**
 * Get the base URL on the page we are at and make it the baseURL
 * (without a specific server, this will be in the most cases your
 * private IP or localhost).
 * Then, connect to the Socket.IO server using the baseURL.
 */
baseURL = location.protocol + '//' + location.host;
var socket = io.connect(baseURL);


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
    var decoded = JSON.parse(JSON.stringify(receivedData));
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
        function createTD(content){return "<td align='center'>"+content+"</td>";}
        for (var i = 0; i < decoded['data']['devices'].length; i++) {
            var newRow = '';
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
    var alertBox = $("#conn-mess");
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
    var decoded = JSON.parse(JSON.stringify(connectionData));
    var connStatus = decoded['data']['status'];

    setTimeout(function () {
        /* Function: connect-animation.js file */
        toggleAnimationEnd(connStatus);

        var graphics = connStatus ?  $("#success-graphics") : $("#error-graphics");
        $(graphics).css("display", "block");

        var alertBox = $("#conn-mess");
        alertBox.empty().append(decoded['data']['message']);
        alertBox.addClass(connStatus ? "alert-success in" : "alert-danger in");

        if (alertBox.hasClass("alert-success"))
            alertBox.click(function () {window.location = "/generator/"});

    }, 1000);
});


/**
 * Start the radar animation and emit a message to actually
 * start the BluetoothScraper in the python backend.
 */
$("#get-devices-btn").click(function () {
    socket.emit("get_devices");
    $("#middle-content").toggleClass('flipped');
    setTimeout(function () { $(".slide").addClass("slide-up"); }, 2000);
});
