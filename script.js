const productsContainer = document.getElementById('products');
const cart = [];

products.forEach(product => {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  productDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <h3>${product.name}</h3>
    <p>Price: $${product.price.toFixed(2)}</p>
    <div class="quantity-selector">
      <button onclick="decreaseQuantity(${product.id})">-</button>
      <span id="quantity-${product.id}">1</span>
      <button onclick="increaseQuantity(${product.id})">+</button>
    </div>
    <button onclick="addToCart(${product.id})">Add to Cart</button>
  `;

  productsContainer.appendChild(productDiv);
});

function decreaseQuantity(id) {
  const quantitySpan = document.getElementById(`quantity-${id}`);
  let quantity = parseInt(quantitySpan.innerText);
  if (quantity > 1) {
    quantitySpan.innerText = quantity - 1;
  }
}

function increaseQuantity(id) {
  const quantitySpan = document.getElementById(`quantity-${id}`);
  let quantity = parseInt(quantitySpan.innerText);
  quantitySpan.innerText = quantity + 1;
}

function addToCart(id) {
  const quantity = parseInt(document.getElementById(`quantity-${id}`).innerText);
  const product = products.find(p => p.id === id);
  cart.push({ ...product, quantity });
  alert(`Added ${quantity} x ${product.name} to cart!`);
}