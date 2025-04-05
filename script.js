let cart = [];

function updateQuantity(productId, change) {
  const qtyElement = document.getElementById(productId);
  let qty = parseInt(qtyElement.innerText) + change;
  if (qty < 1) qty = 1;
  qtyElement.innerText = qty;
}

function addToCart(productId, price, productName) {
  const qty = parseInt(document.getElementById(productId).innerText);
  const existingItem = cart.find(item => item.productId === productId);

  if (existingItem) {
    existingItem.quantity += qty;
  } else {
    cart.push({
      productId: productId,
      name: productName,
      price: price,
      quantity: qty
    });
  }

  renderCart();
}

function renderCart() {
  const cartItems = document.getElementById('cart-items');
  cartItems.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    cartItems.innerHTML += `<p>${item.name} - $${item.price} x ${item.quantity}</p>`;
  });

  const totalDisplay = document.createElement('p');
  totalDisplay.innerText = `Total: $${total.toFixed(2)}`;
  cartItems.appendChild(totalDisplay);
}

function checkout() {
  if (cart.length === 0) {
    alert("Your cart is empty!");
    return;
  }

  let orderSummary = "Order Summary:\n";
  cart.forEach(item => {
    orderSummary += `${item.name} - $${item.price} x ${item.quantity}\n`;
  });

  orderSummary += `Total: $${cart.reduce((total, item) => total + (item.price * item.quantity), 0).toFixed(2)}`;
  
  alert(orderSummary);

  // Here you can send the order to Telegram API or further processing
  cart = [];  // Empty cart after checkout
  renderCart(); // Update cart display
}