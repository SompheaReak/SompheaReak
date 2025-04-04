function increaseQuantity(id) {
  const quantitySpan = document.getElementById(`quantity-${id}`);
  let quantity = parseInt(quantitySpan.innerText);
  quantitySpan.innerText = quantity + 1;
}

function decreaseQuantity(id) {
  const quantitySpan = document.getElementById(`quantity-${id}`);
  let quantity = parseInt(quantitySpan.innerText);
  if (quantity > 1) {
    quantitySpan.innerText = quantity - 1;
  }
}