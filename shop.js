document.addEventListener('DOMContentLoaded', () => {
    const productCards = document.querySelectorAll('.product-card');

    productCards.forEach(card => {
        card.addEventListener('click', (e) => {
            // Prevent clicking on button from toggling card
            if (e.target.classList.contains('add-to-cart')) {
                return;
            }

            // Close any other expanded cards
            productCards.forEach(otherCard => {
                if (otherCard !== card && otherCard.classList.contains('expanded')) {
                    otherCard.classList.remove('expanded');
                }
            });
            
            // Toggle current card
            card.classList.toggle('expanded');
        });
    });

    // Close expanded card when clicking outside
    document.addEventListener('click', (e) => {
        if (!e.target.closest('.product-card')) {
            productCards.forEach(card => {
                card.classList.remove('expanded');
            });
        }
    });

    // Prevent add to cart button from closing card
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    addToCartButtons.forEach(button => {
        button.addEventListener('click', (e) => {
            e.stopPropagation();
        });
    });
});

// Shop page functionality

document.addEventListener('DOMContentLoaded', function() {
    // Handle "Quick Add" and "Add to Cart" buttons
    document.querySelectorAll('.quick-add, .add-to-cart').forEach(button => {
        button.addEventListener('click', function(e) {
            e.stopPropagation();
            
            // Check if user is logged in
            if (!isUserLoggedIn()) {
                showLoginRedirectMessage();
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 1500);
                return;
            }
            
            const productCard = this.closest('.product-card');
            const productId = productCard.dataset.id;
            const userData = JSON.parse(localStorage.getItem('user'));
            
            // Add to cart
            addToCart(userData.id, productId);
        });
    });
    
    // Function to add item to cart
    function addToCart(userId, productId) {
        fetch('http://localhost:3000/api/cart/add', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ userId, productId, quantity: 1 })
        })
        .then(response => response.json())
        .then(data => {
            showAddToCartMessage();
        })
        .catch(error => {
            console.error('Error adding to cart:', error);
            showMessage('Failed to add item to cart. Please try again.', 'error');
        });
    }
    
    // Function to show login redirect message
    function showLoginRedirectMessage() {
        const toast = document.createElement('div');
        toast.className = 'login-redirect-toast';
        toast.textContent = 'Please login to add items to your cart';
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.left = '50%';
        toast.style.transform = 'translateX(-50%)';
        toast.style.backgroundColor = '#333';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        toast.style.zIndex = '1000';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 1000);
    }
    
    // Function to show add to cart message
    function showAddToCartMessage() {
        const toast = document.createElement('div');
        toast.className = 'add-to-cart-toast';
        toast.innerHTML = `
            <div class="toast-content">
                <div class="checkmark">✓</div>
                <div class="message">
                    <span>Item added to cart!</span>
                    <a href="./cart.html">View Cart</a>
                </div>
            </div>
        `;
        toast.style.position = 'fixed';
        toast.style.bottom = '20px';
        toast.style.right = '20px';
        toast.style.backgroundColor = '#4CAF50';
        toast.style.color = 'white';
        toast.style.padding = '10px 20px';
        toast.style.borderRadius = '5px';
        toast.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
        toast.style.zIndex = '1000';
        
        // Style the checkmark
        const checkmark = toast.querySelector('.checkmark');
        checkmark.style.marginRight = '10px';
        checkmark.style.fontSize = '20px';
        
        // Style the content
        const toastContent = toast.querySelector('.toast-content');
        toastContent.style.display = 'flex';
        toastContent.style.alignItems = 'center';
        
        // Style the link
        const cartLink = toast.querySelector('a');
        cartLink.style.color = 'white';
        cartLink.style.marginLeft = '10px';
        cartLink.style.textDecoration = 'underline';
        
        document.body.appendChild(toast);
        
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 3000);
    }
    
    // Show message function
    function showMessage(message, type) {
        let messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.style.position = 'fixed';
            messageContainer.style.top = '20px';
            messageContainer.style.right = '20px';
            messageContainer.style.padding = '10px 20px';
            messageContainer.style.borderRadius = '5px';
            messageContainer.style.zIndex = '1000';
            document.body.appendChild(messageContainer);
        }
        
        messageContainer.textContent = message;
        messageContainer.style.backgroundColor = type === 'error' ? '#ffebee' : '#e8f5e9';
        messageContainer.style.color = type === 'error' ? '#c62828' : '#2e7d32';
        messageContainer.style.border = type === 'error' ? '1px solid #ef9a9a' : '1px solid #a5d6a7';
        messageContainer.style.display = 'block';
        
        setTimeout(() => {
            messageContainer.style.display = 'none';
        }, 3000);
    }
});

// Helper function to check if user is logged in
function isUserLoggedIn() {
    return localStorage.getItem('user') !== null;
}