function pushNotification(msg) {

    var notification = document.querySelector("#notification");
    notification.textContent = msg;
    notification.classList.add("open");

    setTimeout(function () {
        notification.classList.remove("open");
    },2000);

}