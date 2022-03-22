chrome.runtime.onMessage.addListener(function(request, sender, callback) {
    if (request.action == "bringer") {
        var http = new XMLHttpRequest();
        http.onload = function() {
            var call;
            try
                {
                   call = JSON.parse(http.responseText);
                }
                catch(e)
                {
                   call = http.responseText;
                }
            callback(call);
        };
        http.open(request.method, request.url, true);
        if (request.method == 'POST') {
            http.setRequestHeader("Content-type", "application/x-www-form-urlencoded");
            http.send(request.form);
        } else {
            http.send();
        }

        return true;
    }
});