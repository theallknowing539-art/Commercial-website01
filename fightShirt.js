//transition
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");

            // ❗ STOP observing this element after animation runs once
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

const buttons = document.querySelectorAll("[data-carousel-button]") // querySelectorAll, not querySelector with array
buttons.forEach(button => {
    button.addEventListener("click", () => { // addEventListener, not addEveentListener
        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]") // Missing closing bracket
        
        const activeSlide = slides.querySelector("[data-active]")
        let newIndex = [...slides.children].indexOf(activeSlide) + offset // + not =
        if(newIndex < 0) newIndex = slides.children.length - 1
        if(newIndex >= slides.children.length) newIndex = 0
        
        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
    })
})