fetch("/api/products", { method: "GET" })
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

let productsHtml = "";
function makeArray(products) {
  productsHtml = "";
  products.forEach((product) => {
    productsHtml += makeHtml(product);
    arrayOfProducts.push(product);
  });
  document.querySelector(".products").innerHTML = productsHtml;
}

const oknoDodano = document.querySelector("#oknoDodano");
const tekstDodano = document.querySelector("#tekstDodano");
const oknoCloseDodano = document.querySelector("#oknoCloseDodano");
const oknoCloseDoKoszyka = document.querySelector("#oknoCloseDoKoszyka");

function dodajDoKoszyka(id) {
  let shoppingCard = [];
  if (sessionStorage.getItem("jsonCard")) {
    shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
  }
  let obj;
  const wKoszyku = shoppingCard.find((item) => item.id === id);
  if (wKoszyku) {
    wKoszyku.quantity++;
    tekstDodano.innerHTML = wKoszyku.name;
  } else {
    arrayOfProducts.forEach((product) => {
      if (product.id === id) {
        obj = {
          ...product,
          quantity: 1,
        };
        shoppingCard.push(obj);
        tekstDodano.innerHTML = product.name;
      }
    });
  }
  sessionStorage.setItem("jsonCard", JSON.stringify(shoppingCard));
  oknoDodano.showModal();
}
function dodaj(id) {
  let shoppingCard = [];
  if (sessionStorage.getItem("jsonCard")) {
    shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
  }
  let obj;
  const wKoszyku = shoppingCard.find((item) => item.id === id);
  if (wKoszyku) {
    wKoszyku.quantity++;
  } else {
    console.log("nie znaleziono");
  }
  sessionStorage.setItem("jsonCard", JSON.stringify(shoppingCard));
  openKoszyk();
}
function openKoszyk() {
  let shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
  productsHtml = "";
  let suma = 0;
  if (shoppingCard && shoppingCard.length > 0) {
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
                </div>
                <button class="przycisk" onclick="usun(${
                  product.id
                })">--</button>
                <button class="przycisk" onclick="dodaj(${
                  product.id
                })">+</button>
                <button class="przycisk" onclick="usunWszystkie(${
                  product.id
                })">USUŃ</button>
                </li>`;
      suma += product.quantity * product.price;
    });
  } else {
    productsHtml = `<br>Brak produktów`;
  }
  document.querySelector("#wartosc").innerHTML =
    (suma / 100).toFixed(2) + " zł";
  document.querySelector(".koszyk-produkty").innerHTML = productsHtml;
  if (sessionStorage.getItem("token")) {
    const tokenObject = JSON.parse(sessionStorage.getItem("token"));
    const token = tokenObject.accessToken;
    fetch("/api/users/dane", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then((response) => response.json())
      .then((data) => {
        dane = data;
        document.querySelector(".email").value = dane[0].email;
        document.querySelector(".email").readOnly = true;
      })
      .catch((error) => console.error(error));
  } else {
    document.querySelector(".email").readOnly = false;
  }
  aktualizujPodsumowanie();
}
let koszyk = document.getElementById("koszyk");
koszyk.addEventListener("click", () => {
  sessionStorage.setItem("openKoszyk", "true");
  window.location.href = "/koszyk";
});

document
  .querySelector(".dostawa")
  .addEventListener("change", aktualizujPodsumowanie);

function aktualizujPodsumowanie() {
  const dostawaElement = document.querySelector(".dostawa");
  const dostawa = document.querySelector("#dostawa");
  const razemElement = document.getElementById("razem");
  let kosztDostawy = 0;
  let suma = 0;
  if (sessionStorage.getItem("jsonCard")) {
    let shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
    shoppingCard.forEach((product) => {
      suma += product.quantity * product.price;
    });
  }
  let wartoscKoszyka = suma / 100 || 0;
  switch (dostawaElement.value) {
    case "kurier":
      kosztDostawy = 16.99;
      break;
    case "przesylka":
      kosztDostawy = 11.99;
      break;
    default:
      kosztDostawy = 0;
  }
  let razem = wartoscKoszyka + kosztDostawy || 0;
  razemElement.innerHTML = `${razem.toFixed(2)} zł`;
  dostawa.innerHTML = `${kosztDostawy} zł`;
}

function usunWszystkie(id) {
  let shoppingCard = [];
  if (sessionStorage.getItem("jsonCard")) {
    shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
  }
  shoppingCard = shoppingCard.filter((item) => item.id !== id);
  sessionStorage.setItem("jsonCard", JSON.stringify(shoppingCard));
  openKoszyk();
}
function usun(id) {
  let shoppingCard = [];
  if (sessionStorage.getItem("jsonCard")) {
    shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
  }
  const itemIndex = shoppingCard.findIndex((item) => item.id === id);
  if (itemIndex > -1) {
    if (shoppingCard[itemIndex].quantity > 1) {
      shoppingCard[itemIndex].quantity--;
    } else {
      shoppingCard.splice(itemIndex, 1);
    }
  } else {
    console.log("Nie znaleziono");
  }
  sessionStorage.setItem("jsonCard", JSON.stringify(shoppingCard));
  openKoszyk();
}
function szukaj(cat) {
  let tekst = document.querySelector(`a[onclick="szukaj('${cat}')"`).innerText;
  productsHtml = "";
  if (
    window.location.pathname.endsWith("/koszyk") ||
    window.location.pathname.endsWith("/user-page")
  ) {
    sessionStorage.setItem("szukaj", "true");
    sessionStorage.setItem("cat", cat);
    sessionStorage.setItem(
      "tekst",
      document.querySelector(`a[onclick="szukaj('${cat}')"`).textContent
    );
    window.location.href = "/";
  } else if (sessionStorage.getItem("tekst")) {
    tekst = sessionStorage.getItem("tekst");
    sessionStorage.removeItem("tekst");
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
  scrollToSection("container");
  if (sessionStorage.getItem("szukaj") == "true") {
    let cat = sessionStorage.getItem("cat");
    szukaj(cat);
    sessionStorage.removeItem("szukaj");
    sessionStorage.removeItem("cat");
  }
  if (sessionStorage.getItem("openKoszyk") == "true") {
    setTimeout(openKoszyk, 300);
    sessionStorage.removeItem("openKoszyk");
  }
  if (window.location.pathname.endsWith("/koszyk")) {
    openKoszyk();
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
