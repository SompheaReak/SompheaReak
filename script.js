const exchangeRate = 4000; // 1 USD = 4000 KHR
const productsContainer = document.getElementById('products');
const totalPriceElement = document.getElementById('totalPrice');
const totalPriceKHRElement = document.getElementById('totalPriceKHR');
const finishOrderButton = document.getElementById('finishOrder');
const categoryButtonsContainer = document.getElementById('category-buttons');
const categoryTitle = document.getElementById('categoryTitle');
const totalLabel = document.getElementById('totalLabel');
let currentLanguage = 'en';
let cart = {};

function setLanguage(lang) {
  currentLanguage = lang;
  displayCategories();
  displayProducts();
  updateLabels();
}

function setColumns(num) {
  document.getElementById('products').style.gridTemplateColumns = `repeat(${num}, 1fr)`;
}

function updateLabels() {
  if (currentLanguage === 'kh') {
    categoryTitle.innerText = "ប្រភេទ";
    totalLabel.innerText = "សរុប :";
    finishOrderButton.innerText = "បញ្ចប់ការបញ្ជាទិញ";
  } else {
    categoryTitle.innerText = "CATEGORY";
    totalLabel.innerText = "TOTAL :";
    finishOrderButton.innerText = "Finish Order";
  }
}

function displayCategories() {
  const categories = ["All", ...new Set(products.map(p => p.category))];
  categoryButtonsContainer.innerHTML = '';
  categories.forEach(cat => {
    const button = document.createElement('button');
    button.innerText = cat;
    button.onclick = () => displayProducts(cat);
    categoryButtonsContainer.appendChild(button);
  });
}

function displayProducts(filterCategory = 'All') {
  productsContainer.innerHTML = '';

  const filteredProducts = (filterCategory === 'All') ? products : products.filter(p => p.category === filterCategory);

  filteredProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    const priceInKHR = (product.price * exchangeRate).toLocaleString();

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}">
      <h3>${product.name}</h3>
      <p>${currentLanguage === 'kh' ? 'តម្លៃ' : 'Price'}: $${product.price.toFixed(2)} / ៛${priceInKHR}</p>
      <div class="quantity-selector">
        <button onclick="changeQuantity(${product.id}, -1)">-</button>
        <span id="quantity-${product.id}">1</span>
        <button onclick="changeQuantity(${product.id}, 1)">+</button>
      </div>
      <button onclick="addToCart(${product.id})">${currentLanguage === 'kh' ? 'បន្ថែម' : 'Add to Cart'}</button>
    `;

    productsContainer.appendChild(productDiv);
  });
}

function changeQuantity(productId, change) {
  const quantityElement = document.getElementById(`quantity-${productId}`);
  if (!quantityElement) return;

  let quantity = parseInt(quantityElement.innerText);
  quantity = Math.max(1, quantity + change);
  quantityElement.innerText = quantity;
}

function addToCart(productId) {
  const quantityElement = document.getElementById(`quantity-${productId}`);
  if (!quantityElement) return;

  const quantity = parseInt(quantityElement.innerText);
  const product = products.find(p => p.id === productId);

  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 0 };
  }

  cart[productId].quantity += quantity;
  updateTotal();
}

function updateTotal() {
  let total = 0;
  for (const id in cart) {
    total += cart[id].price * cart[id].quantity;
  }
  totalPriceElement.innerText = total.toFixed(2);
  totalPriceKHRElement.innerText = (total * exchangeRate).toLocaleString();
}

finishOrderButton.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    alert(currentLanguage === 'kh' ? "សូមបន្ថែមផលិតផលជាមុន!" : "Cart is empty!");
    return;
  }

  const customerName = prompt(currentLanguage === 'kh' ? "សូមបញ្ចូលឈ្មោះអតិថិជន" : "Enter Customer Name:");
  const phoneNumber = prompt(currentLanguage === 'kh' ? "សូមបញ្ចូលលេខទូរស័ព្ទ" : "Enter Phone Number:");

  if (!customerName || !phoneNumber) {
    alert(currentLanguage === 'kh' ? "សូមបញ្ចូលឈ្មោះ និង លេខទូរស័ព្ទ!" : "Name and Phone required!");
    return;
  }

  let orderSummary = `New Order!\nអតិថិជន: ${customerName}\nលេខទូរស័ព្ទ: ${phoneNumber}\n\nรายการទិញ / Items:\n`;
  for (const id in cart) {
    orderSummary += `- ${cart[id].name} x ${cart[id].quantity}\n`;
  }
  orderSummary += `\nសរុប / Total: $${totalPriceElement.innerText} / ៛${totalPriceKHRElement.innerText}`;

  sendTelegramMessage(orderSummary);
  alert("✅ Order Sent!");
  clearCart();
  displayProducts();
});

function clearCart() {
  cart = {};
  updateTotal();
}

function sendTelegramMessage(message) {
  const botToken = '7743854740:AAHst9ZmDELrAcKChfcVpYpyGXF5sXTNSkY';
  const chatId = '1098161879';
  const text = encodeURIComponent(message);

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`)
    .then(response => response.json())
    .then(data => console.log('Message sent:', data))
    .catch(error => console.error('Error sending message:', error));
}

// Initial Load
displayCategories();
displayProducts();
updateLabels();