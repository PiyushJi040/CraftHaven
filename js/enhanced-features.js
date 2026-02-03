// Enhanced CraftHaven JavaScript with Dynamic Features

// Slider functionality
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

// Auto-slide functionality
setInterval(() => {
    currentSlide = (currentSlide < totalSlides - 1) ? currentSlide + 1 : 0;
    updateSlider();
}, 5000); // Change slide every 5 seconds

// Product slider scroll functionality
const scrollContainers = document.querySelectorAll('.products');
for (const item of scrollContainers) {
    item.addEventListener('wheel', (evt) => {
        evt.preventDefault();
        item.scrollLeft += evt.deltaY;
    });
}

// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Form validation and enhancement
function enhanceForm(formSelector) {
    const form = document.querySelector(formSelector);
    if (!form) return;

    const inputs = form.querySelectorAll('input, textarea, select');
    
    inputs.forEach(input => {
        // Add focus/blur effects
        input.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
            this.classList.add('focused');
        });
        
        input.addEventListener('blur', function() {
            this.parentElement.classList.remove('focused');
            this.classList.remove('focused');
            
            // Validate on blur
            validateField(this);
        });
        
        // Real-time validation
        input.addEventListener('input', function() {
            clearTimeout(this.validationTimeout);
            this.validationTimeout = setTimeout(() => {
                validateField(this);
            }, 500);
        });
    });
    
    // Form submission
    form.addEventListener('submit', function(e) {
        e.preventDefault();
        
        let isValid = true;
        inputs.forEach(input => {
            if (!validateField(input)) {
                isValid = false;
            }
        });
        
        if (isValid) {
            showLoadingState(this);
            // Simulate form submission
            setTimeout(() => {
                hideLoadingState(this);
                showSuccessMessage('Form submitted successfully!');
            }, 2000);
        } else {
            showErrorMessage('Please fix the errors and try again.');
        }
    });
}

function validateField(field) {
    const value = field.value.trim();
    const type = field.type;
    const required = field.hasAttribute('required');
    
    // Remove existing error styling
    field.classList.remove('error');
    removeErrorMessage(field);
    
    if (required && !value) {
        showFieldError(field, 'This field is required');
        return false;
    }
    
    // Email validation
    if (type === 'email' && value) {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(value)) {
            showFieldError(field, 'Please enter a valid email address');
            return false;
        }
    }
    
    // Phone validation
    if (type === 'tel' && value) {
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
            showFieldError(field, 'Please enter a valid phone number');
            return false;
        }
    }
    
    // Password validation
    if (type === 'password' && value) {
        if (value.length < 6) {
            showFieldError(field, 'Password must be at least 6 characters long');
            return false;
        }
    }
    
    // Number validation
    if (type === 'number' && value) {
        const min = field.getAttribute('min');
        const max = field.getAttribute('max');
        const numValue = parseFloat(value);
        
        if (min && numValue < parseFloat(min)) {
            showFieldError(field, `Value must be at least ${min}`);
            return false;
        }
        
        if (max && numValue > parseFloat(max)) {
            showFieldError(field, `Value must be at most ${max}`);
            return false;
        }
    }
    
    return true;
}

function showFieldError(field, message) {
    field.classList.add('error');
    
    const errorDiv = document.createElement('div');
    errorDiv.className = 'field-error';
    errorDiv.textContent = message;
    errorDiv.style.color = '#e74c3c';
    errorDiv.style.fontSize = '12px';
    errorDiv.style.marginTop = '5px';
    
    field.parentNode.appendChild(errorDiv);
}

function removeErrorMessage(field) {
    const errorDiv = field.parentNode.querySelector('.field-error');
    if (errorDiv) {
        errorDiv.remove();
    }
}

function showLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.classList.add('loading');
        const originalText = submitBtn.textContent || submitBtn.value;
        submitBtn.dataset.originalText = originalText;
        submitBtn.textContent = 'Processing...';
        submitBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Processing...';
    }
}

function hideLoadingState(form) {
    const submitBtn = form.querySelector('button[type="submit"], input[type="submit"]');
    if (submitBtn) {
        submitBtn.disabled = false;
        submitBtn.classList.remove('loading');
        const originalText = submitBtn.dataset.originalText;
        if (originalText) {
            submitBtn.textContent = originalText;
            submitBtn.innerHTML = originalText;
        }
    }
}

function showSuccessMessage(message) {
    showNotification(message, 'success');
}

function showErrorMessage(message) {
    showNotification(message, 'error');
}

function showNotification(message, type = 'info') {
    const notification = document.createElement('div');
    notification.className = `notification ${type}`;
    notification.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check-circle' : type === 'error' ? 'fa-exclamation-circle' : 'fa-info-circle'}"></i>
        <span>${message}</span>
        <button class="close-notification">&times;</button>
    `;
    
    // Styling
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
    
    // Close button functionality
    const closeBtn = notification.querySelector('.close-notification');
    closeBtn.style.background = 'none';
    closeBtn.style.border = 'none';
    closeBtn.style.color = 'white';
    closeBtn.style.fontSize = '18px';
    closeBtn.style.cursor = 'pointer';
    closeBtn.style.marginLeft = 'auto';
    
    closeBtn.addEventListener('click', () => {
        notification.remove();
    });
    
    // Auto remove after 5 seconds
    setTimeout(() => {
        if (notification.parentNode) {
            notification.remove();
        }
    }, 5000);
}

// Card number formatting
function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/[^0-9]/gi, '');
    let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formattedValue;
}

// Expiry date formatting
function formatExpiryDate(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.substring(0, 2) + '/' + value.substring(2, 4);
    }
    input.value = value;
}

// Initialize dynamic features when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Add CSS animations
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideInRight {
            from {
                transform: translateX(100%);
                opacity: 0;
            }
            to {
                transform: translateX(0);
                opacity: 1;
            }
        }
        
        .field-error {
            animation: fadeInUp 0.3s ease;
        }
        
        input.error, textarea.error, select.error {
            border-color: #e74c3c !important;
            box-shadow: 0 0 10px rgba(231, 76, 60, 0.2) !important;
        }
        
        .loading {
            opacity: 0.7;
            pointer-events: none;
        }
        
        .fade-in {
            animation: fadeInUp 0.6s ease;
        }
        
        .interactive {
            transition: transform 0.3s ease;
        }
        
        .interactive:hover {
            transform: translateY(-2px);
        }
    `;
    document.head.appendChild(style);
    
    // Enhance all forms
    enhanceForm('form');
    
    // Add interactive classes to elements
    document.querySelectorAll('.box-col, .product-card, .btn').forEach(el => {
        el.classList.add('interactive');
    });
    
    // Card number formatting
    const cardNumberInput = document.querySelector('input[placeholder*="1234"]');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function() {
            formatCardNumber(this);
        });
    }
    
    // Expiry date formatting
    const expiryInput = document.querySelector('input[placeholder*="MM/YY"]');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            formatExpiryDate(this);
        });
    }
    
    // Add fade-in animation to main content
    const mainContent = document.querySelector('main, .form-container, .product-slider, .box-row');
    if (mainContent) {
        mainContent.classList.add('fade-in');
    }
    
    // Search functionality
    const searchInput = document.querySelector('.nav-search-input');
    if (searchInput) {
        searchInput.addEventListener('input', function() {
            const query = this.value.toLowerCase();
            if (query.length > 2) {
                // Simulate search suggestions
                console.log('Searching for:', query);
                // You can implement actual search functionality here
            }
        });
    }
    
    // Add to cart functionality
    document.querySelectorAll('.btn').forEach(btn => {
        if (btn.textContent.includes('Add to Cart') || btn.textContent.includes('Add To Cart')) {
            btn.addEventListener('click', function(e) {
                e.preventDefault();
                this.innerHTML = '<i class="fas fa-check"></i> Added!';
                this.style.background = '#27ae60';
                
                setTimeout(() => {
                    this.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
                    this.style.background = '';
                }, 2000);
                
                showSuccessMessage('Product added to cart!');
            });
        }
    });
    
    // Scroll animations
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);
    
    // Observe elements for scroll animations
    document.querySelectorAll('.box-col, .product-card, .form-container').forEach(el => {
        observer.observe(el);
    });
});

// Utility functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function() {
        const args = arguments;
        const context = this;
        if (!inThrottle) {
            func.apply(context, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    }
}

// Export functions for use in other scripts
window.CraftHaven = {
    showNotification,
    showSuccessMessage,
    showErrorMessage,
    validateField,
    formatCardNumber,
    formatExpiryDate,
    debounce,
    throttle
};