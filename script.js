const productDiv = document.createElement('div');
productDiv.innerHTML = `
  <img src="${product.image}" alt="${product.name}" width="100" height="100">
  <h3>${product.name}</h3>
  <p>$${product.price.toFixed(2)}</p>
  <button onclick="addToCart(${product.id})">Add to Cart</button>
`;
productsContainer.appendChild(productDiv);