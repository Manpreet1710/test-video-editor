---
---


console.log('');
if ("{{ site.safeui }}"==="true") {
  document.addEventListener("DOMContentLoaded", function () {
    var safuiAlert = document.querySelector("#safeui-alert");
    if (safuiAlert) {
      setTimeout(function () {
        safuiAlert.style.transition = "1s";
        safuiAlert.style.height = "0";
        safuiAlert.style.paddingTop = "0";
        safuiAlert.style.paddingBottom = "0";
        safuiAlert.style.marginTop = "0";
        safuiAlert.style.marginBottom = "0";
        setTimeout(function () {
          safuiAlert.parentNode.removeChild(safuiAlert);
        }, 1000);
      }, 10000);
    }
  });
  let getLayout = document.getElementById("header");
const layout = getLayout.dataset.layout;
if (layout == "feature-1") {
  var removeNav = () => {
    let homeLink = document.getElementById("home-link");
    homeLink.style.marginRight = "10px";
    document.getElementById("h1-img-wrapper").prepend(homeLink);

    document.getElementById("header").style.display = "none";
    document.querySelector(".feature1-h1").style.width = "100%";
    document.querySelector(".feature1-h2").style.display = "none";
    console.log(document.querySelector(".feature1-flex-container"));
    document.querySelector(".feature1-flex-container").style.paddingTop =
      "0rem";
    document.querySelector(".feature1-flex-container").style.paddingBottom =
      "0rem";
  };
} else {
  var removeNav = () => {
    let homeLink = document.getElementById("home-link");
    homeLink.style.marginRight = "10px";
    document.getElementById("h1-img-wrapper").prepend(homeLink);
    document
      .getElementById("h1-img-wrapper")
      .style.setProperty("align-items", "unset", "important");
    document.getElementById("header").style.display = "none";
    document.getElementById("h1-img").style.display = "none";
    document.getElementById("feature-h1").style.width = "100%";
    document.getElementById("feature-h2").style.display = "none";
    let safeUiAlert = document.getElementById("safeui-alert");
    if (safeUiAlert) {
      safeUiAlert.style.display = "none";
    }
  };
}
}



if ("{{ site.removeBootstrapJs }}"==="true") {
  const languagesModal = document.querySelector("#staticBackdrop");
const intModalBtn = document.querySelector("#int-modal-btn");
const closeBtn = document.querySelector("#close-modal");

if(intModalBtn){
intModalBtn.addEventListener("click", () => {
  languagesModal.style.display = "block";
  languagesModal.classList.add("show");
  let modal = document.createElement("div");
  modal.classList.add("modal-backdrop", "show");
  document.body.appendChild(modal);
});
closeBtn.addEventListener("click", () => {
  languagesModal.style.display = "none";
  languagesModal.classList.remove("show");
  let modal = document.querySelector(".modal-backdrop");
  document.body.removeChild(modal);
});
}
let navbarDropdown = document.querySelector("#navbarDropdown");
let dropmenu = document.querySelector(".dropmenu");
navbarDropdown.addEventListener("click", () => {
  if (dropmenu.classList.contains("show")) {
    dropmenu.classList.remove("show");
    dropmenu.style.display = "none"
  } else {
    dropmenu.classList.add("show");
    dropmenu.style.display = "block"
    dropmenu.style.padding = ".5rem 0"
  }
});
const navbarToggler=document.querySelector('.navbar-toggler')
const navBar=document.querySelector('#navbarSupportedContent')
navbarToggler.addEventListener('click',()=>{
  if (navBar.classList.contains("show")) {
    navBar.classList.remove("show");
    navBar.style.display = "none"
  } else {
    navBar.classList.add("show");
    navBar.style.display = "block"
  }
})
}


