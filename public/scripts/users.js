const okno = document.querySelector("#okno");
const tekst = document.querySelector("#tekst");
const oknoClose = document.querySelector("#oknoClose");

function zarejestruj() {
  let formularz = document.getElementById("zalozKonto");
  if (!formularz.checkValidity()) {
    return;
  }
  console.log("wcisnieto przycisk");

  const data = {
    email: document.querySelector(".email").value,
    haslo: document.querySelector(".haslo").value,
    imie: document.querySelector(".imie").value,
    nazwisko: document.querySelector(".nazwisko").value,
  };
  const tel = document.querySelector(".tel").value;
  const dataUrodzenia = document.querySelector(".dataUrodzenia").value;
  if (tel) data.tel = tel;
  if (dataUrodzenia) data.dataUrodzenia = dataUrodzenia;

  console.log("po stronie uzytkownika: " + data);
  fetch("/api/users", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data === true) {
        tekst.innerHTML = "Podany email jest już używany";
      } else tekst.innerHTML = "Założono konto!";
      okno.showModal();
    })
    .catch((error) => console.error(error));
}

oknoClose.addEventListener("click", () => {
  okno.close();
  if (tekst.innerHTML === "Założono konto!") window.location.href = "/";
});
