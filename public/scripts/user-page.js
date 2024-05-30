const oknoMod = document.querySelector("#oknoMod");
const tekstMod = document.querySelector("#tekstMod");
const oknoCloseMod = document.querySelector("#oknoCloseMod");

function edytujDane(i) {
  if (i == "1") {
    document.querySelector("#mojeDane").style.display = "block";
    document.querySelector("#mojeZamowienia").style.display = "none";
  } else if (i == "2") {
    wyswietlDaneZamowienia();
    document.querySelector("#mojeDane").style.display = "none";
    document.querySelector("#mojeZamowienia").style.display = "block";
  } else {
    sessionStorage.removeItem("token");
    window.location.href = "/";
  }
}

function zapiszZmiany() {
  let formularz = document.getElementById("mojeDane");
  if (!formularz.checkValidity()) {
    return;
  }
  const data = {
    email: document.querySelector(".email").value,
    imie: document.querySelector(".imiee").value,
    nazwisko: document.querySelector(".nazwisko").value,
  };
  const tel = document.querySelector(".nr").value;
  const dataUrodzenia = document.querySelector(".data").value;
  if (tel) data.tel = tel;
  if (dataUrodzenia) data.dataUrodzenia = dataUrodzenia;
  const haslo = document.querySelector(".haslo").value;
  const noweHaslo = document.querySelector(".noweHaslo").value;
  const noweHaslo2 = document.querySelector(".potwNoweHaslo").value;
  if (haslo) {
    const uzytkownik = {
      email: data.email,
      haslo: haslo,
    };
    fetch("/api/users/czyPoprawne", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(uzytkownik),
    })
      .then((response) => response.json())
      .then((dataa) => {
        if (dataa === true) {
          console.log("haslo poprawne");
          if (noweHaslo === "") {
            tekstMod.innerHTML = "Nowe hasło jest puste!";
            oknoMod.showModal();
          } else if (noweHaslo === noweHaslo2) {
            data.haslo = noweHaslo;
            console.log(data);
            fetch("/api/users/modyfikuj", {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify(data),
            })
              .then((response) => response.json())
              .then(data)
              .catch((error) => console.error(error));
            tekstMod.innerHTML = "Pomyślnie zmodyfikowano dane!";
            document.querySelector(".haslo").value = "";
            document.querySelector(".noweHaslo").value = "";
            document.querySelector(".potwNoweHaslo").value = "";
          } else {
            tekstMod.innerHTML = "Podane hasła różnią się!";
            console.log("podane hasla roznia sie");
          }
        } else {
          tekstMod.innerHTML = "Podano niepoprawne hasło!";
          console.log("haslo niepoprawne");
        }
      })
      .catch((error) => console.error(error));
  } else {
    fetch("/api/users/modyfikuj", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(data),
    })
      .then((response) => response.json())
      .then(data)
      .catch((error) => console.error(error));
    tekstMod.innerHTML = "Pomyślnie zmodyfikowano dane!";
  }
  oknoMod.showModal();
}
oknoCloseMod.addEventListener("click", () => {
  oknoMod.close();
});

function wyswietlDaneZamowienia() {
  const tokenObject = JSON.parse(sessionStorage.getItem("token"));
  const token = tokenObject.accessToken;

  fetch("/api/users/wyswietlZamowienie", {
    method: "GET",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  })
    .then((response) => response.json())
    .then((data) => {
      let html = "";
      let dostawa = "";
      if (data && data.length > 0) {
        data.forEach((order) => {
          switch (order.dostawa) {
            case "kurier":
              dostawa = "kurier";
              break;
            case "przesylka":
              dostawa = "przesyłka pocztowa";
              break;
            default:
              dostawa = "";
          }
          html += `
            <li>
              <div id="dane1">
                <div id="dane11">
                  <div id="nrZ">Nr ${order.nr}</div>
                  <div id="razem">${order.razem} zł</div>
                </div>
                <div id="dane12">
                  <div id="data">${order.data}</div>
                  <div id="status">
                    <img src="/zdjecia/zam.png"/>Zamówienie przyjęte
                  </div>
                </div>
              </div>
              <div id="produkty">
                ${order.produkty
                  .map(
                    (product) => `
                  <div class="produkt">
                    <img src="${product.image}" alt="${product.name}" />
                    <div class="product-details">
                      <div class="product-name">${product.name}</div>
                      <div class="product-price">${(
                        product.price / 100
                      ).toFixed(2)} zł</div>
                      <div class="product-quantity">Ilość: ${
                        product.quantity
                      }</div>
                    </div>
                  </div>
                `
                  )
                  .join("")}
              </div>
              <div id="dane2">
              <div id="szczegoly">Dane zamówienia:</div>
              <div id="poczta">Poczta: ${order.kodPocztowy} ${
            order.miasto
          } </div>
              <div id="adres">Adres: ${order.adres}</div>
              <div id="dostawa">Dostawa: ${dostawa}</div>
              <div id="platnosc">Płatność: ${order.platnosc}</div>
              </div>
            </li>`;
        });
      } else {
        html = "Brak zamówień";
      }

      document.querySelector("#wszystkieZamowienia").innerHTML = html;
    })
    .catch((error) => console.error(error));
}
