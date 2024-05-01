fetch("/api/products", { method: "GET" })
  .then((response) => response.json())
  .then((data) => {
    makeArray(data);
    //console.log(data);
  })
  .catch((error) => console.error(error));

const arrayOfProducts = [];

function makeHtml(product) {
  return `<div class="product-container">
                    <div class="product-image">
                          <img class="image" src="${product.image}">
                    </div>
                    <div class="product-name">
                          ${product.name}
                    </div>
                    <div class="product-stars">
                          <img class="image-stars" src="${product.ratingStars}">
                          (${product.rating})
                    </div>
                    <div class="product-price">
                          ${(product.price / 100).toFixed(2)} zł
                    </div>
                    <input type="submit" value="DO KOSZYKA" class="przycisk" onclick="dodajDoKoszyka(${
                      product.id
                    })"><br>
                </div>`;
}

let productsHtml = "";
function makeArray(products) {
  productsHtml = "";
  products.forEach((product) => {
    productsHtml += makeHtml(product);
    arrayOfProducts.push(product);
  });
  document.querySelector(".products").innerHTML = productsHtml;
}

function dodajDoKoszyka(id) {
  let shoppingCard = [];
  if (sessionStorage.getItem("jsonCard")) {
    shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
  }
  let obj;
  const wKoszyku = shoppingCard.find((item) => item.id === id);
  if (wKoszyku) {
    wKoszyku.quantity++;
  } else {
    arrayOfProducts.forEach((product) => {
      if (product.id === id) {
        obj = {
          ...product,
          quantity: 1,
        };
        shoppingCard.push(obj);
      }
    });
  }
  sessionStorage.setItem("jsonCard", JSON.stringify(shoppingCard));
  //console.log(sessionStorage.getItem("jsonCard"));
}

function openKoszyk() {
  let shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
  productsHtml = "";
  shoppingCard.forEach((product) => {
    productsHtml += `<li><div class="product-container">
                    <div class="product-image">
                          <img class="image" src="${product.image}">
                    </div>
                    <div class="product-name">
                          ${product.name}
                    </div>
                    <div class="product-price">
                          ${(product.price / 100).toFixed(2)} zł
                    </div>
                    <div class="quantity">
                          ilość: ${product.quantity}
                    </div>
                </div></li>`;
  });
  document.querySelector(".koszyk-produkty").innerHTML = productsHtml;
}
let koszyk = document.getElementById("koszyk");
koszyk.addEventListener("click", () => {
  sessionStorage.setItem("openKoszyk", "true");
  window.location.href = "/koszyk";
});

function szukaj(cat) {
  let tekst = "";
  productsHtml = "";
  if (window.location.pathname.endsWith("/koszyk")) {
    sessionStorage.setItem("szukaj", "true");
    sessionStorage.setItem("cat", cat);
    sessionStorage.setItem(
      "tekst",
      document.querySelector(`a[onclick="szukaj('${cat}')"`).textContent
    );
    window.location.href = "/";
  } else if (!sessionStorage.getItem("tekst")) {
    tekst = sessionStorage.getItem("tekst");
    sessionStorage.removeItem("tekst");
  } else {
    tekst = document.querySelector(`a[onclick="szukaj('${cat}')"`).textContent;
  }
  arrayOfProducts.forEach((product) => {
    if (cat == product.category || cat == product.subcategory) {
      productsHtml += makeHtml(product);
    }
  });
  document.querySelector(".tresc").innerHTML =
    `<div class="wyniki-wyszukiwania">${tekst}</div><div class="products">` +
    productsHtml +
    `</div>`;
}
window.onload = function () {
  if (sessionStorage.getItem("szukaj") == "true") {
    let cat = sessionStorage.getItem("cat");
    setTimeout(szukaj, 300, cat);
    sessionStorage.removeItem("szukaj");
    sessionStorage.removeItem("cat");
  }
  if (sessionStorage.getItem("openKoszyk") === "true") {
    setTimeout(openKoszyk, 1000);
    sessionStorage.removeItem("openKoszyk");
  }
};
function search() {
  productsHtml = "";
  let inputSearch = document.querySelector(".search-input").value;
  arrayOfProducts.forEach((product) => {
    if (product.name.includes(inputSearch)) {
      productsHtml += makeHtml(product);
    }
  });
  document.querySelector(".tresc").innerHTML =
    `<div class="wyniki-wyszukiwania">Wyniki dla: ${inputSearch}</div><div class="products">` +
    productsHtml +
    `</div>`;
}

document.querySelector(".search-input").addEventListener("keydown", (event) => {
  if (event.key === "Enter") {
    search();
  }
});
