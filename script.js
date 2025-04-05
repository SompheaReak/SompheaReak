const productsContainer = document.getElementById('products');
const totalPriceElement = document.getElementById('totalPrice');
const finishOrderButton = document.getElementById('finishOrder');
const cart = {};

products.forEach(product => {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  productDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>Price: $${product.price.toFixed(2)}</p>
    <div class="quantity-selector">
      <button onclick="changeQuantity(${product.id}, -1)">-</button>
      <span id="quantity-${product.id}">1</span>
      <button onclick="changeQuantity(${product.id}, 1)">+</button>
    </div>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;

  productsContainer.appendChild(productDiv);
});

function changeQuantity(productId, change) {
  const quantityElement = document.getElementById(`quantity-${productId}`);
  let quantity = parseInt(quantityElement.innerText);
  quantity = Math.max(1, quantity + change);
  quantityElement.innerText = quantity;
}

function addToCart(productId) {
  const quantity = parseInt(document.getElementById(`quantity-${productId}`).innerText);
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
}

finishOrderButton.addEventListener('click', () => {
  let orderSummary = "New Order:\n";
  for (const id in cart) {
    orderSummary += `${cart[id].name} x ${cart[id].quantity}\n`;
  }
  orderSummary += `Total: $${totalPriceElement.innerText}`;

  sendTelegramMessage(orderSummary);
  alert("Order sent!");
});

function sendTelegramMessage(message) {
  const botToken = '7743854740:AAHst9ZmDELrAcKChfcVpYpyGXF5sXTNSkY';
  const chatId = '1098161879';
  const text = encodeURIComponent(message);

  fetch(`https://api.telegram.org/bot${botToken}/sendMessage?chat_id=${chatId}&text=${text}`)
    .then(response => response.json())
    .then(data => console.log('Message sent:', data))
    .catch(error => console.error('Error sending message:', error));
}