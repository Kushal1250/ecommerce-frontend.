// scripts/product.js

const productGrid = document.getElementById("product-grid");
const CART_KEY = 'myCart';
const cart = JSON.parse(localStorage.getItem(CART_KEY) || '{}');

function saveCart() {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function addToCart(id, price) {
  if (!cart[id]) cart[id] = 0;
  if (cart[id] >= 10) {
    alert("\u26A0\uFE0F Maximum limit of 10 reached for this item.");
    return;
  }
  cart[id] += 1;
  updateControls(id, price);
  updateBadge();
  updateTotal(id, price);
  showCartFeedback();
  saveCart();
}

function increaseQty(id, price) {
  if (cart[id] < 10) {
    cart[id]++;
    updateControls(id, price);
    updateBadge();
    updateTotal(id, price);
    saveCart();
  }
}

function decreaseQty(id, price) {
  cart[id]--;
  if (cart[id] <= 0) {
    delete cart[id];
    document.getElementById(`controls-${id}`).innerHTML =
      `<button onclick="addToCart(${id}, ${price})">Add to Cart</button>`;
  } else {
    updateControls(id, price);
  }
  updateBadge();
  updateTotal(id, price);
  saveCart();
}

function updateControls(id, price) {
  const ctr = document.getElementById(`controls-${id}`);
  ctr.innerHTML = `
    <div class="quantity-controls">
      <label>Qty:</label>
      <button onclick="decreaseQty(${id}, ${price})">&minus;</button>
      <span id="qty-${id}">${cart[id]}</span>
      <button onclick="increaseQty(${id}, ${price})">+</button>
    </div>
  `;
}

function updateTotal(id, price) {
  const total = (cart[id] || 0) * price;
  const totalSpan = document.querySelector(`#total-${id} .total`);
  if (totalSpan) totalSpan.textContent = total.toFixed(2);
}

function updateBadge() {
  const uniqueCount = Object.keys(cart).length;
  document.getElementById("cart-badge").textContent = uniqueCount;
}

function showCartFeedback(message = "✅ Item added to cart!") {
  let feedbackBox = document.getElementById("cart-feedback");
  if (!feedbackBox) {
    feedbackBox = document.createElement("div");
    feedbackBox.id = "cart-feedback";
    document.body.appendChild(feedbackBox);
  }
  feedbackBox.textContent = message;
  feedbackBox.classList.add("show");
  setTimeout(() => feedbackBox.classList.remove("show"), 2000);
}

const style = document.createElement('style');
style.textContent = `
  #cart-feedback {
    position: fixed; top: 20px; right: 20px;
    background: #28a745; color: white;
    padding: 10px 20px; border-radius: 8px;
    box-shadow: 0 4px 8px rgba(0,0,0,0.2);
    font-weight: bold; opacity: 0;
    transition: opacity 0.4s ease, transform 0.4s ease;
    z-index: 9999; pointer-events: none;
    transform: translateY(-20px);
  }
  #cart-feedback.show {
    opacity: 1; transform: translateY(0);
  }
  #cart-badge.bump {
    animation: bump 0.3s ease;
  }
  @keyframes bump {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
`;
document.head.appendChild(style);

// Fetch and render products
document.addEventListener("DOMContentLoaded", () => {
  fetch("https://fakestoreapi.com/products")
    .then(res => res.json())
    .then(products => {
      productGrid.innerHTML = "";
      products.slice(0, 12).forEach(product => {
        const card = document.createElement("div");
        card.className = "product-card";

        const zoomWrapper = document.createElement("div");
        zoomWrapper.className = "zoom-container";
        const img = document.createElement("img");
        img.src = product.image;
        img.alt = product.title;
        img.onerror = () => img.src = "https://via.placeholder.com/250x200?text=No+Image";
        zoomWrapper.appendChild(img);

        const title = document.createElement("h3");
        title.textContent = product.title;
        const priceEl = document.createElement("p");
        const basePrice = product.price;
        priceEl.textContent = `$${basePrice.toFixed(2)}`;

        const variationDiv = document.createElement("div");
        variationDiv.className = "variation-select variation-inline";

        const sizeLabel = document.createElement("label");
        sizeLabel.innerHTML = `Size: <select class="size-select">
          <option value="S">S</option>
          <option value="M" selected>M</option>
          <option value="L">L</option>
        </select>`;

        const colorLabel = document.createElement("label");
        colorLabel.innerHTML = `Color: <select class="color-select">
          <option value="Red" selected>Red</option>
          <option value="Blue">Blue</option>
          <option value="Black">Black</option>
        </select>`;

        variationDiv.append(sizeLabel, colorLabel);

        const totalEl = document.createElement("div");
        totalEl.className = "total-price";
        totalEl.id = `total-${product.id}`;
        totalEl.innerHTML = `Total: $<span class="total">${basePrice.toFixed(2)}</span>`;

        const controls = document.createElement("div");
        controls.className = "cart-controls";
        controls.id = `controls-${product.id}`;
        controls.innerHTML = `<button onclick="addToCart(${product.id}, ${basePrice})">Add to Cart</button>`;

        card.append(zoomWrapper, title, priceEl, variationDiv, totalEl, controls);
        productGrid.appendChild(card);

        const sizeSel = variationDiv.querySelector(".size-select");
        const colorSel = variationDiv.querySelector(".color-select");
        sizeSel.onchange = () => {
          const size = sizeSel.value;
          img.style.transform = size === "S" ? "scale(1.0)" : size === "M" ? "scale(1.1)" : "scale(1.2)";
        };
        colorSel.onchange = () => {
          const color = colorSel.value.toLowerCase();
          img.style.filter = `hue-rotate(${getHueRotation(color)}deg)`;
          img.alt = `${colorSel.value} ${sizeSel.value} Product`;
        };
        img.addEventListener("click", () => img.classList.toggle("zoomed"));
      });
    })
    .catch(err => {
      productGrid.innerHTML = `<p style="color:red; text-align:center;"><b>\u274C Failed to load products</b></p>`;
      console.error("API error:", err);
    });

  // Handle cart icon click
  const cartIcon = document.getElementById('cart-icon');
  if (cartIcon) {
    cartIcon.style.cursor = 'pointer';
    cartIcon.addEventListener('click', () => {
      window.location.href = 'cart.html';
    });
  }
});

function getHueRotation(color) {
  switch (color) {
    case "red": return 0;
    case "blue": return 200;
    case "black": return 340;
    default: return 0;
  }
}
