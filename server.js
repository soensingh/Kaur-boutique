// server.js
const express = require('express');
const mysql = require('mysql2');
const bcrypt = require('bcrypt');
const cors = require('cors');
const bodyParser = require('body-parser');
const path = require('path');
const crypto = require('crypto');
const nodemailer = require('nodemailer');

const app = express();

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Serve static files
app.use(express.static(path.join(__dirname)));

// Database connection
const db = mysql.createConnection({
  host: 'localhost',
  user: 'root',
  password: 'sswsj234okm',
  database: 'kaur_boutique'
});

db.connect(err => {
  if (err) {
    console.error('Database connection failed:', err);
  } else {
    console.log('Connected to database');
  }
});

// Create a transporter for sending emails
// For testing, you can use Ethereal (https://ethereal.email/) or your own email service
const transporter = nodemailer.createTransport({
  host: 'smtp.ethereal.email', // Replace with your SMTP server
  port: 587,
  secure: false, // true for 465, false for other ports
  auth: {
    user: 'your_ethereal_email', // Replace with your email
    pass: 'your_ethereal_password' // Replace with your password
  }
});

// API endpoints for login and registration
app.post('/api/login', (req, res) => {
  const { email, password } = req.body;
  
  db.query(
    'SELECT * FROM users WHERE email = ?',
    [email],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Login failed' });
      }
      
      if (results.length === 0) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      const user = results[0];
      const passwordMatch = await bcrypt.compare(password, user.password);
      
      if (!passwordMatch) {
        return res.status(401).json({ error: 'Invalid credentials' });
      }
      
      res.status(200).json({ 
        message: 'Login successful',
        user: { id: user.id, username: user.username, email: user.email }
      });
    }
  );
});

app.post('/api/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;
    
    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user into database
    db.query(
      'INSERT INTO users (username, email, password) VALUES (?, ?, ?)',
      [username, email, hashedPassword],
      (err, results) => {
        if (err) {
          return res.status(500).json({ error: 'Registration failed' });
        }
        res.status(201).json({ message: 'User registered successfully' });
      }
    );
  } catch (error) {
    res.status(500).json({ error: 'Server error' });
  }
});

// Add the cart API endpoints
app.get('/api/products', (req, res) => {
  db.query('SELECT * FROM products', (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to fetch products' });
    }
    res.json(results);
  });
});

app.get('/api/cart/:userId', (req, res) => {
  const userId = req.params.userId;
  
  // First, get or create cart
  db.query('SELECT id FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId], (err, cartResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    let cartId;
    
    if (cartResults.length === 0) {
      // No cart exists yet, create a new one
      db.query('INSERT INTO carts (user_id) VALUES (?)', [userId], (err, newCart) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create cart' });
        }
        cartId = newCart.insertId;
        getCartItems(cartId);
      });
    } else {
      cartId = cartResults[0].id;
      getCartItems(cartId);
    }
    
    function getCartItems(cartId) {
      // Get cart items with product details
      const query = `
        SELECT ci.id, ci.quantity, p.id as product_id, p.name, p.price, p.category, 
               p.image_url, p.size, p.description
        FROM cart_items ci
        JOIN products p ON ci.product_id = p.id
        WHERE ci.cart_id = ?
      `;
      
      db.query(query, [cartId], (err, itemResults) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to fetch cart items' });
        }
        
        // Calculate cart totals
        let subtotal = 0;
        itemResults.forEach(item => {
          subtotal += item.price * item.quantity;
        });
        
        const shipping = itemResults.length > 0 ? 99 : 0;
        const total = subtotal + shipping;
        
        res.json({
          cartId,
          items: itemResults,
          summary: {
            subtotal,
            shipping,
            total
          }
        });
      });
    }
  });
});

app.post('/api/cart/add', (req, res) => {
  const { userId, productId, quantity = 1 } = req.body;
  
  if (!userId || !productId) {
    return res.status(400).json({ error: 'User ID and product ID are required' });
  }
  
  // First, get or create cart
  db.query('SELECT id FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId], (err, cartResults) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    let cartId;
    
    if (cartResults.length === 0) {
      // No cart exists yet, create a new one
      db.query('INSERT INTO carts (user_id) VALUES (?)', [userId], (err, newCart) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to create cart' });
        }
        addItemToCart(newCart.insertId);
      });
    } else {
      addItemToCart(cartResults[0].id);
    }
    
    function addItemToCart(cartId) {
      // Check if product is already in cart
      db.query('SELECT id, quantity FROM cart_items WHERE cart_id = ? AND product_id = ?', 
        [cartId, productId], (err, existingItem) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to check cart items' });
        }
        
        if (existingItem.length > 0) {
          // Update quantity if product already in cart
          const newQuantity = existingItem[0].quantity + quantity;
          db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', 
            [newQuantity, existingItem[0].id], (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to update cart item' });
            }
            res.json({ message: 'Cart updated successfully' });
          });
        } else {
          // Add new item to cart
          db.query('INSERT INTO cart_items (cart_id, product_id, quantity) VALUES (?, ?, ?)', 
            [cartId, productId, quantity], (err) => {
            if (err) {
              return res.status(500).json({ error: 'Failed to add item to cart' });
            }
            res.json({ message: 'Item added to cart successfully' });
          });
        }
      });
    }
  });
});

// Update cart item quantity
app.put('/api/cart/update', (req, res) => {
  const { itemId, quantity } = req.body;
  
  if (quantity <= 0) {
    // Remove item if quantity is 0 or negative
    db.query('DELETE FROM cart_items WHERE id = ?', [itemId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to remove cart item' });
      }
      res.json({ message: 'Item removed from cart' });
    });
  } else {
    // Update quantity
    db.query('UPDATE cart_items SET quantity = ? WHERE id = ?', [quantity, itemId], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to update cart item' });
      }
      res.json({ message: 'Cart updated successfully' });
    });
  }
});

// Remove item from cart
app.delete('/api/cart/remove/:itemId', (req, res) => {
  const itemId = req.params.itemId;
  
  db.query('DELETE FROM cart_items WHERE id = ?', [itemId], (err) => {
    if (err) {
      return res.status(500).json({ error: 'Failed to remove item from cart' });
    }
    res.json({ message: 'Item removed from cart' });
  });
});

// Clear cart
app.delete('/api/cart/clear/:userId', (req, res) => {
  const userId = req.params.userId;
  
  db.query('SELECT id FROM carts WHERE user_id = ? ORDER BY created_at DESC LIMIT 1', [userId], (err, cartResults) => {
    if (err || cartResults.length === 0) {
      return res.status(500).json({ error: 'Cart not found' });
    }
    
    db.query('DELETE FROM cart_items WHERE cart_id = ?', [cartResults[0].id], (err) => {
      if (err) {
        return res.status(500).json({ error: 'Failed to clear cart' });
      }
      res.json({ message: 'Cart cleared successfully' });
    });
  });
});

// Forgot password endpoint
app.post('/api/forgot-password', (req, res) => {
  const { email } = req.body;
  
  // Generate a random token
  const token = crypto.randomBytes(20).toString('hex');
  const expires = new Date(Date.now() + 3600000); // 1 hour from now
  
  // Find user by email
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, results) => {
    if (err) {
      return res.status(500).json({ error: 'Database error' });
    }
    
    if (results.length === 0) {
      // Don't reveal that the user doesn't exist for security
      return res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
    }
    
    // Update user with reset token
    db.query(
      'UPDATE users SET reset_token = ?, reset_token_expires = ? WHERE email = ?',
      [token, expires, email],
      (err) => {
        if (err) {
          return res.status(500).json({ error: 'Failed to set reset token' });
        }
        
        // Create reset URL
        const resetUrl = `http://localhost:3000/reset-password.html?token=${token}`;
        
        // Send email with reset link
        const mailOptions = {
          from: '"Kaur Boutique" <support@kaurboutique.com>',
          to: email,
          subject: 'Password Reset Request',
          html: `
            <h1>Password Reset</h1>
            <p>You requested a password reset for your Kaur Boutique account.</p>
            <p>Click the link below to reset your password:</p>
            <a href="${resetUrl}" style="padding:10px 20px; background:#F9A826; color:white; text-decoration:none; border-radius:5px;">Reset Password</a>
            <p>The link is valid for 1 hour.</p>
            <p>If you didn't request this, please ignore this email.</p>
          `
        };
        
        transporter.sendMail(mailOptions, (error) => {
          if (error) {
            console.error('Email send error:', error);
            return res.status(500).json({ error: 'Failed to send reset email' });
          }
          
          res.status(200).json({ message: 'If your email is registered, you will receive a password reset link' });
        });
      }
    );
  });
});

// Reset password endpoint
app.post('/api/reset-password', (req, res) => {
  const { token, password } = req.body;
  
  // Find user with this token and check if token is still valid
  db.query(
    'SELECT * FROM users WHERE reset_token = ? AND reset_token_expires > NOW()',
    [token],
    async (err, results) => {
      if (err) {
        return res.status(500).json({ error: 'Database error' });
      }
      
      if (results.length === 0) {
        return res.status(400).json({ error: 'Invalid or expired token' });
      }
      
      const user = results[0];
      
      // Hash the new password
      const hashedPassword = await bcrypt.hash(password, 10);
      
      // Update user password and clear token
      db.query(
        'UPDATE users SET password = ?, reset_token = NULL, reset_token_expires = NULL WHERE id = ?',
        [hashedPassword, user.id],
        (err) => {
          if (err) {
            return res.status(500).json({ error: 'Failed to update password' });
          }
          
          res.status(200).json({ message: 'Password has been reset successfully' });
        }
      );
    }
  );
});

// Check for duplicate email/phone
app.post('/api/check-duplicates', (req, res) => {
  const { email, phone } = req.body;
  
  // Check for email duplicates
  db.query('SELECT * FROM users WHERE email = ?', [email], (err, emailResults) => {
    if (err) {
      console.error('Database error checking email:', err);
      return res.status(500).json({ error: 'Database error' });
    }
    
    // If no phone provided, just check email
    if (!phone) {
      return res.json({
        emailExists: emailResults.length > 0,
        phoneExists: false
      });
    }
    
    // Check for phone duplicates
    db.query('SELECT * FROM users WHERE phone = ?', [phone], (phoneErr, phoneResults) => {
      if (phoneErr) {
        console.error('Database error checking phone:', phoneErr);
        return res.status(500).json({ error: 'Database error' });
      }
      
      res.json({
        emailExists: emailResults.length > 0,
        phoneExists: phoneResults.length > 0
      });
    });
  });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});