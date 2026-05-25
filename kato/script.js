// 1. Product Database (Remains the same)
const products = [
    { id: 1, name: "Chicken Katsu", price: 35000, category: "Bowls", img: "katsuh.jpeg", desc: "Crispy chicken katsu served with fluffy rice, fresh salad, and savory special sauce. Perfectly crunchy on the outside and juicy on the inside for a satisfying meal experience.." },
    { id: 2, name: "Chicken Katsu Curry", price: 35000, category: "Bowls", img: "curry.jpeg", desc: "Rich Japanese curry with crispy chicken katsu served over warm rice, topped with savory curry sauce for a comforting and satisfying flavor in every bite.." },
    { id: 3, name: "Grilled chicken glazed", price: 30000, category: "Bowls", img: "rice1.jpeg", desc: "Grilled chicken glazed with sweet and savory teriyaki sauce, served over warm rice with fresh toppings for a delicious and satisfying Japanese-style rice bowl.." },
    { id: 4, name: "Spicy Sambal Matah", price: 28000, category: "Bowls", img: "rice2.jpeg", desc: "Spicy sambal matah chicken served over warm rice with fresh aromatic toppings, combining savory, spicy, and refreshing flavors in one satisfying rice bowl.." },
    { id: 5, name: "Shredded Chicken Rice Bowl", price: 30000, category: "Bowls", img: "rice3.jpeg", desc: "Shredded chicken rice bowl served over warm rice with savory seasoning and flavorful toppings, creating a simple yet delicious meal perfect for any time of the day.." },
    { id: 6, name: "Lemon Tea", price: 15000, category: "Drinks", img: "lemon.jpeg", desc: "Refreshing blend of brewed tea and fresh lemon juice, served chilled over ice. Light, tangy, and perfectly sweet for a refreshing boost anytime.." },
    { id: 7, name: "Strawberry Milk", price: 20000, category: "Drinks", img: "milk.jpeg", desc: "Strawberry Milk — A creamy blend of fresh milk and sweet strawberry flavor, served chilled for a smooth, fruity, and refreshing taste.." },
    { id: 8, name: "Dark Chocolate Milk", price: 20000, category: "Drinks", img: "dark.jpeg", desc: "Dark Chocolate Milk — A bold and creamy mix of fresh milk and rich dark chocolate, served chilled for a deep, slightly bitter-sweet and indulgent flavor.." },
    { id: 9, name: "Crispy French Fries", price: 15000, category: "Bowls", img: "kentang.jpeg", desc: "GCrispy French Fries - Golden, crunchy potato fries served hot and perfectly seasoned for a simple, savory, and satisfying snack." },
    { id: 10, name: "Cheese Shrimp", price: 15000, category: "Snacks", img: "keju.jpeg", desc: "Cheese Shrimp - Crispy golden shrimp stuffed or coated with melted cheese, delivering a savory, creamy, and crunchy bite in every piece." },
];

// 2. Load Cart from LocalStorage on Startup
let cart = JSON.parse(localStorage.getItem('KATO_CART')) || [];

// 3. Navigation
function showSection(sectionId) {
    document.querySelectorAll('.page').forEach(p => p.style.display = 'none');
    document.getElementById(sectionId).style.display = 'block';
    window.scrollTo(0,0);
    
    // Always refresh cart view when entering cart page
    if(sectionId === 'cart') renderCart();
}

function scrollToAbout() {
    document.getElementById('about-section').scrollIntoView({ behavior: 'smooth' });
}

// 4. Render Products
function renderProducts() {
    const grid = document.getElementById('product-grid');
    if(!grid) return;
    grid.innerHTML = products.map(p => `
        <div class="product-card" onclick="showProductDetail(${p.id})">
            <img src="${p.img}">
            <h3>${p.name}</h3>
            <span class="price">Rp ${p.price.toLocaleString()}</span>
            <button class="btn" style="margin-top:10px; width:100%">Details</button>
        </div>
    `).join('');
}

function showProductDetail(id) {
    const p = products.find(prod => prod.id === id);
    document.getElementById('detail-content').innerHTML = `
        <div class="detail-img"><img src="${p.img}"></div>
        <div class="detail-info">
            <h1>${p.name}</h1>
            <p class="price">Rp ${p.price.toLocaleString()}</p>
            <p>${p.desc}</p>
            <button class="btn" onclick="addToCart(${p.id})" style="margin-top:20px">Add to Cart</button>
        </div>
    `;
    showSection('product-detail');
}

// 5. Cart Management (With LocalStorage Saving)
function addToCart(id) {
    const p = products.find(prod => prod.id === id);
    const itemInCart = cart.find(i => i.id === id);
    
    if(itemInCart) {
        itemInCart.quantity++;
    } else {
        cart.push({...p, quantity: 1});
    }
    
    saveCart();
    updateCartBadge();
    alert(`${p.name} added to cart!`);
}

function saveCart() {
    localStorage.setItem('KATO_CART', JSON.stringify(cart));
}

function updateCartBadge() {
    const count = cart.reduce((a, b) => a + b.quantity, 0);
    document.getElementById('cart-count').innerText = count;
}

function renderCart() {
    const container = document.getElementById('cart-items-container');
    const summary = document.getElementById('cart-summary');
    
    if(cart.length === 0) {
        container.innerHTML = `
            <div style="text-align:center; padding:50px;">
                <i class="fas fa-shopping-basket" style="font-size:3rem; color:#ccc;"></i>
                <p style="margin-top:10px;">Your cart is empty.</p>
                <button class="btn" onclick="showSection('shop')" style="margin-top:20px;">Go Shopping</button>
            </div>`;
        summary.innerHTML = "";
        return;
    }

    container.innerHTML = cart.map(i => `
        <div class="cart-item" style="display:flex; justify-content:space-between; align-items:center; background:white; padding:15px; border-radius:15px; margin-bottom:10px;">
            <div style="display:flex; align-items:center; gap:15px;">
                <img src="${i.img}" width="60" style="border-radius:10px">
                <div>
                    <h4 style="margin:0;">${i.name}</h4>
                    <p style="color:var(--primary); font-weight:700;">Rp ${i.price.toLocaleString()}</p>
                </div>
            </div>
            <div style="display:flex; align-items:center; gap:10px;">
                <button onclick="changeQty(${i.id}, -1)" style="width:30px; height:30px; border-radius:50%; border:1px solid #ddd;">-</button>
                <span>${i.quantity}</span>
                <button onclick="changeQty(${i.id}, 1)" style="width:30px; height:30px; border-radius:50%; border:1px solid #ddd;">+</button>
                <button onclick="removeFromCart(${i.id})" style="border:none; background:none; color:red; margin-left:10px; cursor:pointer;">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');

    const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
    summary.innerHTML = `
        <div style="background:white; padding:20px; border-radius:20px; margin-top:20px; text-align:right;">
            <h3>Total: Rp ${total.toLocaleString()}</h3>
            <button class="btn" onclick="showSection('checkout')" style="margin-top:15px; width:100%; max-width:300px;">Proceed to Checkout</button>
        </div>
    `;
}

function changeQty(id, delta) {
    const item = cart.find(i => i.id === id);
    if(item) {
        item.quantity += delta;
        if(item.quantity < 1) {
            removeFromCart(id);
        } else {
            saveCart();
            updateCartBadge();
            renderCart();
        }
    }
}

function removeFromCart(id) {
    cart = cart.filter(i => i.id !== id);
    saveCart();
    updateCartBadge();
    renderCart();
}

    // 6. Checkout Logic (Updated for WhatsApp + DANA)
document.getElementById('checkout-form').addEventListener('submit', (e) => {
    e.preventDefault();

    // 1. Collect Customer Data from the form
    const name = document.querySelector('input[placeholder="Full Name"]').value;
    const email = document.querySelector('input[placeholder="Email Address"]').value;
    const address = document.querySelector('textarea[placeholder*="Full Address"]').value;
    const method = document.querySelector('input[name="payment"]:checked').value;
    const phone = document.querySelector('input[type="tel"]').value;
    const total = cart.reduce((a, b) => a + (b.price * b.quantity), 0);
    
    // 2. Create the Item List for the message
    const itemList = cart.map(item => `- ${item.name} (x${item.quantity})`).join('%0A');

    // 3. Format the WhatsApp Message
    // %0A is a "New Line"
    const message = `*PESANAN BARU - KATO FOOD*%0A` +
                    `----------------------------%0A` +
                    `*Nama:* ${name}%0A` +
                    `*No. E-Wallet:* ${phone}%0A` +
                    `*Alamat:* ${address}%0A%0A` +
                    `*Pesanan:*%0A${itemList}%0A%0A` +
                    `*Total Bayar:* Rp ${total.toLocaleString()}%0A` +
                    `*Metode:* ${method}%0A` +
                    `----------------------------%0A` +
                    `Mohon segera diproses ya!`;

    // 4. YOUR PHONE NUMBER (Use country code 62, not 0)
    const myWhatsAppNumber = "6289623279158"; // <-- CHANGE THIS TO YOUR DANA/WHATSAPP NUMBER

    alert(`Order Confirmed! Redirecting to WhatsApp to complete payment via ${method}...`);

    // 5. Clear cart and storage
    cart = [];
    saveCart();
    updateCartBadge();

    // 6. Redirect to WhatsApp
    window.location.href = `https://wa.me/${myWhatsAppNumber}?text=${message}`;
});
    // Clear cart after purchase
    cart = [];
    saveCart();
    updateCartBadge();
    showSection('home');


// INITIALIZE APP
renderProducts();
updateCartBadge(); // Ensure the count is correct on load