const goTop = document.querySelector(".top-btn");
const navBar = document.getElementsByTagName("nav")[0];

window.onscroll = ()=> {
    // Loads the top button
    if (window.scrollY >= 700) {
        goTop.style.right = '3vw';
    } else {
        goTop.style.right = '-3vw';
    }

    // changes navigation bar's property
    if (window.scrollY > 50) {
        navBar.style.padding = '0.5vw 3vw'
        navBar.style.background = 'gray';
    } else {
        navBar.style.padding = '2vw 3vw'
        navBar.style.background = 'transparent';
    }
}