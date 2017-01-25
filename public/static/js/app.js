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
    ajax = new XMLHttpRequest()
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
            packageContainer.className = "module";
            packageContainer.id = self.name;

            var name = document.createElement("p");
            name.textContent = self.name;
            packageContainer.appendChild(name);

            var description = document.createElement("p");
            description.textContent = self.description;
            packageContainer.appendChild(description);

            var version = document.createElement("p");
            version.textContent = self.version;
            packageContainer.appendChild(version);

            var npmLink = document.createElement("a");
            npmLink.href = "https://npmjs.com/package/" + self.name;
            npmLink.target = "_self";

            var npm = document.createElement("img");
            npm.textContent = self.npm;
            npm.className = "icon npm " + self.name;
            npm.src = "./src/npm.png"

            npmLink.appendChild(npm);
            packageContainer.appendChild(npmLink);


            modulesList.appendChild(packageContainer);

        }

    }
    npmIcons = document.querySelectorAll("#modules-list .module .icon.npm");

    // When the NPM icon is click
    // Save the current package position

    npmIcons.forEach(function (icon) {

        icon.addEventListener("click",function (e) {
            // Stop everything first
            e.preventDefault();

            // Get the package name
            var _pkgName = this.className.split("icon npm ")[1].trim();
            // Set the has for user to get back
            window.location.hash = _pkgName;
            // Send the user to the NPM website
            window.open("https://npmjs.com/package/" + _pkgName,"_self");
        });

    });

    // Spotlight feature
    if(window.location.hash){
        var id = window.location.hash.split("#")[1];
        var query = "#modules-list #" + id;
        var element = document.querySelector(query)
        element.classList.add("spotlight");
        element.scrollIntoView();
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


// When scrolling,the share button will hide
var hideShareButtonWhenScrolling = null;

modulesList.addEventListener("scroll",function () {

    if(hideShareButtonWhenScrolling !== null){
        shareButton.classList.add("hide");
        clearTimeout(hideShareButtonWhenScrolling);
    }
    hideShareButtonWhenScrolling = setTimeout(function () {
        shareButton.classList.remove("hide");
    },600);

});