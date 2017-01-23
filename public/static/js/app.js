// Initialize Firebase
var config = {
    apiKey: "AIzaSyBTcyHe0hmifq39jzIBi6MfF0mWTFkzDbs",
    authDomain: "favemodule.firebaseapp.com",
    databaseURL: "https://favemodule.firebaseio.com",
    storageBucket: "favemodule.appspot.com",
    messagingSenderId: "164472444045"
};
firebase.initializeApp(config);


var shareButton = document.querySelector("#my-fave-is"),
    shareBox = document.querySelector("#share-box"),
    modulesList = document.querySelector("#modules-list"),
    packageBoxEls = {
        closeButton: document.querySelector("#share-box .close"),
        shareButton: document.querySelector("#share-box #share"),
        packageName: document.querySelector("#share-box #package-name"),
        share: document.querySelector("#share-box #share")
    },
    ajax = new XMLHttpRequest();
;

var db = firebase.database().ref("/pkgs");

// Get all the package from the database

db.on("value",function (snap) {

    modulesList.innerHTML = null;

    var allPackages = snap.val()

    for(key in allPackages){

        if(key !== "__init__"){

            var self = allPackages[key];

            var packageContainer = document.createElement("div");
            packageContainer.className = "module " + self.name;

            var name = document.createElement("p");
            name.textContent = self.name;
            packageContainer.appendChild(name);

            var description = document.createElement("p");
            description.textContent = self.description;
            packageContainer.appendChild(description);

            var version = document.createElement("p");
            version.textContent = self.version;
            packageContainer.appendChild(version);


            modulesList.appendChild(packageContainer);
        }

    }


});

// when the share button is click,then open up the input for the user to input there favorite package name
shareButton.addEventListener("click",function () {
    shareBox.classList.add("open-box");
});

// INSIDE share box: close button is click,then close the box
packageBoxEls.closeButton.addEventListener("click",function () {
    shareBox.classList.remove("open-box");
});

// INSIDE share box: when the share button is click
packageBoxEls.share.addEventListener("click",function () {
    // Get the value of the package name
    var pkgName = packageBoxEls.packageName.value
        .toLowerCase()
        .trim()
    ;
    // cros2u is a little PHP servise I build,so people can start using CROS no matter what
    var url = "https://cros2u.000webhostapp.com/?url=" + "http://registry.npmjs.com/" + pkgName;
    ajax.open("GET",url,true);
    ajax.send();
    ajax.onreadystatechange = function (back) {
        packageBoxEls.packageName.value = null;
        // see whether the package is fake or not by looking up the NPM registry
        if(this.status == 200 && this.readyState == 4){
            try {
                var back = JSON.parse(this.response);
            }catch (e){

            }

            if(back._id){

                db.push({
                    "name": back.name,
                    "version": back["dist-tags"]["latest"],
                    "description": back.description
                });
                shareBox.classList.remove("open-box");

            }else{
                // No such a package
                pushNotification("No such a package");
            }

        }

    };

});