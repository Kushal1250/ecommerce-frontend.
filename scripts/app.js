const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

const productGrid = document.getElementById('product-grid');

fetch('https://fakestoreapi.com/products')
  .then(res => res.json())
  .then(products => {
    products.forEach(product => {
      const card = document.createElement('div');
      card.classList.add('product-card');
      card.setAttribute('data-id', product.id);

      card.innerHTML = `
        <img src="${product.image}" alt="${product.title}" loading="lazy">
        <h3>${product.title}</h3>
        <p>$${product.price.toFixed(2)}</p>
        <div class="cart-controls" id="controls-${product.id}">
          <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
        </div>
      `;

      productGrid.appendChild(card);
    });
  })
  .catch(error => console.error('Error loading products:', error));

function addToCart(id) {
  cart[id] = 1;
  updateCartControls(id);
}

function updateCartControls(id) {
  const controls = document.getElementById(`controls-${id}`);
  controls.innerHTML = `
    <button onclick="decreaseQty(${id})">−</button>
    <span class="qty">${cart[id]}</span>
    <button onclick="increaseQty(${id})">+</button>
  `;
}

function increaseQty(id) {
  cart[id]++;
  updateCartControls(id);
}

function decreaseQty(id) {
  cart[id]--;
  if (cart[id] <= 0) {
    delete cart[id];
    document.getElementById(`controls-${id}`).innerHTML = `
      <button class="add-cart-btn" onclick="addToCart(${id})">Add to Cart</button>
    `;
  } else {
    updateCartControls(id);
  }
}
let cart = {};

function addToCart(id) {
  cart[id] = 1;
  updateCartControls(id);
  updateCartBadge();
}

function increaseQty(id) {
  cart[id]++;
  updateCartControls(id);
  updateCartBadge();
}

function decreaseQty(id) {
  cart[id]--;
  if (cart[id] <= 0) {
    delete cart[id];
    document.getElementById(`controls-${id}`).innerHTML = `
      <button class="add-cart-btn" onclick="addToCart(${id})">Add to Cart</button>
    `;
  } else {
    updateCartControls(id);
  }
  updateCartBadge();
}

function updateCartControls(id) {
  const controls = document.getElementById(`controls-${id}`);
  controls.innerHTML = `
    <button onclick="decreaseQty(${id})">−</button>
    <span class="qty">${cart[id]}</span>
    <button onclick="increaseQty(${id})">+</button>
  `;
}

// ✅ New Function to Update Total Count in the Cart Badge
function updateCartBadge() {
  const cartBadge = document.getElementById("cart-badge");
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  cartBadge.textContent = totalItems;

  cartBadge.classList.add('updated');
  setTimeout(() => cartBadge.classList.remove('updated'), 200);
}

