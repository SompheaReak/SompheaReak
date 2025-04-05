const productsContainer = document.getElementById('products');
const totalPriceElement = document.getElementById('totalPrice');
const finishOrderButton = document.getElementById('finishOrder');
const cart = {};

function displayProducts(filterCategory = 'All') {
  productsContainer.innerHTML = '';

  const filteredProducts = (filterCategory === 'All') ? products : products.filter(p => p.category === filterCategory);

  filteredProducts.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    productDiv.innerHTML = `
      <div class="img-wrapper">
        <div class="loading">Loading...</div>
        <img src="${product.image}" alt="${product.name}" onload="this.previousElementSibling.style.display='none'">
      </div>
      <h3>${product.name}</h3>
      <p>Price: $${product.price.toFixed(2)}</p>
      <div class="quantity-selector">
        <button onclick="changeQuantity(${product.id}, -1)">-</button>
        <span id="quantity-${product.id}">1</span>
        <button onclick="changeQuantity(${product.id}, 1)">+</button>
      </div>
      <button onclick="addToCart(${product.id}, this)">Add to Cart</button>
    `;

    productsContainer.appendChild(productDiv);
  });
}

function filterProducts(category) {
  displayProducts(category);
}

function changeQuantity(productId, change) {
  const quantityElement = document.getElementById(`quantity-${productId}`);
  if (!quantityElement) return;
  
  let quantity = parseInt(quantityElement.innerText);
  quantity = Math.max(1, quantity + change);
  quantityElement.innerText = quantity;
}

function addToCart(productId, buttonElement) {
  const quantityElement = document.getElementById(`quantity-${productId}`);
  if (!quantityElement) return;

  const quantity = parseInt(quantityElement.innerText);
  const product = products.find(p => p.id === productId);

  if (!cart[productId]) {
    cart[productId] = { ...product, quantity: 0 };
  }

  cart[productId].quantity += quantity;
  updateTotal();

  // Small animation
  buttonElement.innerText = "Added!";
  buttonElement.disabled = true;
  setTimeout(() => {
    buttonElement.innerText = "Add to Cart";
    buttonElement.disabled = false;
  }, 1000);
}

function updateTotal() {
  let total = 0;
  for (const id in cart) {
    total += cart[id].price * cart[id].quantity;
  }
  totalPriceElement.innerText = total.toFixed(2);
}

finishOrderButton.addEventListener('click', () => {
  if (Object.keys(cart).length === 0) {
    alert("Cart is empty. Please add products!");
    return;
  }

  const customerName = prompt("សូមបញ្ចូលឈ្មោះអតិថិជន (Enter Customer Name):");
  if (!customerName) {
    alert("You must enter a customer name.");
    return;
  }

  let orderSummary = `New Order!\nអតិថិជន (Customer): ${customerName}\n`;

  const now = new Date();
  const formattedDate = now.getFullYear() + "-" + (now.getMonth()+1).toString().padStart(2,'0') + "-" + now.getDate().toString().padStart(2,'0') +
                        " " + now.getHours().toString().padStart(2,'0') + ":" + now.getMinutes().toString().padStart(2,'0');
  orderSummary += `Date: ${formattedDate}\n\nItems:\n`;

  for (const id in cart) {
    orderSummary += `- ${cart[id].name} x ${cart[id].quantity}\n`;
  }

  orderSummary += `\nTotal: $${totalPriceElement.innerText}`;

  const confirmSend = confirm("តើអ្នកចង់ផ្ញើការបញ្ជាទិញនេះទៅ Telegram ដែរឬទេ? (Send order?)");
  if (confirmSend) {
    sendTelegramMessage(orderSummary);
    alert("✅ Order sent successfully!");
    clearCart();
    displayProducts();
  }
});

function clearCart() {
  for (const id in cart) {
    delete cart[id];
  }
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

// Load all products initially
displayProducts();