const SITE_TITLE = "GooDreamShop";
const CART = JSON.parse(localStorage.getItem("cart")) || [];
const searchInput = document.querySelector("#search");
const productsSection = document.querySelector("#products");
const sortButtons = document.querySelector("#sort_buttons");

let query = "";
let sort = "name";

const sorting_types = {
  name: (a, b) => a.name.localeCompare(b.name),
  priceASC: (a, b) => a.price - b.price,
  priceDESC: (a, b) => b.price - a.price,
  rating: (a, b) => b.rating - a.rating,
};

let PRODUCTS_LIST = [];

const updateCart = () => {
  const sum = CART.reduce((a, b) => a + b.price, 0);
  document.querySelector("#cart_counter").textContent = `${sum}$`;
  window.localStorage.setItem("cart", JSON.stringify(CART));
};

const renderProducts = (array) => {
  while (productsSection.lastElementChild) {
    productsSection.removeChild(productsSection.lastElementChild);
  }

  array
    .sort(sorting_types[sort])
    .filter(({ name }) => name.toLowerCase().includes(query))
    .forEach(({ img, name, rating, description, price }) => {
      let newProduct = `
        <li class="item">
          <img src="${img}" alt="" class="item__img">
          <h3 class="item__name">${name}</h3>
          <div class="item__rating">
      `;

      for (let i = 1; i <= 5; i++)
        newProduct += `<img src="./assets/star${rating < i ? "_border" : ""}.svg" alt="">`;

      newProduct += `
          </div>
          <p class="item__description">${description}</p>
          <div class="row">
              <span class="item__price">${price}$</span>
              <button type="button" class="item__button">Add to cart</button>
          </div>
        </li>
      `;

      productsSection.innerHTML += newProduct;
    });
};

(() => {
  document.querySelector("#site_title").textContent = SITE_TITLE;
  document.title = SITE_TITLE;

  fetch("products.json")
    .then((response) => response.json())
    .then((json) => {
      PRODUCTS_LIST = json;
      renderProducts(PRODUCTS_LIST);

      productsSection.addEventListener("click", (e) => {
        if (e.target.tagName === "BUTTON") {
          const buttons = [...document.querySelectorAll(".item__button")];
          const elementIndex = buttons.indexOf(e.target);

          CART.push(PRODUCTS_LIST[elementIndex]);
          updateCart();
        }
      });
    });

  updateCart();

  searchInput.addEventListener("keyup", (e) => {
    query = e.target.value.trim().toLowerCase();
    renderProducts(PRODUCTS_LIST);
  });

  sortButtons.addEventListener("click", (e) => {
    if (e.target.tagName === "BUTTON") {
      const buttons = [...document.querySelectorAll(".sort__button")];
      const elementIndex = buttons.indexOf(e.target);

      sort = buttons[elementIndex].getAttribute("data-sortType");

      document.querySelector(".sort__button--active").classList.remove("sort__button--active");
      buttons[elementIndex].classList.toggle("sort__button--active");
      renderProducts(PRODUCTS_LIST);
    }
  });
})();
