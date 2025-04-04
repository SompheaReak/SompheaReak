const productsContainer = document.getElementById('products');
const cartContainer = document.getElementById('cart');
const cart = [];

function displayProducts(productsToDisplay) {
  productsContainer.innerHTML = '';

  productsToDisplay.forEach(product => {
    const productDiv = document.createElement('div');
    productDiv.classList.add('product');

    productDiv.innerHTML = `
      <img src="${product.image}" alt="${product.name}" class="product-image">
      <h3>${product.name}</h3>
      <p>Price: $${product.price.toFixed(2)}</p>
      <button onclick="addToCart(${product.id})">Add to Cart</button>
    `;
    productsContainer.appendChild(productDiv);
  });
}

// Filter products by category
function filterCategory(category) {
  if (category === 'All') {
    displayProducts(products);
  } else {
    const filteredProducts = products.filter(product => product.category === category);
    displayProducts(filteredProducts);
  }
}

// Add product to cart
function addToCart(productId) {
  const product = products.find(p => p.id === productId);
  cart.push(product);
  updateCart();
}

// Update cart display
function updateCart() {
  cartContainer.innerHTML = '';
  cart.forEach(item => {
    const li = document.createElement('li');
    li.textContent = `${item.name} - $${item.price.toFixed(2)}`;
    cartContainer.appendChild(li);
  });
}

// Checkout function
function checkout() {
  alert("Thank you for your purchase!");
  cart.length = 0;
  updateCart();
}

// Initial display
displayProducts(products);