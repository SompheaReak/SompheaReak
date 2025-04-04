let cart = [];

function renderProducts() {
    const productList = document.getElementById('product-list');
    productList.innerHTML = '';
    products.forEach(product => {
        const button = document.createElement('button');
        button.innerText = product.name + " - $" + product.price.toFixed(2);
        button.onclick = () => addToCart(product);
        productList.appendChild(button);
        productList.appendChild(document.createElement('br'));
    });
}

function addToCart(product) {
    cart.push(product);
    renderCart();
}

function renderCart() {
    const cartDiv = document.getElementById('cart');
    cartDiv.innerHTML = '';
    let total = 0;
    cart.forEach(item => {
        cartDiv.innerHTML += item.name + " - $" + item.price.toFixed(2) + "<br>";
        total += item.price;
    });
    cartDiv.innerHTML += "<br><strong>Total: $" + total.toFixed(2) + "</strong>";
}

function checkout() {
    if (cart.length === 0) {
        alert('Cart is empty!');
    } else {
        alert('Order Confirmed! Thank you!');
        cart = [];
        renderCart();
    }
}

window.onload = renderProducts;
