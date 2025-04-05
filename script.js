const productsContainer = document.getElementById('products');
const categoryButtons = document.getElementById('categoryButtons');
const totalDisplay = document.getElementById('total');
const title = document.getElementById('title');

let cart = JSON.parse(localStorage.getItem('cart')) || [];
let currentLanguage = 'en';
let currentCategory = 'All';
let exchangeRate = 4000;
let columns = window.innerWidth < 600 ? 2 : 3;

function renderProducts() {
  productsContainer.innerHTML = '';
  const filteredProducts = currentCategory === 'All' ? products : products.filter(p => p.category === currentCategory);

  filteredProducts.forEach(product => {
    const div = document.createElement('div');
    div.className = 'product';

    if (product.inStock) {
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
    } else {
      div.innerHTML = `
        <img src="${product.image}" alt="${product.name}">
        <h3>${product.name}</h3>
        <p>${translatePrice(product.price)}</p>
        <div class="out-of-stock">${currentLanguage === 'kh' ? 'អស់ពីស្តុក' : 'OUT OF STOCK'}</div>
      `;
    }

    productsContainer.appendChild(div);
  });

  productsContainer.style.gridTemplateColumns = `repeat(${columns}, 1fr)`;
}

function renderCategories() {
  const categories = ['All', 'Hot Sale', 'Jewelry', 'Toy'];
  categoryButtons.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.innerText = cat;
    btn.onclick = () => {
      currentCategory = cat;
      renderProducts();
    };
    categoryButtons.appendChild(btn);
  });
}

function changeQuantity(id, change) {
  const qtySpan = document.getElementById(`qty-${id}`);
  if (!qtySpan) return;
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
  localStorage.setItem('cart', JSON.stringify(cart));
  updateTotal();

  const product = products.find(p => p.id === id);
  alert(`${currentLanguage === 'kh' ? 'អ្នកបានបន្ថែម' : 'You added'} ${qty} × ${product.name}`);
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
  title.innerText = lang === 'en' ? 'Category' : 'ប្រភេទ';
  renderProducts();
}

function translatePrice(price) {
  return currentLanguage === 'en'
    ? `Price: $${price.toFixed(2)} / ៛${(price * exchangeRate).toLocaleString()}`
    : `តម្លៃ: $${price.toFixed(2)} / ៛${(price * exchangeRate).toLocaleString()}`;
}

// Initialize
renderCategories();
renderProducts();
updateTotal();