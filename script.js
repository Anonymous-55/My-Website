
document.addEventListener("DOMContentLoaded", async () => {
    try {
        console.log("Fetching products.json...");
        const response = await fetch("products.json");
        const products = await response.json();
        console.log("Products loaded:", products);

        const productContainer = document.getElementById("product-list");
        if (!productContainer) {
            console.error("Error: Product container not found!");
            return;
        }
        
        productContainer.innerHTML = "";

        products.forEach(product => {
            console.log("Adding product:", product.name);
            const productCard = document.createElement("div");
            productCard.classList.add("product-card");

            productCard.innerHTML = `
                <img src="${product.image}" alt="${product.name}" class="product-image">
                <h3>${product.name}</h3>
                <p>${product.description}</p>
                <p>Price: $${product.price}</p>
                <button onclick="addToCart('${product.id}', '${product.name}', ${product.price})">Add to Cart</button>
            `;

            productContainer.appendChild(productCard);
        });

        updateCartCount();

    } catch (error) {
        console.error("Error loading products:", error);
    }
});

function addToCart(id, name, price) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProduct = cart.find(item => item.id === id);

    if (existingProduct) {
        existingProduct.quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    alert("Added to cart!");
}

function updateCartCount() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    let totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById("cart-count").textContent = totalItems;
}

// Ensure cart count is updated on every page load
document.addEventListener("DOMContentLoaded", updateCartCount);


document.addEventListener("DOMContentLoaded", () => {
    if (document.getElementById("cart-items")) {
        loadCart();
    }
});

function loadCart() {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const cartContainer = document.getElementById("cart-items");
    const totalPriceContainer = document.getElementById("total-price");

    cartContainer.innerHTML = "";

    if (cart.length === 0) {
        cartContainer.innerHTML = "<p>Your cart is empty.</p>";
        totalPriceContainer.textContent = "Total: $0.00";
        return;
    }

    let totalPrice = 0;

    cart.forEach((item, index) => {
        const cartItem = document.createElement("div");
        cartItem.classList.add("cart-item");
        cartItem.innerHTML = `
            <h4>${item.name}</h4>
            <p>Price: $${item.price}</p>
            <p>Quantity: <button onclick="changeQuantity(${index}, -1)">-</button> ${item.quantity} <button onclick="changeQuantity(${index}, 1)">+</button></p>
            <button onclick="removeFromCart(${index})">Remove</button>
        `;
        cartContainer.appendChild(cartItem);
        totalPrice += item.price * item.quantity;
    });

    totalPriceContainer.textContent = `Total: $${totalPrice.toFixed(2)}`;
}

function changeQuantity(index, change) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    if (cart[index]) {
        cart[index].quantity += change;
        if (cart[index].quantity <= 0) {
            cart.splice(index, 1);
        }
    }
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCart();
}

function removeFromCart(index) {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    cart.splice(index, 1);
    localStorage.setItem("cart", JSON.stringify(cart));
    updateCartCount();
    loadCart();
}
