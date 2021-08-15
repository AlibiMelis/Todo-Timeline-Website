(function() {
    "use strict";
    const auth = firebase.auth();
    const storage = firebase.storage();
    checkIfSignedIn(auth);

    add_logout_listener();

    const timelineRef = firebase.database().ref('timeline');

    // var events = [];

    const main = document.getElementById('main');
    var timeline = document.querySelector(".timeline ul");

    const loading = document.getElementById('load');

    const modal_title = document.getElementById("eventModalLabel");
    const description = document.getElementById('modal-description');
    const textbox = document.getElementById('modal-textbox');
    const image = document.getElementById('modal-image');
    const saveButton = document.getElementById("save");

    const newEventForm = document.getElementById("new-event-form");
    const addNewEventButton = document.getElementById("add-new-event");
    const newEventTitle = document.getElementById("event-title");
    const newEventDate = document.getElementById("event-date");
    const newEventLocation = document.getElementById("event-location");
    const newEventDescription = document.getElementById("event-description");
    const newEventImage = document.getElementById("event-image");

    const toast_container = document.getElementById('live-toast');
    const toast_message = document.getElementById('message');

    newEventForm.addEventListener('submit', (e) => {
        e.preventDefault();
    });
    addNewEventButton.addEventListener('click', (e) => {
        const title = newEventTitle.value;
        const date = newEventDate.value;
        const location = newEventLocation.value;
        const description = newEventDescription.value;
        const image = newEventImage.files[0];

        const key = newEventDate.value + "-" + newEventTitle.value;

        if (title == null ||
            title == "" ||
            date == null ||
            location == null ||
            location == "" ||
            description == null ||
            description == ""
        ) {
            alert('Please, fill out all fields as they are very important :3');
            return;
        }
        // console.log(newEventDate.value);

        timelineRef.child(key).set({
            title: title,
            date: date,
            memories: description,
            location: location,
            open: true,
        });

        if (image != null) {
            var imageRef = storage.ref("timeline-photos").child(key + ".jpg");
            imageRef.put(image).then((snapshot) => {
                console.log("Uploaded successfully");
            });
        }
        callbackFunc();

        newEventForm.reset();
    });


    saveButton.addEventListener('click', (e) => {
        const key = saveButton.getAttribute("event_key");
        console.log(key);
        // textbox = document.getElementById("modal-textbox");
        console.log(textbox.value);
        timelineRef.child(key).child('memories').set(textbox.value);
    });


    timelineRef.on('value', (snapshot) => {
        timeline.innerHTML = "";
        // loading.classList.remove('hidden');
        snapshot.forEach((e) => {
            const key = e.key;
            const data = e.val();
            const photoPath = 'timeline-photos/' + key + '.jpg';
            var event = {
                key: key,
                title: data.title || "Title",
                date: data.date || "",
                description: data.description || "I will add my memories later)",
                memories: data.memories || "",
                location: data.location || "",
                open: data.open || false,
                openDate: data.openDate || "",
                photoPath: photoPath || "../../assets/placeholder.jpg",
            };
            addEventToTimeline(event);
        });
        loading.classList.add('hidden');
        var event_item = document.createElement('li');
        event_item.innerHTML = '<div id="unknown" class="btn" data-bs-toggle="modal" data-bs-target="#newEventModal"><time>?</time>?</div>';
        // event_item.addEventListener('click', function() {
        //     change_modal(events[key]);
        // });
        timeline.appendChild(event_item);
        callbackFunc();

        const footer = document.getElementsByTagName('footer')[0];
        if (footer == null) {
            console.log('no footer');
            const newFooter = document.createElement('footer');
            newFooter.classList.add('page-footer');
            newFooter.innerHTML = "<span>All rights reserved. Made with love</span>"
            main.appendChild(newFooter);
        }
    });


    function addEventToTimeline(event) {
        var event_item = document.createElement('li');
        const date = dateFormat(event.date);

        var event_details = document.createElement('span');
        event_details.innerHTML = `
            <span class="attribute">Title:</span> <span class="value">` + event.title + `</span> <br>
            <span class="attribute">Location:</span> <span class="value">` + event.location + `</span> <br>
            <span class="short-description" message="IF YOU CAN FIND THIS, DAMN YOU ARE PERFECT FOR ME">` + event.description + `</span>
        `;
        event_details.classList.add('event-details');

        var time = document.createElement('time');
        time.innerHTML = date;


        var event_container = document.createElement('div');
        event_container.id = event.key;
        event_container.classList.add("btn");
        event_container.classList.add("event-container");
        if (event.open) {
            event_container.setAttribute('data-bs-toggle', "modal");
            event_container.setAttribute('data-bs-target', "#eventModal");
        } else {
            event_container.classList.add("closed");
        }

        event_container.appendChild(time);
        event_container.appendChild(event_details);
        // event_item.innerHTML = '<div id="' + event.key + 'class="btn" data-bs-toggle="modal" data-bs-target="#eventModal"><time>' + date + '</time></div>';
        event_item.appendChild(event_container);

        event_item.addEventListener('click', function() {
            if (event.open) {
                change_modal(event);
            } else {
                triggerToastMessage(" Will open: " + dateFormat(event.openDate));
            }
        });
        timeline.appendChild(event_item);
    }

    function triggerToastMessage(message) {
        var toast = new bootstrap.Toast(toast_container);
        toast_message.innerText = message;
        toast.show();
    }

    function change_modal(event) {
        saveButton.setAttribute("event_key", event.key);
        image.setAttribute('src', "");
        modal_title.innerText = event.title;
        description.innerText = event.description;
        textbox.textContent = event.memories;
        const photoRef = storage.ref(event.photoPath);
        photoRef.getDownloadURL().then((url) => {
                image.setAttribute('src', url);
                // image.classList.remove('placeholder');
            })
            .catch((error) => {
                console.log(error);
            });
    }

    function dateFormat(date) {
        const dates = date.split("-");
        const year = dates[0];
        const month = numToMonth(dates[1]);
        const day = dates[2];
        return day + " " + month + " " + year;
    }

    function numToMonth(num) {
        switch (num) {
            case "01":
                return "January";
                break;
            case "02":
                return "February";
                break;
            case "03":
                return "March";
                break;
            case "04":
                return "April";
                break;
            case "05":
                return "May";
                break;
            case "06":
                return "June";
                break;
            case "07":
                return "July";
                break;
            case "08":
                return "August";
                break;
            case "09":
                return "September";
                break;
            case "10":
                return "October";
                break;
            case "11":
                return "November";
                break;
            case "12":
                return "December";
                break;
            default:
                return "";
        }
    }

    function isElementInViewport(el) {
        var rect = el.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <=
            (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    function callbackFunc() {
        var items = document.querySelectorAll(".timeline li");
        for (var i = 0; i < items.length; i++) {
            if (isElementInViewport(items[i])) {
                items[i].classList.add("in-view");
            }
        }
    }

    // listen for events
    window.addEventListener("load", callbackFunc);
    window.addEventListener("resize", callbackFunc);
    window.addEventListener("scroll", callbackFunc);

    // button events
    function add_logout_listener() {
        const logout = document.getElementById('logout');
        logout.addEventListener('click', function() {
            auth.signOut();
        });
    };

    // if unauthorised access redirect to login
    function checkIfSignedIn(auth) {
        var signedIn = false;
        auth.onAuthStateChanged(firebaseUser => {
            if (firebaseUser) {
                signedIn = true;
                console.log(firebaseUser);
            } else {
                if (!signedIn) {
                    alert('Access Denied!');
                }
                console.log('not signed in');
                location.href = '/Website/index.html';
            }
        });
    };
})();