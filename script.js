const productsContainer = document.getElementById('products');
const categoryButtons = document.getElementById('categoryButtons');
const totalDisplay = document.getElementById('total');

let cart = [];
let currentLanguage = 'en';
let currentCategory = 'All';
let exchangeRate = 4000;
let columns = 2;

function renderProducts() {
  productsContainer.innerHTML = '';
  const filtered = currentCategory === 'All' ? products : products.filter(p => p.category === currentCategory);

  filtered.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';
    div.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${translatePrice(product.price)}</p>
      ${product.InStock ? `
      <div class="quantity-selector">
        <button onclick="changeQuantity(${product.id}, -1)">-</button>
        <span id="qty-${product.id}">1</span>
        <button onclick="changeQuantity(${product.id}, 1)">+</button>
      </div>
      <button class="add-cart" onclick="addToCart(${product.id})">🛒 ${currentLanguage === 'kh' ? 'បន្ថែម' : 'Add to Cart'}</button>
      ` : `<p style="color:red;">Out of Stock</p>`}
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
  const qty = document.getElementById(`qty-${id}`);
  let value = parseInt(qty.innerText) + change;
  if (value < 1) value = 1;
  qty.innerText = value;
}

function addToCart(id) {
  const qty = parseInt(document.getElementById(`qty-${id}`).innerText);
  const product = products.find(p => p.id === id);
  const existing = cart.find(c => c.id === id);
  if (existing) {
    existing.quantity += qty;
  } else {
    cart.push({ ...product, quantity: qty });
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(currentLanguage === 'kh' ? "បានបន្ថែមទៅក្នុងកន្ត្រក!" : "Added to cart!");
  updateTotal();
}

function updateTotal() {
  let usd = 0;
  cart.forEach(item => usd += item.price * item.quantity);
  totalDisplay.innerText = `TOTAL: $${usd.toFixed(2)} / ៛${(usd * exchangeRate).toLocaleString()}`;
}

function setColumns(num) {
  columns = num;
  renderProducts();
}

function setLanguage(lang) {
  currentLanguage = lang;
  renderProducts();
}

function translatePrice(price) {
  return currentLanguage === 'en'
    ? `Price: $${price.toFixed(2)} / ៛${(price * exchangeRate).toLocaleString()}`
    : `តម្លៃ: $${price.toFixed(2)} / ៛${(price * exchangeRate).toLocaleString()}`;
}

// Init
renderCategories();
renderProducts();
updateTotal();