// // public/js/main.js - COMPLETE CLIENT-SIDE FUNCTIONALITY
// document.addEventListener('DOMContentLoaded', function() {
//     // Initialize cart count
//     updateCartCount();
    
//     // Add to cart buttons
//     document.querySelectorAll('.add-to-cart-btn, .add-to-cart-large').forEach(btn => {
//         btn.addEventListener('click', function(e) {
//             e.preventDefault();
//             const productId = this.dataset.id;
//             const quantity = document.getElementById('quantity') ? 
//                 parseInt(document.getElementById('quantity').value) : 1;
//             addToCart(productId, quantity);
//         });
//     });
    
//     // Cart quantity controls
//     document.addEventListener('click', function(e) {
//         if (e.target.classList.contains('qty-btn')) {
//             e.preventDefault();
//             const productId = e.target.dataset.id;
//             const isPlus = e.target.classList.contains('plus');
//             const currentQty = parseInt(e.target.closest('.cart-item-quantity, .quantity-selector').querySelector('.qty, input[type="number"]').value);
//             const newQty = isPlus ? currentQty + 1 : Math.max(1, currentQty - 1);
//             updateCartQuantity(productId, newQty);
//         }
        
//         if (e.target.classList.contains('remove-item')) {
//             e.preventDefault();
//             const productId = e.target.dataset.id || e.target.closest('.cart-item').dataset.id;
//             removeFromCart(productId);
//         }
//     });
    
//     // Search on enter
//     document.querySelector('.search-input')?.addEventListener('keypress', function(e) {
//         if (e.key === 'Enter') {
//             e.target.form.submit();
//         }
//     });
// });

// function addToCart(productId, quantity = 1) {
//     const btn = event.target.closest('.add-to-cart-btn, .add-to-cart-large');
//     btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
//     btn.disabled = true;
    
//     fetch(`/cart/add/${productId}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/json',
//         },
//         body: JSON.stringify({ quantity })
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             showNotification('✅ Added to cart!', 'success');
//             updateCartCount();
//             animateButton(btn);
//         } else {
//             showNotification('❌ Error adding to cart', 'error');
//         }
//         resetButton(btn);
//     })
//     .catch(error => {
//         console.error('Error:', error);
//         showNotification('❌ Network error', 'error');
//         resetButton(btn);
//     });
// }

// function updateCartQuantity(productId, quantity) {
//     const row = event.target.closest('.cart-item');
//     fetch(`/cart/update/${productId}`, {
//         method: 'POST',
//         headers: {
//             'Content-Type': 'application/x-www-form-urlencoded',
//         },
//         body: `quantity=${quantity}`
//     })
//     .then(response => response.json())
//     .then(data => {
//         if (data.success) {
//             // Update UI
//             const qtyElement = row.querySelector('.qty, input[type="number"]');
//             qtyElement.value = quantity;
//             const totalElement = row.querySelector('.cart-item-total');
//             const price = parseFloat(row.querySelector('.item-price').textContent.replace('₹', ''));
//             totalElement.textContent = `₹${(price * quantity).toFixed(2)}`;
//             updateCartCount();
//             showNotification('🛒 Cart updated!', 'success');
//         }
//     });
// }

// function removeFromCart(productId) {
//     if (confirm('Remove this item from cart?')) {
//         fetch(`/cart/remove/${productId}`, { method: 'POST' })
//         .then(() => {
//             showNotification('🗑️ Item removed!', 'success');
//             updateCartCount();
//             // Reload cart page or remove row
//             if (window.location.pathname.includes('/cart')) {
//                 window.location.reload();
//             }
//         });
//     }
// }

// function updateCartCount() {
//     // Simple fallback - get from server or localStorage
//     fetch('/cart')
//         .then(res => res.text())
//         .then(html => {
//             const tempDiv = document.createElement('div');
//             tempDiv.innerHTML = html;
//             const items = tempDiv.querySelectorAll('.cart-item').length;
//             const cartCount = document.getElementById('cartCount');
//             if (cartCount) {
//                 cartCount.textContent = items;
//             }
//         })
//         .catch(() => {
//             const cartCount = document.getElementById('cartCount');
//             if (cartCount) cartCount.textContent = '0';
//         });
// }

// function animateButton(btn) {
//     btn.style.transform = 'scale(0.95)';
//     btn.style.transition = 'transform 0.2s';
//     setTimeout(() => {
//         btn.style.transform = 'scale(1)';
//     }, 200);
// }

// function resetButton(btn) {
//     setTimeout(() => {
//         btn.innerHTML = '<i class="fas fa-cart-plus"></i> Added!';
//         setTimeout(() => {
//             btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
//             btn.disabled = false;
//         }, 1000);
//     }, 500);
// }

// function showNotification(message, type = 'success') {
//     // Remove existing notifications
//     document.querySelectorAll('.notification').forEach(n => n.remove());
    
//     const notification = document.createElement('div');
//     notification.className = `notification notification-${type}`;
//     notification.innerHTML = message;
//     document.body.appendChild(notification);
    
//     // Animate in
//     requestAnimationFrame(() => notification.classList.add('show'));
    
//     // Auto remove
//     setTimeout(() => {
//         notification.classList.remove('show');
//         setTimeout(() => notification.remove(), 300);
//     }, 3000);
// }

// // Smooth scrolling for anchor links
// document.querySelectorAll('a[href^="#"]').forEach(anchor => {
//     anchor.addEventListener('click', function (e) {
//         e.preventDefault();
//         document.querySelector(this.getAttribute('href')).scrollIntoView({
//             behavior: 'smooth'
//         });
//     });
// });

// // Mobile menu toggle
// const hamburger = document.querySelector('.hamburger');
// if (hamburger) {
//     hamburger.addEventListener('click', () => {
//         document.querySelector('.nav-links').classList.toggle('active');
//     });
// }




// document.addEventListener("DOMContentLoaded", () => {

//     const buttons = document.querySelectorAll('.add-to-cart-btn');

//     buttons.forEach(button => {
//         button.addEventListener('click', async function () {

//             const productId = this.dataset.id;

//             console.log("Clicked product:", productId); // DEBUG

//             try {
//                 const res = await fetch(`/cart/add/${productId}`, {
//                     method: 'POST'
//                 });

//                 const data = await res.json();

//                 if (res.status === 401) {
//                     showPopup("Please login first 🔐");
//                     return;
//                 }

//                 showPopup("Added to cart 🛒");

//             } catch (err) {
//                 console.error(err);
//                 showPopup("Something went wrong");
//             }
//         });
//     });

// });

// // ✅ POPUP FUNCTION
// function showPopup(message) {
//     const popup = document.getElementById('popup');

//     if (!popup) {
//         console.error("Popup div not found ❌");
//         return;
//     }

//     popup.innerText = message;
//     popup.classList.add('show');

//     setTimeout(() => {
//         popup.classList.remove('show');
//     }, 2000);
// }

// public/js/main.js - FINAL CLEAN VERSION

document.addEventListener('DOMContentLoaded', function () {

    // Update cart count on load
    updateCartCount();

    // ✅ Add to cart buttons (ONLY ONE LISTENER)
    document.querySelectorAll('.add-to-cart-btn, .add-to-cart-large').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();

            const productId = this.dataset.id;
            const quantity = document.getElementById('quantity')
                ? parseInt(document.getElementById('quantity').value)
                : 1;

            addToCart(productId, quantity, this);
        });
    });

    // ✅ Cart controls
    document.addEventListener('click', function (e) {

        if (e.target.classList.contains('qty-btn')) {
            e.preventDefault();

            const productId = e.target.dataset.id;
            const isPlus = e.target.classList.contains('plus');

            const qtyElement = e.target.closest('.cart-item-quantity, .quantity-selector')
                .querySelector('.qty, input[type="number"]');

            const currentQty = parseInt(qtyElement.value || qtyElement.textContent);
            const newQty = isPlus ? currentQty + 1 : Math.max(1, currentQty - 1);

            updateCartQuantity(productId, newQty);
        }

        if (e.target.classList.contains('remove-item')) {
            e.preventDefault();
            const productId = e.target.dataset.id || e.target.closest('.cart-item').dataset.id;
            removeFromCart(productId);
        }
    });

});

// ✅ ADD TO CART FUNCTION (FIXED)
function addToCart(productId, quantity = 1, btn) {

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Adding...';
    btn.disabled = true;

    fetch(`/cart/add/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ quantity })
    })
    .then(async (response) => {

        // 🔐 Not logged in
        if (response.status === 401) {
            showPopup("Please login first 🔐");
            resetButton(btn);
            return;
        }

        const data = await response.json();

        if (data.success) {
            showPopup("Added to cart 🛒");
            updateCartCount();
            animateButton(btn);
        } else {
            showPopup("Error ❌");
        }

        resetButton(btn);
    })
    .catch(error => {
        console.error(error);
        showPopup("Server error ❌");
        resetButton(btn);
    });
}

// ✅ UPDATE QUANTITY
function updateCartQuantity(productId, quantity) {
    fetch(`/cart/update/${productId}`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: `quantity=${quantity}`
    })
    .then(res => res.json())
    .then(data => {
        if (data.success) {
            showPopup("Cart updated 🛒");
            setTimeout(() => location.reload(), 500);
        }
    });
}

// ✅ REMOVE ITEM
function removeFromCart(productId) {
    if (!confirm('Remove this item?')) return;

    fetch(`/cart/remove/${productId}`, { method: 'POST' })
    .then(() => {
        showPopup("Item removed 🗑️");
        setTimeout(() => location.reload(), 500);
    });
}

// ✅ UPDATE CART COUNT
function updateCartCount() {
    fetch('/cart')
        .then(res => res.text())
        .then(html => {
            const temp = document.createElement('div');
            temp.innerHTML = html;

            const count = temp.querySelectorAll('.cart-item').length;

            const cartCount = document.getElementById('cartCount');
            if (cartCount) cartCount.textContent = count;
        })
        .catch(() => {
            const cartCount = document.getElementById('cartCount');
            if (cartCount) cartCount.textContent = '0';
        });
}

// ✅ BUTTON ANIMATION
function animateButton(btn) {
    btn.style.transform = 'scale(0.95)';
    setTimeout(() => {
        btn.style.transform = 'scale(1)';
    }, 200);
}

// ✅ RESET BUTTON
function resetButton(btn) {
    setTimeout(() => {
        btn.innerHTML = '<i class="fas fa-cart-plus"></i> Add to Cart';
        btn.disabled = false;
    }, 800);
}

// ✅ POPUP FUNCTION
function showPopup(message) {
    const popup = document.getElementById('popup');

    if (!popup) {
        console.error("Popup not found ❌");
        return;
    }

    popup.innerText = message;
    popup.classList.add('show');

    setTimeout(() => {
        popup.classList.remove('show');
    }, 2000);
}

// const hamburger = document.getElementById("hamburger");
// const navLinks = document.getElementById("navLinks");

// // ✅ Toggle menu
// hamburger.addEventListener("click", () => {
//     navLinks.classList.toggle("active");
// });

// // ✅ Close when clicking outside
// document.addEventListener("click", (e) => {
//     if (!hamburger.contains(e.target) && !navLinks.contains(e.target)) {
//         navLinks.classList.remove("active");
//     }
// });

// // ✅ Close when clicking any link
// document.querySelectorAll(".nav-link").forEach(link => {
//     link.addEventListener("click", () => {
//         navLinks.classList.remove("active");
//     });
// });

// // ✅ Close on ESC key
// document.addEventListener("keydown", (e) => {
//     if (e.key === "Escape") {
//         navLinks.classList.remove("active");
//     }
// });
const hamburger = document.getElementById("hamburger");
const navLinks = document.getElementById("navLinks");

hamburger.addEventListener("click", () => {
    navLinks.classList.toggle("active");
    hamburger.classList.toggle("open"); // ✅ important
});