let user = document.getElementById("user");
function openUser() {
  if (!sessionStorage.getItem("token")) {
    user.classList.add("open-user");
    document.querySelector("body").style.pointerEvents = "none";
    document.querySelector("body").disabled = true;
    document.querySelector(".user").style.pointerEvents = "auto";
    document.querySelector(".user").disabled = false;
    document.querySelector("#oknoLog").style.pointerEvents = "auto";
    document.querySelector("#oknoLog").disabled = false;
    document.querySelector("#tlo").style.pointerEvents = "auto";
    document.querySelector("#tlo").disabled = false;
  } else {
    window.location.href = "/user-page";
  }
}
function closeUser() {
  user.classList.remove("open-user");
  document.querySelector("body").style.pointerEvents = "auto";
  document.querySelector("body").disabled = false;
}
function openRegister() {
  location.replace("/register-page");
}
function closeRegister() {
  location.replace("/");
}
window.onload = function () {
  if (window.location.pathname.endsWith("/user-page")) {
    wyswietlDane();
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
  window.open("/kontakt", "_blank");
});
function closeKoszyk() {
  location.replace("/");
}
let logo = document.getElementById("logo");
logo.addEventListener("click", () => {
  window.location.href = "/";
});

let dane = {};
function wyswietlDane() {
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
      document.querySelector(".imie").innerHTML = dane[0].imie + ",";
      document.querySelector(".email").value = dane[0].email;
      document.querySelector(".imiee").value = dane[0].imie;
      document.querySelector(".nazwisko").value = dane[0].nazwisko;
      if (dane[0].dataUrodzenia)
        document.querySelector(".data").value = dane[0].dataUrodzenia;
      if (dane[0].tel) document.querySelector(".nr").value = dane[0].tel;
    })
    .catch((error) => console.error(error));
}

function scrollToSection(sectionId) {
  document.getElementById(sectionId).scrollIntoView({ behavior: "smooth" });
}

function toggleMenu() {
  const sidebar = document.querySelector(".sidebar");
  const display = window.getComputedStyle(sidebar).display;
  if (display === "none") {
    sidebar.style.display = "flex";
  } else {
    sidebar.style.display = "none";
  }
}

document.querySelectorAll(".sidebar li > a").forEach((link) => {
  link.addEventListener("click", function (event) {
    const submenu = this.nextElementSibling;
    if (submenu && submenu.tagName === "UL") {
      document.querySelectorAll(".sidebar ul.open").forEach((openSubmenu) => {
        if (openSubmenu !== submenu) {
          openSubmenu.classList.remove("open");
          openSubmenu.classList.add("close");
        }
      });

      submenu.classList.toggle("open");
      submenu.classList.toggle("close");
    }
  });
});
