const container = document.getElementById("products");
const cartContainer = document.getElementById("cart");
const cartCountElement = document.getElementById("cart-count");

let products = [];

let cart = [];

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB"
});

async function loadProducts() {
  const response = await fetch("http://localhost:3000/api/products");
  const data = await response.json();

  products = data;
  renderProducts();
}

function renderProducts() {
  container.innerHTML = "";

  products.forEach(product => {
    const card = document.createElement("div");
    card.classList.add("card");

    card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" class="card__image">
        <h3>${product.title}</h3>
        <p class="card__price">${product.price} ₽</p>
        <button class="add-btn">Добавить в корзину</button>
    `;

    const button = card.querySelector(".add-btn");

  button.addEventListener("click", async () => {

    await fetch("http://localhost:3000/api/cart", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        productId: product.id
      })
    });

    await loadCart();

  });

    container.appendChild(card);
  });
}

async function removeFromCart(id) {
  await fetch(`http://localhost:3000/api/cart/${id}`, {
    method: "DELETE"
  });

  await loadCart();
}

async function clearCart() {
  await fetch("http://localhost:3000/api/cart", {
    method: "DELETE"
  });

  await loadCart();
}

function renderCart() {
  cartContainer.innerHTML = "";

  let total = 0;

  cart.forEach(item => {
    const div = document.createElement("div");

    const itemTotal = item.price * item.quantity;
    total += itemTotal;

    div.innerHTML = `
      ${item.title} — ${item.quantity} шт — ${currencyFormatter.format(itemTotal)}
      <button class="remove-btn">Удалить</button>
    `;

    const removeButton = div.querySelector(".remove-btn");

    removeButton.addEventListener("click", () => {
      removeFromCart(item.id);
    });

    cartContainer.appendChild(div);
  });

  const totalDiv = document.createElement("div");
  totalDiv.style.marginTop = "10px";
  totalDiv.style.fontWeight = "bold";
  totalDiv.textContent = "Итого: " + currencyFormatter.format(total);

  const clearButton = document.createElement("button");
  clearButton.textContent = "Очистить корзину";
  clearButton.style.marginTop = "10px";

  clearButton.addEventListener("click", clearCart);

  cartContainer.appendChild(totalDiv);
  cartContainer.appendChild(clearButton);
}

function updateCartCount() {
  const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  cartCountElement.textContent = totalCount;
}

async function loadCart() {
  const response = await fetch("http://localhost:3000/api/cart");
  const data = await response.json();

  cart = data;
  renderCart();
  updateCartCount();
}

loadProducts();
loadCart();
renderCart();
updateCartCount();