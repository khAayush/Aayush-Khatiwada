const goTop = document.querySelector(".top-btn");
const navBar = document.getElementsByTagName("nav")[0];

window.onscroll = ()=> {
    // changes navigation bar's class
    navBar.classList.toggle("stick", window.scrollY > 50);

    // Loads the top button
    if (window.scrollY >= 700) {
        goTop.style.right = '3vw';
    } else {
        goTop.style.right = '-3vw';
    }

}