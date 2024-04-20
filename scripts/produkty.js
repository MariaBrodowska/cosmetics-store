fetch("../data/products.json")
  .then((response) => response.json())
  .then((data) => {
    console.log(data);
    makeArray(data);
  })
  .catch((error) => console.error(error));

let arrayOfProducts = [{}];

function makeArray(products) {
  let productsHtml = "";
  products.forEach((product) => {
    productsHtml += `<div class="product-container">
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
                  <input type="submit" value="DO KOSZYKA" class="przycisk"><br>
              </div>`;
  });
  document.querySelector(".products").innerHTML = productsHtml;
  arrayOfProducts = productsHtml;
}
