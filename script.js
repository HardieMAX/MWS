
// Mobile menu toggle
const mobileMenuButton = document.createElement('button');
mobileMenuButton.className = 'mobile-menu-button';
mobileMenuButton.innerHTML = '<i class="fas fa-bars"></i>';
mobileMenuButton.setAttribute('aria-label', 'Toggle navigation menu');
document.querySelector('nav').appendChild(mobileMenuButton);

mobileMenuButton.addEventListener('click', () => {
  const navLinks = document.querySelector('.nav-links');
  const isExpanded = navLinks.classList.contains('show');
  navLinks.classList.toggle('show');
  mobileMenuButton.setAttribute('aria-expanded', !isExpanded);
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
  if (!e.target.closest('nav')) {
    document.querySelector('.nav-links').classList.remove('show');
  }
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
      // Close mobile menu after clicking
      document.querySelector('.nav-links').classList.remove('show');
    }
  });
});

// Intersection Observer for animations
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.classList.add('fade-in');
    }
  });
}, { threshold: 0.1 });

// Observe all product cards
document.querySelectorAll('.product-card').forEach((card) => {
  observer.observe(card);
});


// Product detail handling
function showProductDetail(product) {
  const modal = document.createElement('div');
  modal.className = 'product-modal';
  modal.setAttribute('role', 'dialog');
  modal.setAttribute('aria-modal', 'true');
  
  // Close modal on escape key
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      modal.remove();
    }
  });
  
  // Close modal on outside click
  modal.addEventListener('click', function(e) {
    if (e.target === modal) {
      modal.remove();
    }
  });
  
  const productName = product.querySelector('h3').textContent;
  const productPrice = parseFloat(product.querySelector('p').textContent.replace(/[^0-9.]/g, ''));
  const productImage = product.querySelector('img').src;
  
  const content = document.createElement('div');
  content.className = 'modal-content';
  
  content.innerHTML = `
    <span class="close-modal">&times;</span>
    <img src="${productImage}" alt="${productName}">
    <h2>${productName}</h2>
    <div class="price">$${productPrice}</div>
    <div class="specs">${product.querySelector('ul')?.innerHTML || ''}</div>
    <button class="purchase-btn" onclick="addToCart('${productName}', ${productPrice}, this); window.location.href='pages/cart.html';">Add to Cart</button>
  `;
  
  modal.appendChild(content);
  document.body.appendChild(modal);
  
  // Close modal functionality
  const closeBtn = modal.querySelector('.close-modal');
  closeBtn.onclick = () => modal.remove();
  
  // Purchase button handling
  const purchaseBtn = modal.querySelector('.purchase-btn');
  purchaseBtn.onclick = () => {
    content.innerHTML = `
      <span class="close-modal">&times;</span>
      <h2>Complete Purchase</h2>
      <form class="purchase-form">
        <input type="text" placeholder="Full Name" required>
        <input type="email" placeholder="Email" required>
        <input type="text" placeholder="Shipping Address" required>
        <input type="text" placeholder="Card Number" required>
        <div class="card-details">
          <input type="text" placeholder="MM/YY" required>
          <input type="text" placeholder="CVV" required>
        </div>
        <button type="submit" class="submit-purchase">Complete Purchase</button>
      </form>
    `;
    
    const closeBtn = modal.querySelector('.close-modal');
    closeBtn.onclick = () => modal.remove();
    
    const form = modal.querySelector('.purchase-form');
    form.onsubmit = (e) => {
      e.preventDefault();
      content.innerHTML = `
        <span class="close-modal">&times;</span>
        <h2>Thank You!</h2>
        <p>Your order has been received and is being processed.</p>
        <p>We'll send the confirmation to your email.</p>
      `;
      const closeBtn = modal.querySelector('.close-modal');
      closeBtn.onclick = () => modal.remove();
    };
  };
}

// Add click handlers to all product cards
document.querySelectorAll('.product-card, .product-item').forEach(card => {
  card.style.cursor = 'pointer';
  card.addEventListener('click', () => showProductDetail(card));
});

// Cart functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function addToCart(name, price, button) {
  const item = {
    name: name,
    price: price,
    quantity: 1,
    image: button.closest('.product-card').querySelector('img').src
  };
  cart.push(item);
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = '/pages/cart.html';
}

function updateQuantity(index, change) {
  cart[index].quantity = Math.max(1, cart[index].quantity + change);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

function updateCartUI() {
  const cartItems = document.getElementById('cart-items');
  const totalItems = document.getElementById('total-items');
  const subtotalElem = document.getElementById('subtotal');
  const taxElem = document.getElementById('tax');
  const totalPrice = document.getElementById('total-price');
  
  if (cartItems) {
    cartItems.innerHTML = '';
    let subtotal = 0;
    
    cart.forEach((item, index) => {
      const div = document.createElement('div');
      div.className = 'cart-item';
      div.innerHTML = `
        <img src="${item.image}" alt="${item.name}" style="width: 100px; height: 100px; object-fit: cover;">
        <div class="cart-item-details">
          <h3>${item.name}</h3>
          <p>$${item.price}</p>
          <div class="quantity-controls">
            <button onclick="updateQuantity(${index}, -1)"><i class="fas fa-minus"></i></button>
            <span>${item.quantity}</span>
            <button onclick="updateQuantity(${index}, 1)"><i class="fas fa-plus"></i></button>
          </div>
          <p>Total: $${(item.price * item.quantity).toFixed(2)}</p>
        </div>
        <button onclick="removeFromCart(${index})" class="remove-button">Remove</button>
      `;
      cartItems.appendChild(div);
      subtotal += parseFloat(item.price) * item.quantity;
    });
    
    const tax = subtotal * 0.1;
    const total = subtotal + tax;
    
    totalItems.textContent = cart.length;
    subtotalElem.textContent = subtotal.toFixed(2);
    taxElem.textContent = tax.toFixed(2);
    totalPrice.textContent = total.toFixed(2);
  }
}

function removeFromCart(index) {
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  updateCartUI();
}

// Reviews functionality
let reviews = JSON.parse(localStorage.getItem('reviews')) || [];

const reviewForm = document.getElementById('reviewForm');
if (reviewForm) {
  reviewForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const review = {
      name: formData.get('name'),
      product: formData.get('product'),
      rating: document.querySelectorAll('.rating i.active').length,
      text: formData.get('text'),
      date: new Date().toLocaleDateString()
    };
    reviews.push(review);
    localStorage.setItem('reviews', JSON.stringify(reviews));
    updateReviewsUI();
    e.target.reset();
  });
}

function processPayment(event) {
  event.preventDefault();
  alert('Thank you for your purchase! Your order has been confirmed.');
  cart = [];
  localStorage.setItem('cart', JSON.stringify(cart));
  window.location.href = '../index.html';
  return false;
}

function updateReviewsUI() {
  const reviewsList = document.getElementById('reviews-list');
  if (reviewsList) {
    reviewsList.innerHTML = reviews.map(review => `
      <div class="review-card">
        <h3>${review.name}</h3>
        <p>${review.product}</p>
        <div class="stars">
          ${'★'.repeat(review.rating)}${'☆'.repeat(5-review.rating)}
        </div>
        <p>${review.text}</p>
        <small>${review.date}</small>
      </div>
    `).join('');
  }
}

// Initialize UI updates
document.addEventListener('DOMContentLoaded', () => {
  updateCartUI();
  updateReviewsUI();
});

// Rating star functionality
document.querySelectorAll('.rating i').forEach(star => {
  star.addEventListener('click', () => {
    const rating = parseInt(star.dataset.rating);
    document.querySelectorAll('.rating i').forEach(s => {
      s.classList.toggle('active', parseInt(s.dataset.rating) <= rating);
    });
  });
});

// Image error handling with loading state
document.querySelectorAll('img').forEach(img => {
  img.style.opacity = '0';
  img.onload = function() {
    this.style.opacity = '1';
  };
  img.onerror = function() {
    this.src = 'https://placehold.co/600x400/1a1a1a/ffd700?text=Product+Image';
    this.alt = 'Product image unavailable';
  };
});
