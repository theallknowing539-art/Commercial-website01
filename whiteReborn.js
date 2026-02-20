// Fade-in animation on scroll
const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("show");
            observer.unobserve(entry.target);
        }
    });
}, { threshold: 0.1 });
document.querySelectorAll(".fade-in").forEach(el => observer.observe(el));

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
        
        // Hide zoom when changing slides
        document.querySelectorAll('.zoom-lens, .zoom-result').forEach(el => {
            el.style.display = 'none';
        });
    })
})

// ========== BEAUTIFUL MAGNIFIER ==========

function initMagnifier() {
    // Only on desktop
    if (window.innerWidth < 769) return;
    
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
    
    // Remove old listeners by replacing with new ones
    container.onmouseenter = function() {
        lens.style.display = 'block';
        result.style.display = 'block';
    };
    
    container.onmousemove = function(e) {
        const rect = this.getBoundingClientRect();
        
        // Mouse position relative to container
        let x = e.clientX - rect.left;
        let y = e.clientY - rect.top;
        
        // Keep lens inside bounds
        const lensW = lens.offsetWidth;
        const lensH = lens.offsetHeight;
        
        x = Math.min(Math.max(x, lensW/2), rect.width - lensW/2);
        y = Math.min(Math.max(y, lensH/2), rect.height - lensH/2);
        
        // Move lens
        lens.style.left = x + 'px';
        lens.style.top = y + 'px';
        
        // Calculate background position (centered on lens)
        const bgX = (x / rect.width) * 100;
        const bgY = (y / rect.height) * 100;
        
        result.style.backgroundPosition = `${bgX}% ${bgY}%`;
    };
    
    container.onmouseleave = function() {
        lens.style.display = 'none';
        result.style.display = 'none';
    };
}

// Initialize after everything loads
window.addEventListener('load', function() {
    setTimeout(initMagnifier, 500);
});

// Re-init on slide change
const slideObserver = new MutationObserver(function() {
    setTimeout(initMagnifier, 300);
});

const slides = document.querySelector('[data-slides]');
if (slides) {
    slideObserver.observe(slides, { 
        attributes: true, 
        attributeFilter: ['data-active'] 
    });
}

// Re-init on resize
let resizeTimer;
window.addEventListener('resize', function() {
    clearTimeout(resizeTimer);
    resizeTimer = setTimeout(initMagnifier, 250);
});

// ========== CART FUNCTIONALITY ==========

// Function to update the cart count in the header
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartIcon) return;
    
    // Check if count badge already exists
    let countBadge = document.querySelector('.cart-count-badge');
    
    if (cart.length > 0) {
        if (!countBadge) {
            // Create badge if it doesn't exist
            countBadge = document.createElement('span');
            countBadge.className = 'cart-count-badge';
            cartIcon.parentElement.appendChild(countBadge);
        }
        countBadge.textContent = cart.length;
        countBadge.style.display = 'flex';
    } else {
        // Remove badge if cart is empty
        if (countBadge) {
            countBadge.remove();
        }
    }
}

// ========== SIMPLIFIED CART FUNCTIONALITY ==========

// Function to update cart count
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartIcon = document.querySelector('.cart-icon');
    
    if (!cartIcon) return;
    
    // Remove existing badge
    const oldBadge = document.querySelector('.cart-count-badge');
    if (oldBadge) oldBadge.remove();
    
    if (cart.length > 0) {
        // Create new badge
        const badge = document.createElement('span');
        badge.className = 'cart-count-badge';
        badge.textContent = cart.length;
        badge.style.position = 'absolute';
        badge.style.top = '-8px';
        badge.style.right = '-8px';
        badge.style.backgroundColor = '#ff4444';
        badge.style.color = 'white';
        badge.style.fontSize = '12px';
        badge.style.fontWeight = 'bold';
        badge.style.minWidth = '18px';
        badge.style.height = '18px';
        badge.style.borderRadius = '9px';
        badge.style.display = 'flex';
        badge.style.alignItems = 'center';
        badge.style.justifyContent = 'center';
        badge.style.padding = '0 4px';
        
        cartIcon.parentElement.style.position = 'relative';
        cartIcon.parentElement.appendChild(badge);
    }
}

// Function to show notification
function showNotification(message) {
    // Remove any existing notification
    const oldNotif = document.querySelector('.cart-notification');
    if (oldNotif) oldNotif.remove();
    
    // Create notification
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
    notification.style.animation = 'slideIn 0.3s ease';
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 3000);
}

// Wait for everything to load
window.addEventListener('load', function() {
    console.log('Window loaded - setting up cart');
    
    // Update cart count
    updateCartCount();
    
    // Get elements
    const decreaseBtn = document.getElementById('decreaseQty');
    const increaseBtn = document.getElementById('increaseQty');
    const quantityInput = document.getElementById('quantity');
    const addToCartBtn = document.getElementById('addToCart');
    
    console.log('Elements found:', {
        decrease: !!decreaseBtn,
        increase: !!increaseBtn,
        input: !!quantityInput,
        addBtn: !!addToCartBtn
    });
    
    // Set up quantity buttons
    if (decreaseBtn && increaseBtn && quantityInput) {
        console.log('Setting up quantity buttons');
        
        decreaseBtn.onclick = function() {
            console.log('Minus clicked');
            let val = parseInt(quantityInput.value);
            if (val > 1) {
                quantityInput.value = val - 1;
                console.log('New value:', quantityInput.value);
            }
        };
        
        increaseBtn.onclick = function() {
            console.log('Plus clicked');
            let val = parseInt(quantityInput.value);
            if (val < 10) {
                quantityInput.value = val + 1;
                console.log('New value:', quantityInput.value);
            }
        };
    }
    
    // Set up add to cart button
    if (addToCartBtn) {
        console.log('Setting up add to cart button');
        
        addToCartBtn.onclick = function() {
            console.log('Add to cart clicked');
            
            // Get product info
            const productId = window.location.pathname.includes('whiteReborn') ? 'whiteReborn' : 'fightShirt';
            const productName = document.querySelector('.shirt-title')?.textContent || 'Echo Tee';
            const quantity = parseInt(quantityInput ? quantityInput.value : 1);
            
            // Get image
            let productImage = 'images/fightShirtFront.png';
            if (productId === 'whiteReborn') {
                productImage = 'images/WHITE full mockup.jpg';
            }
            
            // Create product object
            const product = {
                id: productId,
                name: productName,
                price: 2900,
                quantity: quantity,
                image: productImage
            };
            
            console.log('Adding product:', product);
            
            // Get cart
            let cart = JSON.parse(localStorage.getItem('cart')) || [];
            
            // Check if exists
            const existing = cart.findIndex(item => item.id === product.id);
            
            if (existing > -1) {
                cart[existing].quantity += product.quantity;
            } else {
                cart.push(product);
            }
            
            // Save cart
            localStorage.setItem('cart', JSON.stringify(cart));
            console.log('Cart saved:', cart);
            
            // Update UI
            updateCartCount();
            showNotification(product.name + ' added to cart!');
            
            // Button animation
            addToCartBtn.style.transform = 'scale(0.95)';
            setTimeout(() => {
                addToCartBtn.style.transform = '';
            }, 200);
        };
    }
});