const productsContainer = document.getElementById('products');
const categoryButtons = document.getElementById('categoryButtons');
const totalDisplay = document.getElementById('total');
const checkoutModal = document.getElementById('checkoutModal');
const checkoutItems = document.getElementById('checkoutItems');

let cart = [];
let currentLanguage = 'en';
let currentCategory = 'All';
let exchangeRate = 4000;
let columns = 3;

function renderProducts() {
  productsContainer.innerHTML = '';
  const filteredProducts = currentCategory === 'All' ? products : products.filter(p => p.category === currentCategory);

  filteredProducts.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${translatePrice(product.price)}</p>
      <div class="quantity-selector">
        <button onclick="changeQuantity(${product.id}, -1)">-</button>
        <span id="qty-${product.id}">1</span>
        <button onclick="changeQuantity(${product.id}, 1)">+</button>
      </div>
      <button class="add-cart" onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsContainer.appendChild(div);
  });

  productsContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

function renderCategories() {
  const categories = ['All', ...new Set(products.map(p => p.category))];
  categoryButtons.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.innerText = cat;
    btn.onclick = () => { currentCategory = cat; renderProducts(); };
    categoryButtons.appendChild(btn);
  });
}

function changeQuantity(id, change) {
  const qtySpan = document.getElementById(`qty-${id}`);
  let qty = parseInt(qtySpan.innerText) + change;
  if (qty < 1) qty = 1;
  qtySpan.innerText = qty;
}

function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).innerText);
  const existing = cart.find(item => item.id === id);
  if (existing) {
    existing.quantity += qty;
  } else {
    const product = products.find(p => p.id === id);
    cart.push({ ...product, quantity: qty });
  }
  updateTotal();
}

function updateTotal() {
  let usd = 0;
  cart.forEach(item => usd += item.price * item.quantity);
  totalDisplay.innerText = `TOTAL: $${usd.toFixed(2)} / ៛${(usd * exchangeRate).toLocaleString()}`;
}

function showCheckout() {
  updateCheckoutList();
  checkoutModal.style.display = 'block';
}

function hideCheckout() {
  checkoutModal.style.display = 'none';
}

function updateCheckoutList() {
  checkoutItems.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'checkout-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h4>${item.name}</h4>
        <div class="checkout-controls">
          <button onclick="decreaseCheckout(${item.id})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseCheckout(${item.id})">+</button>
          <button onclick="removeCheckout(${item.id})">🗑</button>
        </div>
      </div>
    `;
    checkoutItems.appendChild(div);
  });
}

function increaseCheckout(id) {
  const item = cart.find(p => p.id === id);
  if (item) item.quantity++;
  updateCheckoutList();
  updateTotal();
}

function decreaseCheckout(id) {
  const item = cart.find(p => p.id === id);
  if (item && item.quantity > 1) item.quantity--;
  updateCheckoutList();
  updateTotal();
}

function removeCheckout(id) {
  cart = cart.filter(p => p.id !== id);
  updateCheckoutList();
  updateTotal();
}

function confirmOrder() {
  const orderText = cart.map(item => `${item.name} x${item.quantity}`).join('\n') +
    `\nTotal: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)}`;
  sendOrderToTelegram(orderText);
  cart = [];
  hideCheckout();
  updateTotal();
  alert('Order placed successfully!');
}

function sendOrderToTelegram(text) {
  const botToken = "YOUR_BOT_TOKEN"; // <-- your bot token
  const chatId = "YOUR_CHAT_ID";      // <-- your chat id
  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  }).catch(console.error);
}

function setColumns(num) {
  columns = num;
  renderProducts();
}

function setLanguage(lang) {
  currentLanguage = lang;
  document.getElementById('title').innerText = lang === 'en' ? "Category: Jewelry Toy Food Fruit" : "ប្រភេទ: គ្រឿងអលង្ការ ក្មេងលេង ម្ហូប ផ្លែឈើ";
  renderProducts();
}

function translatePrice(price) {
  return currentLanguage === 'en' ? `Price: $${price.toFixed(2)} / ៛${(price * exchangeRate).toLocaleString()}` :
    `តម្លៃ: $${price.toFixed(2)} / ៛${(price * exchangeRate).toLocaleString()}`;
}

// Initialize
renderCategories();
renderProducts();