const body = document.body;
const toggleButton = document.getElementById('dark-mode-toggle');
const scrollToTopBtn = document.getElementById('scrollToTopBtn');

toggleButton.addEventListener('click', () => {
    body.classList.toggle('dark-mode');
});

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        document.querySelector(this.getAttribute('href')).scrollIntoView({
            behavior: 'smooth'
        });
    });
});

window.onscroll = function() {
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
        scrollToTopBtn.style.display = "block";
    } else {
        scrollToTopBtn.style.display = "none";
    }
};

scrollToTopBtn.addEventListener('click', function() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

const text = "Hi, I'm Brittany Herbert";
let index = 0;
const typewriterElement = document.getElementById('typewriter');
const cursorElement = document.getElementById('cursor');

function typeWriter() {
    if (index < text.length) {
        typewriterElement.innerHTML = text.substring(0, index + 1) + "<span id='cursor'>|</span>";
        index++;
        setTimeout(typeWriter, 100);
    } else {
        cursorElement.style.animation = 'none';
    }
}

window.onload = () => {
    typeWriter();
};