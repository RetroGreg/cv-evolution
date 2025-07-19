document.addEventListener("DOMContentLoaded", function () {
  // "separators"
  function onIntersection(entries, observer) {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate");
      } else {
        entry.target.classList.remove("animate");
      }
    });
  }

  const observer = new IntersectionObserver(onIntersection, {
    threshold: 0.5,
  });

  const separators = document.querySelectorAll(".separator");
  separators.forEach((separator) => observer.observe(separator));

  // Hamburger menu display
  const menuToggle = document.querySelector(".menu-toggle");
  const stickyNav = document.querySelector(".sticky-nav");

  menuToggle.addEventListener("click", function () {
    stickyNav.classList.toggle("active");
  });

  // Closing the hamburger menu after click
  document.querySelectorAll(".sticky-nav ul li a").forEach((link) => {
    link.addEventListener("click", function () {
      stickyNav.classList.remove("active");
    });
  });

  document
    .querySelector(".theme-switch__checkbox")
    .addEventListener("change", function () {
      document.body.classList.toggle("dark-mode");
      if (this.checked) {
        localStorage.setItem("darkMode", true);
      } else {
        localStorage.setItem("darkMode", false);
      }
    });

  // Check the dark mode state from local storage
  if (localStorage.getItem("darkMode") === "true") {
    document.body.classList.add("dark-mode");
    document.querySelector(".theme-switch__checkbox").checked = true;
  }
  // Save the user's preference in local storage
  const isDarkMode = document.body.classList.contains("dark-mode");
});

// Smooth Scrolling
document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
  anchor.addEventListener("click", function (e) {
    e.preventDefault();
    document.querySelector(this.getAttribute("href")).scrollIntoView({
      behavior: "smooth",
    });
  });
});

document.querySelector('.back-to-top').addEventListener('click', function(e) {
  e.preventDefault();
  window.scrollTo({top: 0, behavior: 'smooth'});
}); 

// Text to animate
const textArray = [
  "Développeur web / web mobile",
  "Passionné par la technologie",
  "Prêt pour de nouveaux défis",
  "Créatif et orienté solutions",
  "En quête d'apprentissage"
];
let index = 0;
let charIndex = 0;
let currentPhraseIndex = 0;
let isTyping = false;
let isDeleting = false;

function typeWriter() {
  const textElement = document.getElementById("text");
  const currentPhrase = textArray[currentPhraseIndex];
  
  if (isDeleting) {
    textElement.textContent = currentPhrase.substring(0, charIndex--);
    if (charIndex < 0) {
      isDeleting = false;
      currentPhraseIndex = (currentPhraseIndex + 1) % textArray.length; 
      setTimeout(typeWriter, 500); 
    } else {
      setTimeout(typeWriter, 50); 
    }
  } else {
    textElement.textContent = currentPhrase.substring(0, charIndex + 1); 
    if (charIndex === currentPhrase.length - 1) {
      isDeleting = true;
      setTimeout(typeWriter, 2000); 
    } else {
      charIndex++;
      setTimeout(typeWriter, 100);
    }
  }
}

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting && !isTyping) {
        isTyping = true;
        typeWriter(); 
      }
    });
  },
  { threshold: 0.1 }
); 

observer.observe(document.getElementById("typewriter"));

// Stars

const starField = document.querySelector('.star-field');
const starCount = 100;

for (let i = 0; i < starCount; i++) {
  const star = document.createElement('div');
  star.classList.add('star');
  
  const posX = Math.random() * 100; 
  const posY = Math.random() * 100; 
  
  star.style.left = `${posX}%`;
  star.style.top = `${posY}%`;

  const starSize = Math.random() * 2 + 1;
  star.style.width = `${starSize}px`;
  star.style.height = `${starSize}px`;

  const moveX = Math.random() * 200 - 100; 
  const moveY = Math.random() * 200 - 100;
  star.style.setProperty('--moveX', `${moveX}px`);
  star.style.setProperty('--moveY', `${moveY}px`);

  starField.appendChild(star);
}
window.addEventListener('load', () => {
  const starField = document.querySelector('.star-field');
  starField.style.height = `${window.innerHeight}px`;
  window.addEventListener('resize', () => {
    starField.style.height = `${window.innerHeight}px`;
  });
});