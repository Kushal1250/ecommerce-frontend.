// Add this to your CSS or inline styles for .variation-inline:
// .variation-inline {
//   display: flex;
//   justify-content: space-between;
//   align-items: center;
//   gap: 10px;
//   margin-top: 10px;
//   flex-wrap: wrap;
// }

const productGrid = document.getElementById("product-grid");
const cart = {}; // { id: quantity }

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

      const controls = document.createElement("div");
      controls.className = "cart-controls";
      controls.id = `controls-${product.id}`;
      controls.innerHTML = `<button onclick="addToCart(${product.id}, ${basePrice})">Add to Cart</button>`;

      card.append(zoomWrapper, title, priceEl, controls);
      productGrid.appendChild(card);

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
      priceEl.after(variationDiv);

      const totalEl = document.createElement("div");
      totalEl.className = "total-price";
      totalEl.id = `total-${product.id}`;
      totalEl.innerHTML = `Total: $<span class="total">${basePrice.toFixed(2)}</span>`;
      variationDiv.after(totalEl);

      const sizeSel = variationDiv.querySelector(".size-select");
      const colorSel = variationDiv.querySelector(".color-select");

      // Visual scaling
      sizeSel.onchange = () => {
        const size = sizeSel.value;
        if (size === "S") {
          img.style.transform = "scale(1.0)";
        } else if (size === "M") {
          img.style.transform = "scale(1.1)";
        } else if (size === "L") {
          img.style.transform = "scale(1.2)";
        }
      };

      // Color overlay effect
      colorSel.onchange = () => {
        const color = colorSel.value.toLowerCase();
        img.style.filter = `hue-rotate(${getHueRotation(color)}deg)`;
        img.alt = `${colorSel.value} ${sizeSel.value} Product`;
      };

      img.addEventListener("click", () => {
        img.classList.toggle("zoomed");
      });
    });
  })
  .catch(err => {
    productGrid.innerHTML = `<p style="color:red; text-align:center;"><b>❌ Failed to load products</b></p>`;
    console.error("API error:", err);
  });

function getHueRotation(color) {
  switch (color) {
    case "red": return 0;
    case "blue": return 200;
    case "black": return 340; // near grayscale
    default: return 0;
  }
}

function addToCart(id, price) {
  if (!cart[id]) cart[id] = 0;
  if (cart[id] >= 10) {
    alert("⚠️ Maximum limit of 10 reached for this item.");
    return;
  }
  cart[id] += 1;
  updateControls(id, price);
  updateBadge();
  updateTotal(id, price);
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

function increaseQty(id, price) {
  if (cart[id] >= 10) {
    alert("⚠️ Maximum limit of 10 reached for this item.");
    return;
  }
  cart[id]++;
  document.getElementById(`qty-${id}`).textContent = cart[id];
  updateBadge();
  updateTotal(id, price);
}

function decreaseQty(id, price) {
  cart[id]--;
  if (cart[id] <= 0) {
    delete cart[id];
    document.getElementById(`controls-${id}`).innerHTML =
      `<button onclick="addToCart(${id}, ${price})">Add to Cart</button>`;
  } else {
    document.getElementById(`qty-${id}`).textContent = cart[id];
    updateControls(id, price);
  }
  updateBadge();
  updateTotal(id, price);
}

function updateTotal(id, price) {
  const total = (cart[id] || 0) * price;
  const totalSpan = document.querySelector(`#total-${id} .total`);
  if (totalSpan) totalSpan.textContent = total.toFixed(2);
}

function updateBadge() {
  const total = Object.keys(cart).length; // Unique product count
  document.getElementById("cart-badge").textContent = total;
}
