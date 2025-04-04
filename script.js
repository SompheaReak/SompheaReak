function filterCategory(category) {
  const productsContainer = document.getElementById('products');
  productsContainer.innerHTML = '';

  let filteredProducts = products;
  if (category !== 'All') {
    filteredProducts = products.filter(product => product.category === category);
  }

  filteredProducts.forEach(product => {
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