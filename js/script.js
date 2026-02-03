const slider = document.querySelector('.header-slider ul');
const prev_btn = document.querySelector('.control_prev');
const next_btn = document.querySelector('.control_next');

let currentSlide = 0;
const totalSlides = 6; // 6 images

function updateSlider() {
    const translateX = -currentSlide * (100 / totalSlides);
    if (slider) {
        slider.style.transform = `translateX(${translateX}%)`;
    }
}

if (prev_btn) {
    prev_btn.addEventListener('click', (e) => {
        e.preventDefault();
        currentSlide = (currentSlide > 0) ? currentSlide - 1 : totalSlides - 1;
        updateSlider();
    });
}

if (next_btn) {
    next_btn.addEventListener('click', (e) => {
        e.preventDefault();
        currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
        updateSlider();
    });
}

// Auto-slide functionality with pause on hover
let autoSlideInterval;

function startAutoSlide() {
    autoSlideInterval = setInterval(() => {
        currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
        updateSlider();
    }, 5000);
}

function stopAutoSlide() {
    clearInterval(autoSlideInterval);
}

// Start auto-slide
startAutoSlide();

// Pause on hover
const sliderContainer = document.querySelector('.header-slider');
if (sliderContainer) {
    sliderContainer.addEventListener('mouseenter', stopAutoSlide);
    sliderContainer.addEventListener('mouseleave', startAutoSlide);
}

// Enhanced product slider scroll functionality
const ScrollContainer = document.querySelectorAll('.products');
for (const item of ScrollContainer){
    item.addEventListener('wheel', (evt)=>{
        evt.preventDefault();
        item.scrollLeft +=evt.deltaY;
    });
    
    // Add smooth scrolling buttons for product sliders
    const parent = item.parentElement;
    if (parent && !parent.querySelector('.scroll-btn')) {
        const leftBtn = document.createElement('button');
        leftBtn.className = 'scroll-btn scroll-left';
        leftBtn.innerHTML = '&#8249;';
        leftBtn.style.cssText = `
            position: absolute;
            left: 10px;
            top: 50%;
            transform: translateY(-50%);
            background: rgba(255,255,255,0.9);
            border: none;
            border-radius: 50%;
            width: 40px;
            height: 40px;
            font-size: 20px;
            cursor: pointer;
            z-index: 10;
            box-shadow: 0 2px 10px rgba(0,0,0,0.1);
            transition: all 0.3s ease;
        `;
        
        const rightBtn = document.createElement('button');
        rightBtn.className = 'scroll-btn scroll-right';
        rightBtn.innerHTML = '&#8250;';
        rightBtn.style.cssText = leftBtn.style.cssText.replace('left: 10px', 'right: 10px');
        
        parent.style.position = 'relative';
        parent.appendChild(leftBtn);
        parent.appendChild(rightBtn);
        
        leftBtn.addEventListener('click', () => {
            item.scrollBy({ left: -200, behavior: 'smooth' });
        });
        
        rightBtn.addEventListener('click', () => {
            item.scrollBy({ left: 200, behavior: 'smooth' });
        });
        
        // Show/hide buttons based on scroll position
        item.addEventListener('scroll', () => {
            leftBtn.style.opacity = item.scrollLeft > 0 ? '1' : '0.5';
            rightBtn.style.opacity = item.scrollLeft < (item.scrollWidth - item.clientWidth) ? '1' : '0.5';
        });
    }
}

// Add loading animation for images
document.addEventListener('DOMContentLoaded', function() {
    const images = document.querySelectorAll('img');
    images.forEach(img => {
        // Handle image load success
        img.addEventListener('load', function() {
            this.style.opacity = '1';
            this.style.transform = 'scale(1)';
        });
        
        // Handle image load error
        img.addEventListener('error', function() {
            this.style.opacity = '0.5';
            this.style.background = '#f0f0f0';
            this.style.border = '1px solid #ddd';
            this.alt = this.alt || 'Image not available';
            console.warn('Image failed to load:', this.src);
        });
        
        // Set initial state
        img.style.opacity = '0';
        img.style.transform = 'scale(0.95)';
        img.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        
        // If image is already loaded (cached)
        if (img.complete && img.naturalHeight !== 0) {
            img.style.opacity = '1';
            img.style.transform = 'scale(1)';
        }
    });
});

// Enhanced search functionality
const searchInput = document.querySelector('.nav-search-input');
if (searchInput) {
    let searchTimeout;
    
    // Search suggestions
    const searchSuggestions = {
        'bags': 'checkout.html',
        'handcrafts': 'checkout.html',
        'jewelry': 'checkout.html',
        'furniture': 'checkout.html',
        'clothes': 'checkout.html',
        'art': 'checkout.html',
        'pottery': 'checkout.html',
        'woodwork': 'checkout.html',
        'textiles': 'checkout.html',
        'toys': 'checkout.html',
        'grooming': 'checkout.html',
        'pets': 'checkout.html',
        'fashion': 'checkout.html',
        'chairs': 'checkout.html',
        'laptops': 'checkout.html',
        'stationary': 'checkout.html'
    };
    
    searchInput.addEventListener('input', function() {
        clearTimeout(searchTimeout);
        const query = this.value.trim().toLowerCase();
        
        if (query.length > 0) {
            this.style.background = '#fff';
            
            // Show search suggestions
            let suggestionDiv = document.querySelector('.search-suggestions');
            if (!suggestionDiv) {
                suggestionDiv = document.createElement('div');
                suggestionDiv.className = 'search-suggestions';
                suggestionDiv.style.cssText = `
                    position: absolute;
                    top: 100%;
                    left: 0;
                    right: 0;
                    background: white;
                    border: 1px solid #ddd;
                    border-radius: 0 0 10px 10px;
                    box-shadow: 0 4px 10px rgba(0,0,0,0.1);
                    z-index: 1000;
                    max-height: 200px;
                    overflow-y: auto;
                `;
                this.parentElement.style.position = 'relative';
                this.parentElement.appendChild(suggestionDiv);
            }
            
            // Filter suggestions
            const matches = Object.keys(searchSuggestions).filter(item => 
                item.includes(query)
            );
            
            if (matches.length > 0) {
                suggestionDiv.innerHTML = matches.map(match => 
                    `<div class="suggestion-item" style="padding: 10px; cursor: pointer; border-bottom: 1px solid #eee;" data-query="${match}">${match}</div>`
                ).join('');
                
                // Add click handlers
                suggestionDiv.querySelectorAll('.suggestion-item').forEach(item => {
                    item.addEventListener('click', function() {
                        searchInput.value = this.dataset.query;
                        performSearch(this.dataset.query);
                        suggestionDiv.style.display = 'none';
                    });
                });
            } else {
                suggestionDiv.innerHTML = '<div style="padding: 10px; color: #999;">No suggestions found</div>';
            }
        } else {
            const suggestionDiv = document.querySelector('.search-suggestions');
            if (suggestionDiv) suggestionDiv.style.display = 'none';
        }
    });
    
    searchInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            e.preventDefault();
            const query = this.value.trim().toLowerCase();
            if (query) {
                performSearch(query);
            }
        }
    });
    
    function performSearch(query) {
        const suggestions = {
            'bags': 'checkout.html',
            'handcrafts': 'checkout.html',
            'jewelry': 'checkout.html',
            'furniture': 'checkout.html',
            'clothes': 'checkout.html',
            'art': 'checkout.html',
            'pottery': 'checkout.html',
            'woodwork': 'checkout.html',
            'textiles': 'checkout.html',
            'toys': 'checkout.html',
            'grooming': 'checkout.html',
            'pets': 'checkout.html',
            'fashion': 'checkout.html',
            'chairs': 'checkout.html',
            'laptops': 'checkout.html',
            'stationary': 'checkout.html'
        };
        
        if (suggestions[query]) {
            window.location.href = suggestions[query];
        } else {
            showNotification(`Searching for "${query}"...`, 'info');
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 1000);
        }
    }
    
    // Hide suggestions when clicking outside
    document.addEventListener('click', function(e) {
        if (!searchInput.contains(e.target)) {
            const suggestionDiv = document.querySelector('.search-suggestions');
            if (suggestionDiv) suggestionDiv.style.display = 'none';
        }
    });
}

// Add cart functionality
// Enhanced cart functionality with increment/decrement
let cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

function addToCart(product) {
    const existingItem = cartItems.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        product.quantity = 1;
        cartItems.push(product);
    }
    
    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    updateCartCount();
    showNotification(`${product.name} added to cart!`, 'success');
}

function updateCartCount() {
    const totalItems = cartItems.reduce((sum, item) => sum + item.quantity, 0);
    const cartIcon = document.querySelector('.nav-cart');
    
    if (cartIcon && totalItems > 0) {
        let badge = cartIcon.querySelector('.cart-badge');
        if (!badge) {
            badge = document.createElement('span');
            badge.className = 'cart-badge';
            cartIcon.appendChild(badge);
        }
        badge.textContent = totalItems;
    }
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    Object.assign(notification.style, {
        position: 'fixed',
        top: '20px',
        right: '20px',
        padding: '15px 20px',
        borderRadius: '10px',
        color: 'white',
        fontSize: '14px',
        fontWeight: '500',
        zIndex: '10000',
        display: 'flex',
        alignItems: 'center',
        gap: '10px',
        minWidth: '300px',
        boxShadow: '0 5px 15px rgba(0,0,0,0.2)',
        animation: 'slideInRight 0.3s ease',
        background: type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'
    });
    
    document.body.appendChild(notification);
    
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.cssText = 'background: none; border: none; color: white; font-size: 18px; cursor: pointer; margin-left: auto;';
    
    closeBtn.addEventListener('click', () => notification.remove());
    setTimeout(() => notification.remove(), 5000);
}

// Initialize cart count on page load
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    // Enhanced add to cart buttons
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.textContent.includes('Add to Cart') || btn.textContent.includes('Add To Cart')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                
                const productCard = this.closest('.product-card');
                const product = {
                    id: Date.now() + Math.random(),
                    name: productCard.querySelector('h4')?.textContent || 'Product',
                    price: productCard.querySelector('.product-price span')?.textContent || '0',
                    image: productCard.querySelector('img')?.src || ''
                };
                
                addToCart(product);
                
                // Visual feedback
                this.innerHTML = '<i class="fas fa-check"></i> Added!';
                this.style.background = '#27ae60';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                    this.style.background = '';
                }, 2000);
            });
        }
    });
});
    
