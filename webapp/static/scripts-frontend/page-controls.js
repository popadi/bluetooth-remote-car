$("#unchecked").click(function () {
    if ($(document.body).hasClass("dark")) {
        $(document.body).removeClass("dark").toggleClass("light");
        $("#device-table").toggleClass("light").removeClass("dark");
    } else {
        $(document.body).toggleClass("dark").removeClass("light");
        $("#device-table").toggleClass("dark").removeClass("light");
    }
});