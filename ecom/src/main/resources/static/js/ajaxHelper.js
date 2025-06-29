
const ajaxHelper = {
    get: function (url, successCallback, errorCallback) {
        $.ajax({
            url: url,
            method: "GET",
            contentType: "application/json",
            success: successCallback,
            error: errorCallback || function (err) {
                console.error("GET error:", err);
            }
        });
    },
    post: function (url, data, successCallback, errorCallback) {
        $.ajax({
            url: url,
            method: "POST",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: successCallback,
            error: errorCallback || function (err) {
                console.error("POST error:", err);
            }
        });
    },
    put: function (url, data, successCallback, errorCallback) {
        $.ajax({
            url: url,
            method: "PUT",
            contentType: "application/json",
            data: JSON.stringify(data),
            success: successCallback,
            error: errorCallback || function (err) {
                console.error("PUT error:", err);
            }
        });
    },
    delete: function (url, successCallback, errorCallback) {
        $.ajax({
            url: url,
            method: "DELETE",
            contentType: "application/json",
            success: successCallback,
            error: errorCallback || function (err) {
                console.error("DELETE error:", err);
            }
        });
    }
};
