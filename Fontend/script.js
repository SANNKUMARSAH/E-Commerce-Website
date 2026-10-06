// ==========================================
// HERO SLIDER
// ==========================================

let slideIndex = 1;

// Show first slide
showSlide(slideIndex);


// ==========================================
// NEXT / PREVIOUS SLIDE
// ==========================================

function changeSlide(n) {
    showSlide(slideIndex += n);
}


// ==========================================
// GO TO SPECIFIC SLIDE
// ==========================================

function currentSlide(n) {
    showSlide(slideIndex = n);
}


// ==========================================
// SHOW SLIDE
// ==========================================

function showSlide(n) {

    const slides = document.querySelectorAll(".slide");
    const dots = document.querySelectorAll(".dot");

    // No slides found
    if (slides.length === 0) {
        return;
    }

    // Reset to first slide
    if (n > slides.length) {
        slideIndex = 1;
    }

    // Go to last slide
    if (n < 1) {
        slideIndex = slides.length;
    }

    // Remove active class from all slides
    slides.forEach(function (slide) {
        slide.classList.remove("active");
    });

    // Remove active class from all dots
    dots.forEach(function (dot) {
        dot.classList.remove("active");
    });

    // Add active class to current slide
    slides[slideIndex - 1].classList.add("active");

    // Add active class to current dot
    if (dots.length > 0 && dots[slideIndex - 1]) {
        dots[slideIndex - 1].classList.add("active");
    }
}


// ==========================================
// AUTOMATIC SLIDER
// ==========================================

setInterval(function () {
    changeSlide(1);
}, 4000);