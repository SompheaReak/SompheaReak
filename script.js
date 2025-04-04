const productsContainer = document.getElementById('products');
const cart = [];

products.forEach(product => {
  const productDiv = document.createElement('div');
  productDiv.classList.add('product');

  let quantity = 1;

  productDiv.innerHTML = `
    <img src="${product.image}" alt="${product.name}" class="product-image">
    <h3 class="product-name">${product.name}</h3>
    <p class="product-price">Price: $${product.price.toFixed(2)}</p>
    <div class="quantity-control">
      <button onclick="decreaseQuantity(${product.id})">-</button>
      <span id="quantity-${product.id}" class="quantity">1</span>
      <button onclick="increaseQuantity(${product.id})">+</button>
    </div>
    <button class="add-to-cart" onclick="addToCart(${product.id})">Add to Cart</button>
  `;

  productsContainer.appendChild(productDiv);
});

function increaseQuantity(productId) {
  const quantitySpan = document.getElementById(`quantity-${productId}`);
  quantitySpan.innerText = parseInt(quantitySpan.innerText) + 1;
}

function decreaseQuantity(productId) {
  const quantitySpan = document.getElementById(`quantity-${productId}`);
  const currentQuantity = parseInt(quantitySpan.innerText);
  if (currentQuantity > 1) {
    quantitySpan.innerText = currentQuantity - 1;
  }
}

function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  const quantity = parseInt(document.getElementById(`quantity-${productId}`).innerText);
  cart.push({ ...product, quantity });
  alert(`${product.name} (x${quantity}) added to cart!`);
}