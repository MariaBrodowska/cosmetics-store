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
  fetch("/api/users/login", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify(data),
  })
    .then((response) => response.json())
    .then((data) => {
      if (!data) {
        tekstLog.innerHTML = "Podano błędny login lub hasło";
      } else {
        tekstLog.innerHTML = "Zalogowano!";
        console.log("token: " + JSON.stringify(data));
        sessionStorage.setItem("token", JSON.stringify(data));
        document.querySelector(".emailLog").value = "";
        document.querySelector(".hasloLog").value = "";
      }
      oknoLog.showModal();
    })
    .catch((error) => console.error(error));
}
oknoCloseLog.addEventListener("click", () => {
  if (tekstLog.innerHTML === "Zalogowano!") window.location.href = "/";
  oknoLog.close();
});
