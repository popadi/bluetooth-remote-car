/**
 * Change the page background and the table font color to a darker
 * or a lighter version. Option also available on the mobile.
 */
$("#unchecked").click(function () {
    if ($(document.body).hasClass("dark")) {
        $(document.body).removeClass("dark").toggleClass("light");
        $("#device-table").toggleClass("light").removeClass("dark");
    } else {
        $(document.body).toggleClass("dark").removeClass("light");
        $("#device-table").toggleClass("dark").removeClass("light");
    }
});


/**
 * Reset the master page to the search-mode, if the selected
 * device is not "the chosen one" and you want to maintain the
 * page state.
 */
function showSearch() {
    $("#connection-animation").hide();
    $("#get-devices-btn").show();
    $("#circle-logo").show();
    $("#conn-mess").hide();
    $("#radar").show();
}