$("#form-signin").submit(function(event) {
    if ($('#inputEmail').val() == '') {
        $.notify("Please enter username", "error");
        event.preventDefault();
        return;
    }

    if ($('#inputPassword').val() == '') {
        $.notify("Please enter password", "error");
        event.preventDefault();
        return;
    }


});
