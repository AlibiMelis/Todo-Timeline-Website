(function () {
  "use strict";

  // define variables
  var events = [
  {
    "date": "21 October 2020",
    "location": "Hong Kong Museum of Art",
    "description": "First talk",
  },
  {
    "date": "13 June 2021",
    "location": "Gusto",
    "description": "THE day",
  }
  ];
  var timeline = document.querySelector(".timeline ul");

  for (var i = 0; i < events.length; i++) {
    var event = document.createElement('li');
    event.innerHTML = "<div><time>" + events[i].date + "</time>" + events[i].description + "</div>";
    timeline.appendChild(event);
  }


  var items = document.querySelectorAll(".timeline li");

  // check if an element is in viewport
  // http://stackoverflow.com/questions/123999/how-to-tell-if-a-dom-element-is-visible-in-the-current-viewport
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
})();