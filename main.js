const goTop = document.querySelector(".top-btn");

window.onscroll = ()=> {
    if (window.scrollY >= 700) {
        goTop.style.right = '3vw';
    } else {
        goTop.style.right = '-3vw';
    }
}