const production = true;
const BASE_URL = production ? "https://still-plateau-02291.herokuapp.com" : "http://localhost:4000"
const statusElement = document.querySelector("#status");
var user = {};

window.onload = showWelcome;

function showMessages(messages, success) {
  const messagesContainer = document.querySelector("#messages");
  messagesContainer.innerHTML = "";
  messages.forEach(message => {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message", success ? "message--info" : "message--error");
    messageElement.innerHTML = `<span>${message}</span><span class="message__closer" : "message__closer--error"}">✘</span>`;
    messagesContainer.appendChild(messageElement);
  });
  document.querySelectorAll(".message__closer").forEach(messageCloser => {
    messageCloser.onclick = function() {
      messageCloser.parentNode.parentNode.removeChild(messageCloser.parentNode);
    }
  });
}

const url = `${BASE_URL}/api/auth/validate`;
fetch(url, {credentials:'include'})
.then(response => response.json())
.then(data => {
  if(!data.success) { return; }
  user = data.user;
  showWelcome();
  showMenuUserLogged();
})
.catch(console.log)

function showWelcome() {
  const main = document.querySelector("#main");
  main.innerHTML = `
    <h2>Bienvenido ${(user && user.name)? user.name : ""}</h2>
    <p>Este sistema fue desarrollado por alumnos del primer año de la Escuela Profesional de Ingeniería de Sistemas, de la Universidad Nacional de San Agustín de Arequipa</p>
    <p>El sistema fué desarrollado usando estas tecnologías:</p>
    <ul class="technologies">
      <li>HTML, CSS y vanilla JavaScript para el FrontEnd.</li>
      <li>NodeJS para el backend a través del framework Express.</li>
      <li>MongoDB para la base de datos.</li>
      <li>El ODM Mongoose para la validación y modelado de objetos en el modelo.</li>
      <li>La comunicación entre el cliente y el servidor se hizo usando JSON de manera asíncrona.</li>
      <li>HttpOnly Cookies para el control de flujo en la autenticación.</li>
      <li>Stripe para el manejo de los pagos.</li>
      <li>Passport para el inicio de sesión con redes sociales.</li>
      <li>El despliegue del backend fue realizado en Heroku y Google Cloud.</li>
      <li>El despliegue del frontend fue realizado en Vercel.</li>
    </ul>
  `;
}

function showMenuUserLogged() {
  const menu = document.querySelector("#menu");
  menu.innerHTML = `
    <p class="navbar__link" onclick="showWelcome()">Home</p>
    <p class="navbar__link" onclick="showProducts()">Products</p>
    <p class="navbar__link" onclick="showCart()">My Cart</p>
    <p class="navbar__link" onclick="showPaymentForm()">Pay</p>
    <p class="navbar__link navbar__link--danger" onclick="doLogOut()">LogOut</p>
  `;
}

function showLogin() {
  const main = document.querySelector("#main");
  main.innerHTML = `
    <h3>Login</h3>
    <div>
      <a href="https://still-plateau-02291.herokuapp.com/api/auth/google">Google</a>
      <a href="https://still-plateau-02291.herokuapp.com/api/auth/facebook">Facebook</a>
      <a href="https://still-plateau-02291.herokuapp.com/api/auth/twitter">Twitter</a>
      <a href="https://still-plateau-02291.herokuapp.com/api/auth/github">GitHub</a>
    </div>
    <div class="login-form">
      <input type="email" id="email" placeholder="Email">
      <input type="password" id="password" placeholder="Password">
      <button onclick="doLogin()">Login</button>
    </divid=>
  `;
}

function doLogin() {
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const url = `${BASE_URL}/api/auth/login`;
  const credentials = {email, password};
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(credentials),
    credentials: 'include'
  };

  fetch(url, request)
  .then(response => response.json())
  .then(data => {
    if(!data.success) {
      return showMessages(data.errors, data.success);
    }
    user = data.user;

    showMenuUserLogged();
    showWelcome();
  })
  .catch(console.log)
}

function showSignUp() {
  const main = document.querySelector("#main");
  main.innerHTML = `
    <h3>SignUp</h3>
    <div>
      <a href="https://still-plateau-02291.herokuapp.com/api/auth/google">Google</a>
      <a href="https://still-plateau-02291.herokuapp.com/api/auth/facebook">Facebook</a>
      <a href="https://still-plateau-02291.herokuapp.com/api/auth/twitter">Twitter</a>
      <a href="https://still-plateau-02291.herokuapp.com/api/auth/github">GitHub</a>
    </div>
    <div class="signup-form">
      <input type="text" id="name" placeholder="Name">
      <input type="email" id="email" placeholder="Email">
      <input type="password" id="password" placeholder="Password">
      <button onclick="doSignUp()">SignUp</button>
    </div>
  `;
}

function doSignUp() {
  const name = document.querySelector("#name").value;
  const email = document.querySelector("#email").value;
  const password = document.querySelector("#password").value;

  const url = `${BASE_URL}/api/auth/signup`;
  const data = {name, email, password};
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    credentials: 'include'
  }

  fetch(url, request)
  .then(response => response.json())
  .then(data => {
    if(!data.success) { return showMessages(data.errors.map(error => error.message), data.success); }
    user = data.user;

    showMenuUserLogged();
    showWelcome();
  })
  .catch(console.log)
}

function doLogOut() {
  const url = `${BASE_URL}/api/auth/logout`;
  fetch(url, {credentials: 'include'})
  .then(response => response.json())
  .then(data => {
    if(!data.success) { return; }
    user = {};
    showWelcome();
    const menu = document.querySelector("#menu");
    menu.innerHTML = `
      <p class="navbar__link" onclick="showWelcome()">Home</p>
      <p class="navbar__link" onclick="showLogin()">Login</p>
      <p class="navbar__link" onclick="showSignUp()">SignUp</p>
    `;
  })
  .catch(console.log)
}

function showProducts(limit = 4, page = 1) {
  const url = `${BASE_URL}/api/products?limit=${limit}&page=${page}`;
  fetch(url, {credentials: 'include'})
  .then(response => response.json())
  .then(data => {
    const products = data.data;
    let productsComponent = "";
    products.forEach(product => {
      productsComponent += `
        <article class="product">
          <div class="product__img-container">
            <img class="product__img" src="${product.images[0]}" onclick="showProductDetails('${product._id}')">
          </div>
          <div class="product__details">
            <h4 class="product__name" onclick="showProductDetails('${product._id}')">${product.name}</h4>
            <div class="product__prizing">
              <strong class="product__price">$${product.price}</strong>
              ${product.offer?"<span class='product__offer'>Special Offer</span>":""}
            </div>
          </div>
        </article>
      `;
    });
    let btnPrevComponent = "<span>✘</span>";
    if(data.prevPage) {
      btnPrevComponent = `<button class='btnPrev' onclick='showProducts(${limit}, ${page - 1})'>Prev</button>`;
    }
    let btnNextComponent = "<span>✘</span>";
    if(data.nextPage) {
      btnNextComponent = `<button class='btnNext' onclick='showProducts(${limit}, ${page + 1})'>Next</button>`;
    }
    const main = document.querySelector("#main");
    main.innerHTML = `
      <h2 class="products__title">Products</h2>
      <section class="products">${productsComponent}</section>
      <div class="btnsPrevNext">
        ${btnPrevComponent}
        ${btnNextComponent}
      </div>
    `;
  })
  .catch(console.log)
}

function showProductDetails(idProduct) {
  fetch(`${BASE_URL}/api/products/${idProduct}`, {credentials:"include"})
  .then(response => response.json())
  .then(product => {
    let categoriesComponent = "";
    product.categories?.forEach(categorie => {
      categoriesComponent += `
        <span class="d-product__categorie">${categorie}</span>
      `;
    });
    let imagesComponent = "";
    product.images?.forEach(image => {
      imagesComponent += `
        <img class="d-product__image" src="${image}">
      `;
    });
    document.querySelector("#main").innerHTML = `
      <article class="d-product">
        <h3 class="d-product__name">${product.name}</h3>
        <p class="d-product__description">${product.description}</p>
        <div class="d-product__details">
          <p><b>Brand: </b>${product.brand}</p>
          <p><b>Price: </b>$${product.price}</p>
          <p><b>Stock: </b>${product.stock}</p>
          <div>
            ${product.magnetic?"<span class='d-product__magnetic'>Magnetic</span>":""}
            ${product.offer?"<span class='d-product__offer'>Special Offer</span>":""}
          </div>
        </div>
        <div class="d-product__categories">${categoriesComponent}</div>
        <div class="d-product__images">${imagesComponent}</div>
        <div class="d-product__amount-details">
          <button class="d-product__btn-minus" onclick="reduceOne()">-</button>
          <input type="number" class="d-product__amount" id="amount" value=1>
          <button class="d-product__btn-plus" onclick="addOne()">+</button>
        </div>
        <div class="d-product__add-container">
          <span class="d-product__add" onclick="addToCart('${product._id}')">Add to Cart</span>
        </div>
      </article>
    `;
  })
  .catch(console.log)
}

function reduceOne() {
  const amountElement = document.querySelector("#amount");
  const amount = parseInt(amountElement.value);
  if(amount === 1) { return; }
  amountElement.value = amount - 1;
}
function addOne() {
  const amountElement = document.querySelector("#amount");
  const amount = parseInt(amountElement.value);
  amountElement.value = amount + 1;
}

function addToCart(idProduct) {
  const amount = parseInt(document.querySelector("#amount").value);
  const data = { idProduct, amount };
  const url = `${BASE_URL}/api/cart/add`;
  const request = {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify(data),
    credentials: "include"
  };

  fetch(url, request)
  .then(response => response.json())
  .then(() => {showCart()})
  .catch(console.log)
}

function showCart() {
  const url = `${BASE_URL}/api/cart`;
  fetch(url, {credentials:'include'})
  .then(response => response.json())
  .then(cart => {
    let cartItemsComponent = "";

    const { items:cartItems } = cart;
    cartItems.forEach(cartItem => {
      const { product } = cartItem;
      cartItemsComponent += `
        <article class="cart-item">
          <h4 class="cart-item__name" onclick="showProductDetails('${product._id}')">${product.name}<h4>
          <div class="cart-item__details">
            <p>${cartItem.amount}x</p>
            <div class="cart-item__prizing">
              <strong class="cart-item__price">$${product.price}</strong>
              <p class="cart-item__closer" class="cart" onclick="removeFromCart('${product._id}')">✘</p>
            </div>
          </div>
        </article>
      `;
    });

    const main = document.querySelector("#main");
    main.innerHTML = `
      <h2 class="cart-items__title">My Cart</h2>
      <section class="cart-items">${cartItemsComponent}</section>
    `;
  })
  .catch(console.log)
}

function removeFromCart(idProduct) {
  const url = `${BASE_URL}/api/cart/remove`;
  const request = {
    method: "DELETE",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({idProduct}),
    credentials: 'include'
  };

  fetch(url, request)
  .then(response => response.json())
  .then(() => {
    showCart();
    showMessages(["Product removed from cart successfully"], true);
  })
  .catch(console.log)
}

const stripe = Stripe("pk_test_51L9NxJD28vZl8nCxjym2k2xlkLTvH1iaRCihO9Hi1VWCS9cmrduJ3nHcUUFykQbvYSLWxmm446GlKndddE8vI0im00GxOSBXFi");

let elements;

const initialize = async () => {
  const response = await fetch(`${BASE_URL}/api/cart/pay`, {
    credentials: 'include'
  });

  const {clientSecret} = await response.json();
  const appereance = {
    theme: 'stripe'
  };

  elements = stripe.elements({ appereance, clientSecret });

  const paymentElement = elements.create("payment");
  paymentElement.mount("#payment-element");
}

async function showPaymentForm() {
  const response = await fetch(`${BASE_URL}/api/cart`, {credentials:'include'});
  const cart = await response.json();
  if(cart?.items.length === 0) {
    showMessages(["Doesn't have any product in cart"], false);
    return;
  }

  const main = document.querySelector("#main");
  main.innerHTML = `
    <!-- Display a payment form -->
    <form id="payment-form">
      <div id="payment-element">
          <!--Stripe.js injects the Payment Element-->
      </div>
      <button class="btnPay">Pay</button>
    </form>
  `;
  await initialize();
  const form = document.querySelector("#payment-form");
  form.onsubmit = async evt => {
    evt.preventDefault();

    const result = await stripe.confirmPayment({
      elements,
      redirect: 'if_required'
    })
    if(result.paymentIntent?.status === "succeeded") {
      fetch(`${BASE_URL}/api/cart/paymentCompleted`, {
        method: "POST",
        credentials: 'include'
      })
      .then(response => response.json())
      .then(() => {
        showMessages(["Payment made successfully"], true);
        showCart();
      })
      .catch(console.log)
    }

    console.log(result);
  }
}