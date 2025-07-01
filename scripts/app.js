const hamburger = document.querySelector('.hamburger');
const navLinks = document.querySelector('.nav-links');
const productGrid = document.getElementById('product-grid');
const cartBadge = document.getElementById('cart-badge');

hamburger.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});

// ✅ Show loading state
const loader = document.createElement('p');
loader.textContent = '🔄 Loading products...';
loader.style.textAlign = 'center';
loader.style.fontWeight = 'bold';
productGrid.appendChild(loader);

// ✅ Global cart state
let cart = {};

// ✅ Fetch products from API
async function fetchProducts() {
  try {
    const res = await fetch('https://fakestoreapi.com/products');
    if (!res.ok) throw new Error('Failed to fetch products');

    const products = await res.json();
    loader.remove(); // Remove loading text after data is ready

    displayProducts(products);
  } catch (error) {
    console.error('Error:', error);
    loader.textContent = '❌ Failed to load products. Please try again later.';
  }
}

// ✅ Render product cards
function displayProducts(products) {
  products.forEach(product => {
    const card = document.createElement('div');
    card.className = 'product-card';
    card.setAttribute('data-id', product.id);

    card.innerHTML = `
      <img src="${product.image}" alt="${product.title}" loading="lazy" />
      <h3>${product.title}</h3>
      <p>$${product.price.toFixed(2)}</p>
      <div class="cart-controls" id="controls-${product.id}">
        <button class="add-cart-btn" onclick="addToCart(${product.id})">Add to Cart</button>
      </div>
    `;

    productGrid.appendChild(card);
  });
}

// ✅ Cart Logic
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

function updateCartBadge() {
  const totalItems = Object.values(cart).reduce((sum, qty) => sum + qty, 0);
  cartBadge.textContent = totalItems;

  // Animate badge
  cartBadge.classList.add('updated');
  setTimeout(() => cartBadge.classList.remove('updated'), 200);
}

// ✅ Initial fetch
fetchProducts();

card.innerHTML = `
  <a href="product.html?id=${product.id}" class="card-link">
    <img src="${product.image}" alt="${product.title}" />
    <h3>${product.title}</h3>
    <p>$${product.price.toFixed(2)}</p>
  </a>
  <div class="cart-controls" id="controls-${product.id}">
    <button class="add-cart-btn" onclick="addToCart(${product.id}); event.stopPropagation()">Add to Cart</button>
  </div>
`;



