const productsContainer = document.getElementById('products');
const categoryButtons = document.getElementById('categoryButtons');
const totalDisplay = document.getElementById('total');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentLanguage = 'en';
let currentCategory = 'All';
let exchangeRate = 4000;
let columns = window.innerWidth < 600 ? 2 : 3; // 2 columns on mobile, 3 columns on bigger

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
      <button class="add-cart" onclick="addToCart(${product.id})">🛒 ${currentLanguage === 'kh' ? 'បន្ថែម' : 'Add to Cart'}</button>
    `;
    productsContainer.appendChild(div);
  });

  productsContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

window.addEventListener('resize', () => {
  columns = window.innerWidth < 600 ? 2 : 3;
  renderProducts();
});

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
  localStorage.setItem('cart', JSON.stringify(cart)); // Save cart
  updateTotal();
}

function updateTotal() {
  let usd = 0;
  cart.forEach(item => usd += item.price * item.quantity);
  totalDisplay.innerText = `TOTAL: $${usd.toFixed(2)} / ៛${(usd * exchangeRate).toLocaleString()}`;
}

function goToCheckout() {
  localStorage.setItem('cart', JSON.stringify(cart)); // Save again before go
  window.location.href = "checkout.html"; // Go to checkout page
}

function setColumns(num) {
  columns = num;
  renderProducts();
}

function setLanguage(lang) {
  currentLanguage = lang;
  document.getElementById('title').innerText = lang === 'en' ? "Category" : "ប្រភេទ";
  renderProducts();
}

function translatePrice(price) {
  return currentLanguage === 'en' ? `Price: $${price.toFixed(2)} / ៛${(price * exchangeRate).toLocaleString()}` :
    `តម្លៃ: $${price.toFixed(2)} / ៛${(price * exchangeRate).toLocaleString()}`;
}

// Initialize
renderCategories();
renderProducts();
updateTotal();