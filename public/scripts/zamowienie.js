const oknoZam = document.querySelector("#oknoZam");
const tekstZam = document.querySelector("#tekstZam");
const oknoCloseZam = document.querySelector("#oknoCloseZam");

function zlozZamowienie() {
  let formularz = document.getElementById("dane");
  if (!formularz.checkValidity()) {
    return;
  }

  console.log("wcisnieto przycisk");
  let shoppingCard = JSON.parse(sessionStorage.getItem("jsonCard"));
  const daneZamowienia = {
    kodPocztowy: document.querySelector(".kodPocztowy").value,
    miasto: document.querySelector(".miasto").value,
    adres: document.querySelector(".adres").value,
    platnosc: document.querySelector('input[name="platnosc"]:checked').value,
    dostawa: document.querySelector(".dostawa").value,
    email: document.querySelector(".email").value,
  };
  let kosztDostawy = 0;
  let suma = 0;
  shoppingCard.forEach((product) => {
    suma += product.quantity * product.price;
  });
  let wartoscKoszyka = suma / 100 || 0;
  daneZamowienia.wartoscKoszyka = wartoscKoszyka;
  switch (daneZamowienia.dostawa) {
    case "kurier":
      kosztDostawy = 16.99;
      break;
    case "przesylka":
      kosztDostawy = 11.99;
      break;
    default:
      kosztDostawy = 0;
  }
  daneZamowienia.razem = (wartoscKoszyka + kosztDostawy).toFixed(2) || 0;
  const teraz = new Date();
  const rok = teraz.getFullYear();
  const miesiac = String(teraz.getMonth() + 1).padStart(2, "0");
  const dzien = String(teraz.getDate()).padStart(2, "0");
  const godzina = String(teraz.getHours()).padStart(2, "0");
  const minuta = String(teraz.getMinutes()).padStart(2, "0");
  const sekunda = String(teraz.getSeconds()).padStart(2, "0");
  daneZamowienia.data =
    dzien +
    "-" +
    miesiac +
    "-" +
    rok +
    " " +
    godzina +
    ":" +
    minuta +
    ":" +
    sekunda;
  daneZamowienia.produkty = shoppingCard;
  console.log(daneZamowienia);
  console.log(typeof shoppingCard);
  tekstZam.innerHTML = "Złożono zamówienie!";
  oknoZam.showModal();

  fetch("/api/zamowienia", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(daneZamowienia),
  })
    .then()
    .catch((error) => console.error(error));
  oknoZam.showModal();
}

oknoCloseZam.addEventListener("click", () => {
  oknoZam.close();
  document.getElementById("dane").reset();
  sessionStorage.removeItem("jsonCard");
  location.reload();
});
