let cart = JSON.parse(localStorage.getItem('cart')) || [];
const exchangeRate = 4000; // KHR rate
const checkoutItems = document.getElementById('checkoutItems');

function renderCheckoutList() {
  checkoutItems.innerHTML = '';
  cart.forEach(item => {
    const div = document.createElement('div');
    div.className = 'checkout-item';
    div.innerHTML = `
      <img src="${item.image}" alt="${item.name}" width="60">
      <div style="flex: 1; margin-left: 10px;">
        <h4>${item.name}</h4>
        <div class="checkout-controls">
          <button onclick="decreaseQuantity(${item.id})">-</button>
          <span>${item.quantity}</span>
          <button onclick="increaseQuantity(${item.id})">+</button>
          <button onclick="removeItem(${item.id})">🗑</button>
        </div>
      </div>
    `;
    checkoutItems.appendChild(div);
  });
}

function increaseQuantity(id) {
  const item = cart.find(p => p.id === id);
  if (item) item.quantity++;
  updateCart();
}

function decreaseQuantity(id) {
  const item = cart.find(p => p.id === id);
  if (item && item.quantity > 1) item.quantity--;
  updateCart();
}

function removeItem(id) {
  cart = cart.filter(p => p.id !== id);
  updateCart();
}

function updateCart() {
  localStorage.setItem('cart', JSON.stringify(cart));
  renderCheckoutList();
}

function confirmOrder() {
  const name = document.getElementById('customerName').value.trim();
  const phone = document.getElementById('customerPhone').value.trim();
  const address = document.getElementById('customerAddress').value.trim();

  if (!name || !phone || !address) {
    alert("Please fill customer info!");
    return;
  }

  const orderText = `
New Order Received!
--------------------
Customer: ${name}
Phone: ${phone}
Address: ${address}
--------------------
Items:
${cart.map(item => `- ${item.name} x${item.quantity}`).join('\n')}
--------------------
Total: $${cart.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2)} / ៛${(cart.reduce((sum, item) => sum + item.price * item.quantity, 0) * exchangeRate).toLocaleString()}
Date: ${new Date().toLocaleString()}
`;

  sendOrderToTelegram(orderText);

  alert("✅ Order sent successfully!");
  localStorage.removeItem('cart');
  window.location.href = "index.html"; // Back to home
}

function sendOrderToTelegram(text) {
  const botToken = "7743854740:AAHst9ZmDELrAcKChfcVpYpyGXF5sXTNSkY"; 
  const chatId = "1098161879"; 

  const url = `https://api.telegram.org/bot${botToken}/sendMessage`;

  fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ chat_id: chatId, text })
  }).catch(console.error);
}

function cancelOrder() {
  window.location.href = "index.html";
}

// Initialize
renderCheckoutList();
