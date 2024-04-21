let user = document.getElementById("user");
function openUser() {
  user.classList.add("open-user");
}
function closeUser() {
  user.classList.remove("open-user");
}
function openRegister() {
  location.replace("register-page.html");
}
function closeRegister() {
  sessionStorage.setItem("openUser", "true");
  location.replace("index.html");
}
window.onload = function () {
  if (sessionStorage.getItem("openUser") === "true") {
    setTimeout(openUser, 1000);
    sessionStorage.removeItem("openUser");
  }
};
let dymek = document.getElementById("dymek");
let character = document.getElementById("character");
character.addEventListener("mouseenter", () => {
  dymek.style.visibility = "visible";
});
character.addEventListener("mouseleave", () => {
  dymek.style.visibility = "hidden";
});
character.addEventListener("click", () => {
  window.location.href = "kontakt.html";
});
// let koszyk = document.getElementById("koszyk");
// koszyk.addEventListener("click", () => {
//   sessionStorage.setItem("openKoszyk", "true");
//   window.location.href = "koszyk.html";
// });
function closeKoszyk() {
  location.replace("index.html");
}
let logo = document.getElementById("logo");
logo.addEventListener("click", () => {
  window.location.href = "index.html";
});
