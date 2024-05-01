const oknoLog = document.querySelector("#oknoLog");
const tekstLog = document.querySelector("#tekstLog");
const oknoCloseLog = document.querySelector("#oknoCloseLog");

function zaloguj() {
  console.log("wcisnieto przycisk");
  const data = {
    email: document.querySelector(".emailLog").value,
    haslo: document.querySelector(".hasloLog").value,
  };
  console.log("po stronie uzytkownika: " + data);
  fetch("/api/logowanie", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (data === false) {
        tekstLog.innerHTML = "Podano błędny login lub hasło";
      } else {
        tekstLog.innerHTML = "Zalogowano!";
        document.querySelector(".emailLog").value = "";
        document.querySelector(".hasloLog").value = "";
      }
      oknoLog.showModal();
    })
    .catch((error) => console.error(error));
}
oknoCloseLog.addEventListener("click", () => {
  oknoLog.close();
});
