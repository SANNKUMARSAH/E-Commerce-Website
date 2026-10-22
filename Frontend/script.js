
// ==========================================
// HERO SLIDER - FINAL FIX
// ==========================================

let slideIndex = 1;
let slideTimer = null;

// ==========================================
// INITIALIZE SLIDER
// ==========================================

function initHeroSlider() {
    const slider = document.querySelector(".hero-slider");

    // Home page par slider nahi hai
    if (!slider) {
        clearInterval(slideTimer);
        slideTimer = null;
        return;
    }

    // Purana timer band karo
    if (slideTimer) {
        clearInterval(slideTimer);
    }

    // First slide show karo
    slideIndex = 1;
    showSlide(slideIndex);

    // Automatic slider
    slideTimer = setInterval(function () {
        changeSlide(1);
    }, 4000);
}

// ==========================================
// NEXT / PREVIOUS SLIDE
// ==========================================

function changeSlide(n) {
    showSlide(slideIndex + n);
}

// ==========================================
// GO TO SPECIFIC SLIDE
// ==========================================

function currentSlide(n) {
    showSlide(n);
}

// ==========================================
// SHOW SLIDE
// ==========================================

function showSlide(n) {
    const slider = document.querySelector(".hero-slider");

    if (!slider) return;

    const slides = slider.querySelectorAll(".slide");
    const dots = slider.querySelectorAll(".dot");

    if (slides.length === 0) return;

    // Loop slides
    if (n > slides.length) {
        n = 1;
    }

    if (n < 1) {
        n = slides.length;
    }

    slideIndex = n;

    // Update slides
    slides.forEach(function (slide, index) {
        slide.classList.toggle("active", index === slideIndex - 1);
    });

    // Update dots
    dots.forEach(function (dot, index) {
        dot.classList.toggle("active", index === slideIndex - 1);
    });
}

// ==========================================
// PAGE LOAD
// ==========================================

if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", initHeroSlider);
} else {
    initHeroSlider();
}

// ==========================================
// BROWSER BACK / FORWARD FIX
// ==========================================

window.addEventListener("pageshow", function () {
    initHeroSlider();
});
