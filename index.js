const button = document.getElementById("scrollButton");
const target = document.getElementById("targetDiv");

button.addEventListener("click", () => {
    target.scrollIntoView({
        behavior: "smooth"  // smooth scroll
    });
});
//transition script 
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
