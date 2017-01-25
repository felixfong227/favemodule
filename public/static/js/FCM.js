// FCM
var messaging = firebase.messaging();
var notificationIds = firebase.database().ref("/notificationIds/ids/ids");
var notificationRoot = firebase.database().ref("/notificationIds");
messaging.requestPermission()
    .then(function () {

        return messaging.getToken();

    })
    .then(function (token) {

        // Save the user ID to the cloud
        function userId(callback) {
            var cookies = document.cookie.split(";");
            var _firstTime = false;
            cookies.forEach(function (cookie) {
                if(cookie.includes("notificationtoken")){
                    _firstTime = false;
                }else{
                    // First time
                    _firstTime = true;
                }
            });
            callback(_firstTime)

        }

        userId(function (firstTeime) {

            if(firstTeime){

                // Save the token to the cookie
                document.cookie = "notificationtoken="+token+"; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/";
                // Save the token to the cloud
                notificationIds.push({
                    "id": token
                });
                // Thanks to the users
                pushNotification("You will get notify later on :D");
            }

        });

    })
;

// notificationtoken
// document.cookie = "notificationtoken="+token+"; expires=Thu, 18 Dec 2020 12:00:00 UTC; path=/";