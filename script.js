const productsContainer = document.getElementById('products');
const cart = [];

products.forEach(product => {
  const div = document.createElement('div');
  div.className = "product-card";
  div.innerHTML = `
    <img src="${product.image}" alt="${product.name}">
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;
  productsContainer.appendChild(div);
});

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  renderCart();
}

function renderCart() {
  const cartDiv = document.getElementById('cart');
  cartDiv.innerHTML = '';
  cart.forEach(item => {
    const p = document.createElement('p');
    p.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartDiv.appendChild(p);
  });
}

function checkout() {
  alert(`Total: $${cart.reduce((total, item) => total + item.price, 0).toFixed(2)}`);
}