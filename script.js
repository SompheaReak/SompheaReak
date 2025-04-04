const productsContainer = document.getElementById('products');
const cart = [];

products.forEach(product => {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  productDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <h3>${product.name}</h3>
    <p>$${product.price.toFixed(2)}</p>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;

  productsContainer.appendChild(productDiv);
});

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  updateCart();
}

function updateCart() {
  const cartContainer = document.getElementById('cart');
  cartContainer.innerHTML = '<h2>Cart</h2>' + cart.map(item => `
    <p>${item.name} - $${item.price.toFixed(2)}</p>
  `).join('');
}