// Fade-in animation on scroll
const fadeObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            fadeObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll(".fade-in").forEach(el => fadeObserver.observe(el));

// Carousel functionality
const buttons = document.querySelectorAll("[data-carousel-button]")
buttons.forEach(button => {
    button.addEventListener("click", () => {
        const offset = button.dataset.carouselButton === "next" ? 1 : -1
        const slides = button
            .closest("[data-carousel]")
            .querySelector("[data-slides]")
        
        const activeSlide = slides.querySelector("[data-active]")
        let newIndex = [...slides.children].indexOf(activeSlide) + offset
        if(newIndex < 0) newIndex = slides.children.length - 1
        if(newIndex >= slides.children.length) newIndex = 0
        
        slides.children[newIndex].dataset.active = true
        delete activeSlide.dataset.active
        
        // Hide any visible magnifier elements when switching slides
        document.querySelectorAll('.zoom-lens, .zoom-result').forEach(el => {
            el.style.display = 'none';
        });
    })
})

// ========== MAGNIFIER FUNCTIONALITY ==========

function initMagnifier() {
    // Only on desktop
    if (window.innerWidth < 1024) return;
    
    const activeSlide = document.querySelector('.slide[data-active]');
    if (!activeSlide) return;
    
    const container = activeSlide.querySelector('.zoom-container');
    const img = activeSlide.querySelector('.zoom-image');
    const lens = activeSlide.querySelector('.zoom-lens');
    const result = activeSlide.querySelector('.zoom-result');
    
    if (!container || !img || !lens || !result) return;
    
    // Set result background
    result.style.backgroundImage = `url('${img.src}')`;
    result.style.backgroundSize = '300% 300%';
    
    // Remove old listeners (just to be safe)
    container.onmouseenter = null;
    container.onmousemove = null;
    container.onmouseleave = null;
    
    // Add new listeners
    container.onmouseenter = () => {
        lens.style.display = 'block';
        result.style.display = 'block';
    };
    
    container.onmousemove = (e) => {
        const rect = container.getBoundingClientRect();
        
        // Mouse position relative to container
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        // Keep lens inside bounds
        const lensW = lens.offsetWidth;
        const lensH = lens.offsetHeight;
        
        x = Math.min(Math.max(x, lensW/2), rect.width - lensW/2);
        y = Math.min(Math.max(y, lensH/2), rect.height - lensH/2);
        
        // Position lens
        lens.style.left = x + 'px';
        lens.style.top = y + 'px';
        
        // Calculate background position (center the lens area in result)
        const bgX = (x / rect.width) * 100;
        const bgY = (y / rect.height) * 100;
        
        result.style.backgroundPosition = `${bgX}% ${bgY}%`;
    };
    
    container.onmouseleave = () => {
        lens.style.display = 'none';
        result.style.display = 'none';
    };
}

// ========== CART FUNCTIONALITY ==========

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.cart-icon');
    if (!cartIcon) return;
    
    let countBadge = document.querySelector('.cart-count-badge');
    
    if (cart.length > 0) {
        if (!countBadge) {
            countBadge = document.createElement('span');
            countBadge.className = 'cart-count-badge';
            cartIcon.parentElement.appendChild(countBadge);
        }
        countBadge.textContent = cart.length;
    } else {
        if (countBadge) countBadge.remove();
    }
}

function showNotification(message) {
    const oldNotif = document.querySelector('.cart-notification');
    if (oldNotif) oldNotif.remove();
    
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#1E2B2F';
    notification.style.color = 'white';
    notification.style.padding = '12px 24px';
    notification.style.borderRadius = '50px';
    notification.style.boxShadow = '0 4px 15px rgba(0,0,0,0.2)';
    notification.style.zIndex = '9999';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Update cart count
    updateCartCount();
    
    // Initialize magnifier
    setTimeout(initMagnifier, 500);
    
    // Quantity selector
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');
    const addToCartBtn = document.getElementById('addToCart');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        decreaseBtn.onclick = () => {
            let val = parseInt(quantityInput.value);
            if (val > 1) quantityInput.value = val - 1;
        };
        
        increaseBtn.onclick = () => {
            let val = parseInt(quantityInput.value);
            if (val < 10) quantityInput.value = val + 1;
        };
    }
    
    // Add to cart
    if (addToCartBtn) {
        addToCartBtn.onclick = () => {
            const path = window.location.pathname;
            const isWhiteReborn = path.includes('whiteReborn');
            
            const product = {
                id: isWhiteReborn ? 'whiteReborn' : 'fightShirt',
                name: isWhiteReborn ? 'White Reborn Tee' : document.querySelector('.shirt-title')?.textContent || 'Black Echo Tee',
                price: 2900,
                quantity: parseInt(quantityInput?.value || 1),
                image: isWhiteReborn ? 'images/WHITE full mockup.jpg' : 'images/fightShirtFront.png'
            };
            
            // Get existing cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if exists
            const existingIndex = cart.findIndex(item => item.id === product.id);
            
            if (existingIndex > -1) {
                cart[existingIndex].quantity += product.quantity;
            } else {
                cart.push(product);
            }
            
            // Save cart
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update UI
            updateCartCount();
            showNotification(`${product.name} added to cart!`);
            
            // Button animation
            addToCartBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                addToCartBtn.style.transform = '';
            }, 200);
        };
    }
});

// Re-initialize magnifier on slide change - FIXED: observe subtree to detect attribute changes on children
const slideObserver = new MutationObserver((mutations) => {
    mutations.forEach((mutation) => {
        if (mutation.type === 'attributes' && mutation.attributeName === 'data-active') {
            // Small delay to ensure DOM is updated
            setTimeout(initMagnifier, 100);
        }
    });
});

const slidesContainer = document.querySelector('[data-slides]');
if (slidesContainer) {
    // Observe the container and its descendants for attribute changes
    slideObserver.observe(slidesContainer, { 
        attributes: true,
        subtree: true,
        attributeFilter: ['data-active'] 
    });
}

// Re-initialize on resize
let resizeTimer;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMagnifier, 250);
});