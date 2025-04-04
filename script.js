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