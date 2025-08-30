const menuButton = document.querySelector('.menu-icon-navbar');
const dropdown = document.querySelector('.navbar-dropdown');
const searchButton = document.querySelector('.navbar-search-icon');
const searchBar = document.querySelector('.navbar-search-bar');

function menuDropdown() {
    if (!dropdown.classList.contains('navbar-dropdown-ondislay')) {
        dropdown.classList.add('navbar-dropdown-ondislay');
        menuButton.classList.add('menu-icon-navbar-clicked');
        
        
        const links = dropdown.querySelectorAll('.navbar-dropdown-content > a');
        links.forEach((link, index) => {
            link.style.animationDelay = `${0.2 + index * 0.1}s`;
        });
    } else {
        dropdown.classList.add('navbar-dropdown-closing');
        menuButton.classList.remove('menu-icon-navbar-clicked');
        setTimeout(() => {
            dropdown.classList.remove('navbar-dropdown-ondislay');
            dropdown.classList.remove('navbar-dropdown-closing');
        }, 300); 
    }
}

function searchBarToggle() {
    if (!searchBar.classList.contains('navbar-search-bar-clicked')) {
        searchBar.classList.add('navbar-search-bar-clicked');
        searchButton.classList.add('navbar-search-icon-clicked');
    } else {
        searchBar.classList.add('navbar-search-bar-closing');
        searchButton.classList.remove('navbar-search-icon-clicked');
        setTimeout(() => {
            searchBar.classList.remove('navbar-search-bar-clicked');
            searchBar.classList.remove('navbar-search-bar-closing');
        }, 300); 
    }
}

function heroSlider() {
    const images = document.querySelectorAll('.slider-img');
    let currentIndex = 0;

    setInterval(() => {
     
        images[currentIndex].classList.remove('active');
        images[currentIndex].classList.add('exit');

        // Update index
        currentIndex = (currentIndex + 1) % images.length;

        
        setTimeout(() => {
            images[(currentIndex - 1 + images.length) % images.length].classList.remove('exit');
        }, 500);

        // Add active class to next image
        images[currentIndex].classList.add('active');
    }, 5000); // Change image every 5 seconds
}

// Event Listeners
if (menuButton && dropdown) {
    menuButton.addEventListener('click', menuDropdown);
}

if (searchButton) {
    searchButton.addEventListener('click', searchBarToggle);
}

// Close dropdown when clicking outside
document.addEventListener('click', (e) => {
    if (dropdown && menuButton && !menuButton.contains(e.target) && !dropdown.contains(e.target)) {
        if (dropdown.classList.contains('navbar-dropdown-ondislay')) {
            menuDropdown();
        }
    }
    if (searchBar && searchButton && !searchButton.contains(e.target) && !searchBar.contains(e.target)) {
        if (searchBar.classList.contains('navbar-search-bar-clicked')) {
            searchBarToggle();
        }
    }
});


document.addEventListener('DOMContentLoaded', function() {
 
    const images = document.querySelectorAll('.slider-img');
    if (images.length > 0) {
        heroSlider();
    }
});


document.addEventListener('DOMContentLoaded', function() {
    const newArrivalsBtn = document.getElementById('new-arrivals-btn');
    console.log("New Arrivals Button:", newArrivalsBtn); 
    
    if (newArrivalsBtn) {
        newArrivalsBtn.addEventListener('click', function(e) {
            console.log("New Arrivals button clicked"); 
            e.preventDefault(); 
            
            const featuredSection = document.getElementById('featured-products');
            console.log("Featured Section:", featuredSection); 
            
            if (featuredSection) {
              
                const yOffset = featuredSection.getBoundingClientRect().top + window.pageYOffset - 100;
                window.scrollTo({
                    top: yOffset,
                    behavior: 'smooth'
                });
                console.log("Scrolling to featured section"); 
            } else {
                console.error("Featured products section not found");
            }
        });
    } else {
        console.error("New Arrivals button not found");
    }
});


const viewAllBtn = document.getElementById('view-all-btn');
if (viewAllBtn) {
    viewAllBtn.addEventListener('click', function() {
        window.location.href = './shop.html';
    });
}


const bestSellersBtn = document.getElementById('best-sellers-btn');
if (bestSellersBtn) {
    bestSellersBtn.addEventListener('click', function() {
        window.location.href = './shop.html';
    });
}


const productsLink = document.querySelector('a[href="#featured-products"]');
if (productsLink) {
    productsLink.addEventListener('click', function(e) {
        e.preventDefault();
        
        const productsSection = document.querySelector('#featured-products');
        if (productsSection) {
            productsSection.scrollIntoView({ 
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
}

// Product card functionality
const productCards = document.querySelectorAll('.product-card');
let activeCard = null;

productCards.forEach(card => {
    card.addEventListener('click', (e) => {
        // Don't expand if clicking add to cart button
        if (e.target.classList.contains('add-to-cart') || 
            e.target.classList.contains('quick-add')) {
            return;
        }

        // Close previously expanded card
        if (activeCard && activeCard !== card) {
            activeCard.classList.remove('expanded');
        }

        // Toggle current card
        card.classList.toggle('expanded');
        activeCard = card.classList.contains('expanded') ? card : null;
    });
});

// Handle add to cart buttons
document.querySelectorAll('.add-to-cart, .quick-add').forEach(button => {
    button.addEventListener('click', (e) => {
        e.stopPropagation();
        // Add your cart functionality here
        console.log('Added to cart:', e.target.closest('.product-card').dataset.id);
    });
});

// Replace the checkbox filter code with this more efficient version
document.addEventListener('DOMContentLoaded', function() {
    // Get all filter checkboxes
    const filterCheckboxes = document.querySelectorAll('.filter-section input[type="checkbox"]');
    
    // Add event listener to each checkbox
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // Get the filter class from the checkbox label
            const filterName = this.parentElement.textContent.trim().toLowerCase().replace(/\s+/g, '-');
            console.log(`${filterName} checkbox clicked: ${this.checked}`);
            
            const allCards = document.querySelectorAll('.product-card');
            
            if (this.checked) {
                // Hide all cards first
                allCards.forEach(card => {
                    if (card.classList.contains(filterName)) {
                        card.style.display = 'block';
                    } else {
                        card.style.display = 'none';
                    }
                });
            } else {
                // Show all cards
                allCards.forEach(card => {
                    card.style.display = 'block';
                });
            }
        });
    });
});

// Add this code to handle the "Learn More" button in the Made-to-Order section
document.addEventListener('DOMContentLoaded', function() {
    const learnMoreBtn = document.querySelector('.made-to-order-text button');
    
    if (learnMoreBtn) {
        learnMoreBtn.addEventListener('click', function() {
            window.location.href = './services.html';
        });
    }
});

// Add click handlers for the user icon and cart icon
document.addEventListener('DOMContentLoaded', function() {
    // User icon click handler
    const userIcon = document.querySelector('.user-icon');
    if (userIcon) {
        userIcon.addEventListener('click', function() {
            window.location.href = './login.html';
        });
        userIcon.style.cursor = 'pointer';
    }

    // Cart icon click handler
    const cartIcon = document.querySelector('.cart-icon');
    if (cartIcon) {
        cartIcon.addEventListener('click', function() {
            if (isUserLoggedIn()) {
                // User is logged in, go to cart page
                window.location.href = './cart.html';
            } else {
                // User is not logged in, redirect to login page
                showLoginRedirectMessage();
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 1500);
            }
        });
        cartIcon.style.cursor = 'pointer';
    }
    
    // Update the mobile menu cart link
    const cartLink = document.querySelector('.navbar-dropdown-content a[href="./cart.html"]');
    if (cartLink) {
        cartLink.addEventListener('click', function(e) {
            e.preventDefault();
            if (isUserLoggedIn()) {
                // User is logged in, go to cart page
                window.location.href = './cart.html';
            } else {
                // User is not logged in, redirect to login page
                showLoginRedirectMessage();
                setTimeout(() => {
                    window.location.href = './login.html';
                }, 1500);
            }
        });
    }
    
    // Also add protection to the cart page itself
    if (window.location.pathname.endsWith('cart.html')) {
        if (!isUserLoggedIn()) {
            // Redirect to login page if trying to access cart directly
            window.location.href = './login.html';
        }
    }
    
    // Function to show login redirect message
    function showLoginRedirectMessage() {
        // Create a toast notification
        const toast = document.createElement('div');
        toast.className = 'login-redirect-toast';
        toast.textContent = 'Please login to access your cart';
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
        
        // Add to document
        document.body.appendChild(toast);
        
        // Remove after delay
        setTimeout(() => {
            toast.style.opacity = '0';
            toast.style.transition = 'opacity 0.5s ease';
            setTimeout(() => {
                document.body.removeChild(toast);
            }, 500);
        }, 1000);
    }
});

// Login and Registration handling
document.addEventListener('DOMContentLoaded', function() {
    // Check if we're on the login page
    const loginForm = document.querySelector('.login-form form');
    if (loginForm) {
        // Create message container if it doesn't exist
        let messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.style.padding = '10px';
            messageContainer.style.margin = '10px 0';
            messageContainer.style.borderRadius = '5px';
            messageContainer.style.textAlign = 'center';
            messageContainer.style.display = 'none';
            loginForm.prepend(messageContainer);
        }

        // Handle login form submission
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Get form values
            const email = document.getElementById('email').value;
            const password = document.getElementById('password').value;
            
            // Validate input
            if (!email || !password) {
                showMessage('Please fill in all fields', 'error');
                return;
            }
            
            // Send login request to server
            fetch('http://localhost:3000/api/login', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email, password })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showMessage(data.error, 'error');
                } else {
                    // Save user data
                    localStorage.setItem('user', JSON.stringify(data.user));
                    showMessage('Login successful! Redirecting...', 'success');
                    
                    // Update UI immediately to reflect login status
                    updateUserInterface();
                    
                    // Redirect to home page after delay
                    setTimeout(() => {
                        window.location.href = './index.html';
                    }, 1500);
                }
            })
            .catch(error => {
                showMessage('Login failed. Please check your connection.', 'error');
                console.error('Error:', error);
            });
        });
    }
    
    // Check if we're on the register page
    const registerForm = document.querySelector('.register-form form');
    if (registerForm) {
        // Create message container if it doesn't exist
        let messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            messageContainer = document.createElement('div');
            messageContainer.id = 'message-container';
            messageContainer.style.padding = '10px';
            messageContainer.style.margin = '10px 0';
            messageContainer.style.borderRadius = '5px';
            messageContainer.style.textAlign = 'center';
            messageContainer.style.display = 'none';
            registerForm.prepend(messageContainer);
        }

       // Update the registration form submission handler to check for duplicates

// In your existing registration form handler, update the fetch section:
registerForm.addEventListener('submit', function(e) {
    e.preventDefault();
    
    // Get form values
    const firstName = document.getElementById('firstName').value;
    const lastName = document.getElementById('lastName').value;
    const email = document.getElementById('email').value;
    const phone = document.getElementById('phone').value;
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;
    
    // Validate input
    if (!firstName || !lastName || !email || !phone || !password || !confirmPassword) {
        showMessage('Please fill in all fields', 'error');
        return;
    }
    
    if (password !== confirmPassword) {
        showMessage('Passwords do not match', 'error');
        return;
    }
    
    // Check if password is strong enough
    if (!validatePassword(password)) {
        showMessage('Your password doesn\'t meet the requirements', 'error');
        return;
    }
    
    // First check if email or phone is already in use
    fetch('http://localhost:3000/api/check-duplicates', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, phone })
    })
    .then(response => response.json())
    .then(data => {
        if (data.emailExists) {
            showMessage('This email is already registered', 'error');
            document.getElementById('email').style.borderColor = '#c62828';
        } else if (data.phoneExists) {
            showMessage('This phone number is already registered', 'error');
            document.getElementById('phone').style.borderColor = '#c62828';
        } else {
            const username = firstName + ' ' + lastName;
            
            fetch('http://localhost:3000/api/register', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ 
                    username, 
                    email, 
                    phone,
                    password,
                    firstName,
                    lastName
                })
            })
            .then(response => response.json())
            .then(data => {
                if (data.error) {
                    showMessage(data.error, 'error');
                } else {
                    showMessage('Registration successful! Redirecting to login...', 'success');
                    setTimeout(() => {
                        window.location.href = './login.html';
                    }, 2000);
                }
            })
            .catch(error => {
                showMessage('Registration failed. Please try again later.', 'error');
                console.error('Error:', error);
            });
        }
    })
    .catch(error => {
        showMessage('Could not check registration details. Please try again.', 'error');
        console.error('Error:', error);
    });
});
    }
    
    const passwordField = document.getElementById('password');
    const confirmPasswordField = document.getElementById('confirmPassword');
    const registerBtn = document.querySelector('.register-btn');
    
    if (passwordField && confirmPasswordField) {
        const strengthIndicator = document.createElement('div');
        strengthIndicator.className = 'password-strength';
        strengthIndicator.style.height = '5px';
        strengthIndicator.style.marginTop = '5px';
        strengthIndicator.style.transition = 'all 0.3s';
        passwordField.parentNode.appendChild(strengthIndicator);
        
        const requirementsMessage = document.createElement('div');
        requirementsMessage.className = 'password-requirements';
        requirementsMessage.style.fontSize = '12px';
        requirementsMessage.style.marginTop = '5px';
        requirementsMessage.style.color = '#666';
        requirementsMessage.innerHTML = 'Password must contain at least:<br>' +
            '• 8 characters<br>' +
            '• 1 uppercase letter<br>' +
            '• 1 lowercase letter<br>' +
            '• 1 number<br>' +
            '• 1 special character';
        passwordField.parentNode.appendChild(requirementsMessage);
        
        passwordField.addEventListener('input', function() {
            const password = this.value;
            const strength = checkPasswordStrength(password);
            updateStrengthIndicator(strength);
            
            const isValid = validatePassword(password);
            if (password.length > 0) {
                if (isValid) {
                    requirementsMessage.style.color = '#2e7d32';
                } else {
                    requirementsMessage.style.color = '#c62828';
                }
            } else {
                requirementsMessage.style.color = '#666';
            }
        });
        
        confirmPasswordField.addEventListener('input', function() {
            const password = passwordField.value;
            const confirmPassword = this.value;
            
            if (confirmPassword.length > 0) {
                if (password !== confirmPassword) {
                    this.style.borderColor = '#c62828';
                } else {
                    this.style.borderColor = '#2e7d32';
                }
            }
        });
        
        function checkPasswordStrength(password) {
            let strength = 0;
            
            // Length check
            if (password.length >= 8) strength += 20;
            
            // Character type checks
            if (/[A-Z]/.test(password)) strength += 20; // Uppercase
            if (/[a-z]/.test(password)) strength += 20; // Lowercase
            if (/[0-9]/.test(password)) strength += 20; // Number
            if (/[^A-Za-z0-9]/.test(password)) strength += 20; // Special char
            
            return strength;
        }
        
        // Update visual strength indicator
        function updateStrengthIndicator(strength) {
            let color = '';
            let text = '';
            
            if (strength < 40) {
                color = '#c62828'; // Red
                text = 'Weak';
            } else if (strength < 80) {
                color = '#f57f17'; // Orange
                text = 'Medium';
            } else {
                color = '#2e7d32'; // Green
                text = 'Strong';
            }
            
            strengthIndicator.style.width = strength + '%';
            strengthIndicator.style.backgroundColor = color;
            strengthIndicator.setAttribute('data-strength', text);
            
            let strengthText = passwordField.parentNode.querySelector('.strength-text');
            if (!strengthText) {
                strengthText = document.createElement('div');
                strengthText.className = 'strength-text';
                strengthText.style.fontSize = '12px';
                strengthText.style.marginTop = '5px';
                strengthText.style.fontWeight = 'bold';
                passwordField.parentNode.insertBefore(strengthText, requirementsMessage);
            }
            
            strengthText.textContent = 'Password strength: ' + text;
            strengthText.style.color = color;
        }
        
        function validatePassword(password) {
            const minLength = 8;
            const hasUppercase = /[A-Z]/.test(password);
            const hasLowercase = /[a-z]/.test(password);
            const hasNumber = /[0-9]/.test(password);
            const hasSpecialChar = /[^A-Za-z0-9]/.test(password);
            
            return (
                password.length >= minLength &&
                hasUppercase &&
                hasLowercase &&
                hasNumber &&
                hasSpecialChar
            );
        }
        
        const registerForm = document.querySelector('.register-form form');
        if (registerForm) {
            registerForm.addEventListener('submit', function(e) {
                const password = passwordField.value;
                const confirmPassword = confirmPasswordField.value;
                
                if (!validatePassword(password)) {
                    e.preventDefault();
                    showMessage('Your password doesn\'t meet the requirements', 'error');
                    return;
                }
                
                if (password !== confirmPassword) {
                    e.preventDefault();
                    showMessage('Passwords do not match', 'error');
                    return;
                }
                
            });
        }
    }
    
    function showMessage(message, type) {
        const messageContainer = document.getElementById('message-container');
        if (!messageContainer) {
            const newMessageContainer = document.createElement('div');
            newMessageContainer.id = 'message-container';
            newMessageContainer.style.padding = '10px';
            newMessageContainer.style.margin = '10px 0';
            newMessageContainer.style.borderRadius = '5px';
            newMessageContainer.style.textAlign = 'center';
            
            const form = document.querySelector('form');
            if (form) {
                form.prepend(newMessageContainer);
            }
            
            return showMessage(message, type); 
        }
        
        messageContainer.textContent = message;
        messageContainer.style.display = 'block';
        messageContainer.style.backgroundColor = type === 'error' ? '#ffebee' : '#e8f5e9';
        messageContainer.style.color = type === 'error' ? '#c62828' : '#2e7d32';
        messageContainer.style.border = type === 'error' ? '1px solid #ef9a9a' : '1px solid #a5d6a7';
    }
});


function updateUserInterface() {
    const userData = localStorage.getItem('user');
    
    if (userData) {
        const user = JSON.parse(userData);
        
        const userIcon = document.querySelector('.user-icon');
        if (userIcon) {
            const userContainer = document.createElement('div');
            userContainer.className = 'user-profile';
            userContainer.style.cursor = 'pointer';
            userContainer.style.display = 'flex';
            userContainer.style.alignItems = 'center';
            
            const usernameDisplay = document.createElement('span');
            usernameDisplay.className = 'username-display';
            usernameDisplay.textContent = user.username;
            usernameDisplay.style.marginRight = '8px';
            usernameDisplay.style.fontFamily = '"Montserrat", sans-serif';
            usernameDisplay.style.fontSize = '14px';
            
            // Create dropdown for logout and profile options
            const userDropdown = document.createElement('div');
            userDropdown.className = 'user-dropdown';
            userDropdown.style.position = 'absolute';
            userDropdown.style.top = '100%';
            userDropdown.style.right = '0';
            userDropdown.style.backgroundColor = 'white';
            userDropdown.style.boxShadow = '0 2px 5px rgba(0,0,0,0.2)';
            userDropdown.style.borderRadius = '4px';
            userDropdown.style.padding = '10px';
            userDropdown.style.zIndex = '100';
            userDropdown.style.display = 'none';
            userDropdown.style.flexDirection = 'column';
            userDropdown.style.minWidth = '150px';
            
            // Create logout option
            const logoutOption = document.createElement('a');
            logoutOption.href = '#';
            logoutOption.textContent = 'Logout';
            logoutOption.style.padding = '8px 10px';
            logoutOption.style.borderRadius = '4px';
            logoutOption.style.color = '#333';
            logoutOption.style.textDecoration = 'none';
            logoutOption.style.fontFamily = '"Montserrat", sans-serif';
            
            logoutOption.addEventListener('mouseover', () => {
                logoutOption.style.backgroundColor = '#f5f5f5';
            });
            
            logoutOption.addEventListener('mouseout', () => {
                logoutOption.style.backgroundColor = 'transparent';
            });
            
            logoutOption.addEventListener('click', (e) => {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.reload();
            });
            
            userDropdown.appendChild(logoutOption);
            
            userContainer.appendChild(usernameDisplay);
            userContainer.appendChild(userDropdown);
            
            userContainer.addEventListener('click', () => {
                if (userDropdown.style.display === 'none') {
                    userDropdown.style.display = 'flex';
                } else {
                    userDropdown.style.display = 'none';
                }
            });
            
            document.addEventListener('click', (e) => {
                if (!userContainer.contains(e.target)) {
                    userDropdown.style.display = 'none';
                }
            });
            
            userIcon.parentNode.replaceChild(userContainer, userIcon);
        }
        
        const loginRegisterLink = document.querySelector('.navbar-dropdown-content a[href="./login.html"]');
        if (loginRegisterLink) {
            loginRegisterLink.textContent = 'MY ACCOUNT';
            loginRegisterLink.href = '#';
            
            loginRegisterLink.addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('user');
                window.location.reload();
            });
        }
    }
}


document.addEventListener('DOMContentLoaded', function() {
    updateUserInterface();
    

});


function isUserLoggedIn() {
    return localStorage.getItem('user') !== null;
}






