/**
 * Odette Pastry - Main JavaScript
 * Basic interactivity and cart functionality
 */

// ========================================
// CART FUNCTIONALITY
// ========================================

let cart = [];
let cartCount = 0;

// Initialize cart from localStorage if it exists
function initCart() {
    const savedCart = localStorage.getItem('odette-cart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        updateCartCount();
    }
}

// Update cart count display
function updateCartCount() {
    cartCount = cart.reduce((total, item) => total + item.quantity, 0);
    const cartCountElement = document.querySelector('.cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = cartCount;
    }
}

// Add item to cart
function addToCart(productName, price) {
    const existingItem = cart.find(item => item.name === productName);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            name: productName,
            price: price,
            quantity: 1
        });
    }
    
    // Save to localStorage
    localStorage.setItem('odette-cart', JSON.stringify(cart));
    
    // Update UI
    updateCartCount();
    showNotification(`✅ ${productName} adăugat în coș!`);
}

// Remove item from cart
function removeFromCart(productName) {
    cart = cart.filter(item => item.name !== productName);
    localStorage.setItem('odette-cart', JSON.stringify(cart));
    updateCartCount();
    showNotification(`🗑️ ${productName} eliminat din coș!`);
}

// Clear entire cart
function clearCart() {
    cart = [];
    localStorage.removeItem('odette-cart');
    updateCartCount();
    showNotification('🗑️ Coșul a fost golit!');
}

// ========================================
// NOTIFICATION SYSTEM
// ========================================

function showNotification(message, duration = 3000) {
    // Remove existing notification if any
    const existingNotification = document.querySelector('.notification');
    if (existingNotification) {
        existingNotification.remove();
    }
    
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background-color: #1e3a8a;
        color: white;
        padding: 16px 24px;
        border-radius: 8px;
        box-shadow: 0 10px 15px -3px rgba(0, 0, 0, 0.1);
        z-index: 9999;
        animation: slideIn 0.3s ease-out;
        font-weight: 600;
    `;
    
    // Add animation styles
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideIn {
            from {
                transform: translateX(400px);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        @keyframes slideOut {
            from {
                transform: translateX(0);
                opacity: 1;
            }
            to {
                transform: translateX(400px);
                opacity: 0;
            }
        }
    `;
    
    if (!document.querySelector('style[data-notification-styles]')) {
        style.setAttribute('data-notification-styles', 'true');
        document.head.appendChild(style);
    }
    
    document.body.appendChild(notification);
    
    // Remove after duration
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => notification.remove(), 300);
    }, duration);
}

// ========================================
// SMOOTH SCROLLING
// ========================================

function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            const href = this.getAttribute('href');
            
            // Don't prevent default for empty anchors
            if (href === '#') return;
            
            e.preventDefault();
            
            const target = document.querySelector(href);
            if (target) {
                const headerOffset = 80;
                const elementPosition = target.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
}

// ========================================
// PRODUCT CARD INTERACTIONS
// ========================================

function initProductCards() {
    // Get all "Add to Cart" buttons
    const addToCartButtons = document.querySelectorAll('.product-card .btn-primary');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get product information from the card
            const productCard = this.closest('.product-card');
            const productName = productCard.querySelector('.product-title').textContent.trim();
            const priceText = productCard.querySelector('.product-price').textContent.trim();
            const price = parseInt(priceText.replace(/[^0-9]/g, ''));
            
            // Add to cart
            addToCart(productName, price);
        });
    });
}

// ========================================
// HEADER SCROLL EFFECT
// ========================================

function initHeaderScroll() {
    const header = document.querySelector('.header');
    let lastScroll = 0;
    
    window.addEventListener('scroll', () => {
        const currentScroll = window.pageYOffset;
        
        if (currentScroll > 100) {
            header.style.boxShadow = '0 4px 6px -1px rgba(0, 0, 0, 0.1)';
        } else {
            header.style.boxShadow = '0 1px 2px 0 rgba(0, 0, 0, 0.05)';
        }
        
        lastScroll = currentScroll;
    });
}

// ========================================
// CART BUTTON FUNCTIONALITY
// ========================================

function initCartButton() {
    const cartButton = document.querySelector('.btn-cart');
    
    if (cartButton) {
        cartButton.addEventListener('click', function(e) {
            e.preventDefault();
            
            if (cart.length === 0) {
                showNotification('🛒 Coșul tău este gol!');
                return;
            }
            
            // Show cart summary
            showCartSummary();
        });
    }
}

// Show cart summary (simple alert for now, can be enhanced with a modal)
function showCartSummary() {
    let summary = '🛒 COȘUL TĂU:\n\n';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        summary += `${item.name}\n`;
        summary += `  ${item.quantity} x ${item.price} LEI = ${itemTotal} LEI\n\n`;
        total += itemTotal;
    });
    
    summary += `━━━━━━━━━━━━━━━━━━━\n`;
    summary += `TOTAL: ${total} LEI\n\n`;
    summary += `Vrei să finalizezi comanda?`;
    
    if (confirm(summary)) {
        showNotification('🎉 Redirecționare către checkout...');
        // Here you would redirect to checkout page
        // window.location.href = 'checkout.html';
    }
}

// ========================================
// CTA BUTTONS
// ========================================

function initCTAButtons() {
    // Main CTA buttons
    const ctaButtons = document.querySelectorAll('.hero .btn-primary, .cta .btn-primary');
    
    ctaButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Scroll to products section
            const productsSection = document.getElementById('products');
            if (productsSection) {
                const headerOffset = 80;
                const elementPosition = productsSection.getBoundingClientRect().top;
                const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
                
                window.scrollTo({
                    top: offsetPosition,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Secondary CTA buttons (custom order)
    const secondaryButtons = document.querySelectorAll('.hero .btn-secondary, .product-card .btn-secondary');
    
    secondaryButtons.forEach(button => {
        button.addEventListener('click', function(e) {
            e.preventDefault();
            showNotification('📞 Contactează-ne pentru o comandă personalizată!');
            // Here you would redirect to contact page or open a contact form
            // window.location.href = 'contact.html';
        });
    });
}

// ========================================
// RESPONSIVE MENU (for mobile - future enhancement)
// ========================================

function initMobileMenu() {
    // Add mobile menu toggle button if needed
    const nav = document.querySelector('.nav');
    
    // This is a placeholder for future mobile menu functionality
    // You can enhance this based on your needs
}

// ========================================
// INITIALIZATION
// ========================================

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🦢 Odette Pastry - Site loaded successfully!');
    
    // Initialize all features
    initCart();
    initSmoothScroll();
    initProductCards();
    initHeaderScroll();
    initCartButton();
    initCTAButtons();
    initMobileMenu();
    
    // Show welcome message (optional)
    setTimeout(() => {
        // showNotification('👋 Bine ai venit la Odette Pastry!', 2000);
    }, 500);
});

// ========================================
// UTILITY FUNCTIONS
// ========================================

// Format price
function formatPrice(price) {
    return `${price} LEI`;
}

// Get cart total
function getCartTotal() {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
}

// Export functions for use in other scripts
window.OdettePastry = {
    addToCart,
    removeFromCart,
    clearCart,
    getCartTotal,
    showNotification
};

console.log('✅ Odette Pastry JavaScript loaded!');