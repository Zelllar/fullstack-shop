const container = document.getElementById("products");
const cartContainer = document.getElementById("cart");
const cartCountElement = document.getElementById("cart-count");

let products = [];

let cart = [];

function getToken() {
  return localStorage.getItem("token");
}

const currencyFormatter = new Intl.NumberFormat("ru-RU", {
  style: "currency",
  currency: "RUB"
});

async function loadProducts() {
  const response = await fetch("http://localhost:3000/api/products");

  if (!response.ok){
    console.error("Ошибка загрузки товаров");
    return;
  }

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
      "Content-Type": "application/json",
      Authorization: "Bearer " + getToken()
    },
    body: JSON.stringify({
      product_id: product.id,
    })
  });

    await loadCart();

  });

    container.appendChild(card);
  });
}

async function removeFromCart(id) {
  await fetch(`http://localhost:3000/api/cart/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + getToken()
    }
  });

  await loadCart();
}

async function clearCart() {
  await fetch("http://localhost:3000/api/cart", {
    method: "DELETE",
    headers: {
      Authorization: "Bearer " + getToken()
    }
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
      removeFromCart(item.product_id);
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
  const token = getToken();

  if (!token) {
    console.log("Пользователь не авторизован");
    return;
  }

  const response = await fetch("http://localhost:3000/api/cart", {
    headers: {
      Authorization: "Bearer " + token
    }
  });

  if (!response.ok) {
    console.error("Ошибка загрузки корзины");
    return;
  }

  const data = await response.json();

  cart = data;
  renderCart();
  updateCartCount();
}

document.getElementById("registerBtn").addEventListener("click", async () => {

  const email = document.getElementById("regEmail").value;
  const password = document.getElementById("regPassword").value;

  if (!isValidEmail(email)) {
    alert("Введите корректный email");
    return;
  }

  if (!isStrongPassword(password)) {
    alert("Пароль должен содержать минимум 8 символов, заглавную букву, цифру и спецсимвол");
    return;
  }

  const res = await fetch("http://localhost:3000/api/auth/register", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  alert("Регистрация успешна");

});

document.getElementById("loginBtn").addEventListener("click", async () => {
  const email = document.getElementById("loginEmail").value;
  const password = document.getElementById("loginPassword").value;

  const res = await fetch("http://localhost:3000/api/auth/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({ email, password })
  });

  const data = await res.json();

  if (!res.ok) {
    alert(data.error);
    return;
  }

  localStorage.setItem("token", data.token);
  updateUserStatus();
  await loadCart();

  alert("Вход выполнен");
});

document.getElementById("logoutBtn").addEventListener("click", () => {
  localStorage.removeItem("token");
  cart = [];
  renderCart();
  updateCartCount();
  updateUserStatus();
  alert("Вы вышли из аккаунта");
});

window.addEventListener("load", () => {
  updateUserStatus();
  const token = getToken();

  if (token) {
    loadCart();
  }
});

function authHeaders() {
  return {
    "Content-Type": "application/json",
    Authorization: "Bearer " + getToken()
  };
}

function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

function isStrongPassword(password) {
  return /^(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/.test(password);
}

async function updateUserStatus() {

  const status = document.getElementById("user-status");
  const authBlock = document.getElementById("auth");
  const logoutBtn = document.getElementById("logoutBtn");

  const token = getToken();

  if (!token) {
    status.textContent = "Вы не вошли в аккаунт";
    authBlock.style.display = "block";
    logoutBtn.style.display = "none";
    return;
  }

  try {

    const res = await fetch("http://localhost:3000/api/profile", {
      headers: {
        Authorization: "Bearer " + token
      }
    });

    if (!res.ok) {
      status.textContent = "Ошибка авторизации";
      authBlock.style.display = "block";
      logoutBtn.style.display = "none";
      return;
    }

    const data = await res.json();

    status.textContent = "Вы вошли как: " + data.user.email;

    authBlock.style.display = "none";
    logoutBtn.style.display = "block";

  } catch (err) {

    status.textContent = "Ошибка соединения";
    authBlock.style.display = "block";

  }

}

loadProducts();
loadCart();