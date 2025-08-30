
document.addEventListener('DOMContentLoaded', function() {
    // Check if user is logged in
    if (!isUserLoggedIn()) {
        window.location.href = './login.html';
        return;
    }
    
    const userData = JSON.parse(localStorage.getItem('user'));
    
    loadCart(userData.id);
    
    function loadCart(userId) {
        fetch(`http://localhost:3000/api/cart/${userId}`)
            .then(response => response.json())
            .then(data => {
                displayCart(data);
            })
            .catch(error => {
                console.error('Error loading cart:', error);
                showMessage('Failed to load cart. Please try again.', 'error');
            });
    }
    
    function displayCart(cartData) {
        const cartItemsContainer = document.querySelector('.cart-items');
        cartItemsContainer.innerHTML = '';
        
        if (cartData.items.length === 0) {
            
            cartItemsContainer.innerHTML = `
                <div class="empty-cart">
                    <h3>Your cart is empty</h3>
                    <p>Browse our collection and add something you like!</p>
                    <a href="./shop.html" class="continue-shopping-btn">Continue Shopping</a>
                </div>
            `;
            
            document.querySelector('.summary-row:nth-child(1) span:nth-child(2)').textContent = '₹ 0';
            document.querySelector('.summary-row:nth-child(2) span:nth-child(2)').textContent = '₹ 0';
            document.querySelector('.summary-row.total span:nth-child(2)').textContent = '₹ 0';
            
            const checkoutButton = document.querySelector('.checkout-button');
            checkoutButton.disabled = true;
            checkoutButton.style.opacity = '0.5';
            checkoutButton.style.cursor = 'not-allowed';
            
            return;
        }
        
        console.log("Cart data received:", cartData); 
        
        cartData.items.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.dataset.itemId = item.id;
            cartItem.dataset.productId = item.product_id;
            
            const itemPrice = parseFloat(item.price).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
            
            const itemSubtotal = (item.price * item.quantity).toLocaleString('en-IN', {
                maximumFractionDigits: 2,
                minimumFractionDigits: 2
            });
            
            cartItem.innerHTML = `
                <div class="item-image">
                    <img src="${item.image_url}" alt="${item.name}">
                </div>
                <div class="item-details">
                    <div class="item-name">${item.name} (${item.size})</div>
                    <div class="item-price">₹ ${itemPrice}</div>
                    <div class="item-category">${item.category.replace(/-/g, ' ')}</div>
                </div>
                <div class="item-quantity">
                    <button class="quantity-decrease">-</button>
                    <span class="quantity-value">${item.quantity}</span>
                    <button class="quantity-increase">+</button>
                </div>
                <div class="item-subtotal">
                    ₹ ${itemSubtotal}
                </div>
                <button class="remove-item">
                    <i class="fa fa-trash"></i>
                    Remove
                </button>
            `;
            
            cartItemsContainer.appendChild(cartItem);
        });
        
        const subtotal = parseFloat(cartData.summary.subtotal).toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
        
        const shipping = parseFloat(cartData.summary.shipping).toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
        
        const total = parseFloat(cartData.summary.total).toLocaleString('en-IN', {
            maximumFractionDigits: 2,
            minimumFractionDigits: 2
        });
        
        document.querySelector('.summary-row:nth-child(1) span:nth-child(2)').textContent = `₹ ${subtotal}`;
        document.querySelector('.summary-row:nth-child(2) span:nth-child(2)').textContent = `₹ ${shipping}`;
        document.querySelector('.summary-row.total span:nth-child(2)').textContent = `₹ ${total}`;
        
        addCartEventListeners();
    }
    
    function addCartEventListeners() {
        document.querySelectorAll('.quantity-increase').forEach(button => {
            button.addEventListener('click', function() {
                const itemElement = this.closest('.cart-item');
                const itemId = itemElement.dataset.itemId;
                const quantityElement = itemElement.querySelector('.quantity-value');
                const currentQuantity = parseInt(quantityElement.textContent);
                
                updateCartItemQuantity(itemId, currentQuantity + 1);
            });
        });
        
        document.querySelectorAll('.quantity-decrease').forEach(button => {
            button.addEventListener('click', function() {
                const itemElement = this.closest('.cart-item');
                const itemId = itemElement.dataset.itemId;
                const quantityElement = itemElement.querySelector('.quantity-value');
                const currentQuantity = parseInt(quantityElement.textContent);
                
                if (currentQuantity > 1) {
                    updateCartItemQuantity(itemId, currentQuantity - 1);
                } else {
                    removeCartItem(itemId);
                }
            });
        });
        
        document.querySelectorAll('.remove-item').forEach(button => {
            button.addEventListener('click', function() {
                const itemId = this.closest('.cart-item').dataset.itemId;
                removeCartItem(itemId);
            });
        });
        
        document.querySelector('.checkout-button').addEventListener('click', function() {
            alert('Checkout functionality will be implemented in the next phase!');
        });
        
        const clearCartButton = document.querySelector('.clear-cart-button');
        if (clearCartButton) {
            clearCartButton.addEventListener('click', function() {
                if (confirm("Are you sure you want to clear your cart?")) {
                    const userData = JSON.parse(localStorage.getItem('user'));
                    clearCart(userData.id);
                }
            });
        }
    }
    
    function updateCartItemQuantity(itemId, quantity) {
        fetch('http://localhost:3000/api/cart/update', {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ itemId, quantity })
        })
        .then(response => response.json())
        .then(() => {
            const userData = JSON.parse(localStorage.getItem('user'));
            loadCart(userData.id);
        })
        .catch(error => {
            console.error('Error updating cart:', error);
            showMessage('Failed to update cart. Please try again.', 'error');
        });
    }
    
    function removeCartItem(itemId) {
        fetch(`http://localhost:3000/api/cart/remove/${itemId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            const userData = JSON.parse(localStorage.getItem('user'));
            loadCart(userData.id);
        })
        .catch(error => {
            console.error('Error removing item:', error);
            showMessage('Failed to remove item. Please try again.', 'error');
        });
    }
    
    function clearCart(userId) {
        fetch(`http://localhost:3000/api/cart/clear/${userId}`, {
            method: 'DELETE'
        })
        .then(response => response.json())
        .then(() => {
            loadCart(userId);
            showMessage('Cart cleared successfully', 'success');
        })
        .catch(error => {
            console.error('Error clearing cart:', error);
            showMessage('Failed to clear cart. Please try again.', 'error');
        });
    }
    
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

function isUserLoggedIn() {
    return localStorage.getItem('user') !== null;
}