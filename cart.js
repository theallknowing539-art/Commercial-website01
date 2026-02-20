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

// Cart functionality
document.addEventListener('DOMContentLoaded', function() {
    loadCartItems();
    updateHeaderCartCount();
    
    // Continue shopping button
    document.getElementById('continueShoppingBtn')?.addEventListener('click', function() {
        window.location.href = 'Items.html';
    });
    
    // Checkout button
    document.getElementById('checkoutBtn')?.addEventListener('click', function() {
        const cart = JSON.parse(localStorage.getItem('cart')) || [];
        if (cart.length > 0) {
            alert('Thank you for your order! This is a demo - in a real store, you would proceed to payment here.');
        }
    });
});

// Load and display cart items
function loadCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartContainer = document.getElementById('cartItemsContainer');
    const checkoutBtn = document.getElementById('checkoutBtn');
    
    if (cart.length === 0) {
        // Show empty cart message
        cartContainer.innerHTML = `
            <div class="empty-cart-message">
                <div class="empty-cart-icon">🛒</div>
                <p>Your cart is empty</p>
                <button class="continue-shopping-btn" onclick="window.location.href='Items.html'">
                    Start Shopping
                </button>
            </div>
        `;
        if (checkoutBtn) checkoutBtn.disabled = true;
        updateSummary(0);
        return;
    }
    
    // Enable checkout button
    if (checkoutBtn) checkoutBtn.disabled = false;
    
    // Build cart items HTML
    let cartHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
        const itemTotal = item.price * item.quantity;
        subtotal += itemTotal;
        
        cartHTML += `
            <div class="cart-item" data-index="${index}">
                <div class="cart-item-image">
                    <img src="${item.image}" alt="${item.name}" onerror="this.src='images/placeholder.jpg'">
                </div>
                <div class="cart-item-details">
                    <h3 class="cart-item-name">${item.name}</h3>
                    <p class="cart-item-price">${item.price} DA</p>
                    <div class="cart-item-quantity">
                        <label>Quantity:</label>
                        <select class="quantity-select" data-index="${index}">
                            ${generateQuantityOptions(item.quantity, item.maxQuantity || 10)}
                        </select>
                    </div>
                    <p class="cart-item-total">Total: ${itemTotal} DA</p>
                </div>
                <button class="remove-item" onclick="removeFromCart(${index})">✕</button>
            </div>
        `;
    });
    
    cartContainer.innerHTML = cartHTML;
    updateSummary(subtotal);
    
    // Add event listeners to quantity selects
    document.querySelectorAll('.quantity-select').forEach(select => {
        select.addEventListener('change', function(e) {
            updateQuantity(this.dataset.index, parseInt(this.value));
        });
    });
}

// Generate options for quantity select
function generateQuantityOptions(current, max) {
    let options = '';
    for (let i = 1; i <= max; i++) {
        options += `<option value="${i}" ${i === current ? 'selected' : ''}>${i}</option>`;
    }
    return options;
}

// Update item quantity
function updateQuantity(index, newQuantity) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    if (cart[index]) {
        cart[index].quantity = newQuantity;
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems(); // Reload cart display
        updateHeaderCartCount(); // Update header count
    }
}

// Remove item from cart
function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    // Show confirmation
    if (confirm('Remove this item from your cart?')) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        loadCartItems(); // Reload cart display
        updateHeaderCartCount(); // Update header count
    }
}

// Update order summary
function updateSummary(subtotal) {
    document.getElementById('subtotal').textContent = `${subtotal} DA`;
    document.getElementById('total').textContent = `${subtotal} DA`;
}

// Update cart count in header
function updateHeaderCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const countBadge = document.getElementById('cartCountBadge');
    
    if (cart.length > 0) {
        countBadge.textContent = cart.length;
        countBadge.style.display = 'flex';
    } else {
        countBadge.style.display = 'none';
    }
}