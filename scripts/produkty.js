fetch("../data/products.json")
  .then((response) => response.json())
  .then((data) => {
    makeArray(data);
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
function makeArray(products) {
  let productsHtml = "";
  products.forEach((product) => {
    productsHtml += makeHtml(product);
    arrayOfProducts.push(product);
  });
  document.querySelector(".products").innerHTML = productsHtml;
}

let shoppingCard = [];
function dodajDoKoszyka(id) {
  arrayOfProducts.forEach((product) => {
    if (product.id === id) shoppingCard.push(product);
  });
  console.log(shoppingCard);
}

let productsHtml = "";
function szukaj(cat) {
  let tekst = "";
  productsHtml = "";
  if (window.location.pathname.endsWith("koszyk.html")) {
    sessionStorage.setItem("szukaj", "true");
    sessionStorage.setItem("cat", cat);
    sessionStorage.setItem(
      "tekst",
      document.querySelector(`a[onclick="szukaj('${cat}')"`).textContent
    );
    window.location.replace("index.html");
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
};

function search() {
  productsHtml = "";
  const inputSearch = document.querySelector(".search-input").value;
  arrayOfProducts.forEach((product) => {
    if (product.name.includes(inputSearch)) {
      productsHtml += makeHtml(product);
    }
  });
  console.log(inputSearch);
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
