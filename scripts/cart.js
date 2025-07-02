// scripts/cart.js
window.addEventListener('DOMContentLoaded', () => {
  const CART_KEY    = 'myCart';
  const raw         = localStorage.getItem(CART_KEY);
  const cart        = raw ? JSON.parse(raw) : {};
  const container   = document.getElementById('cart-items');
  const totalEl     = document.getElementById('cart-total');
  const checkoutBtn = document.getElementById('checkout-btn');
  const countBadge  = document.getElementById('cart-count');

  // 1. Empty state
  if (Object.keys(cart).length === 0) {
    container.innerHTML    = '<p>Your cart is empty.</p>';
    checkoutBtn.disabled   = true;
    countBadge.textContent = 'Cart: 0';
    totalEl.textContent    = '0.00';
    return;
  }

  // 2. Render each item
  let overall = 0;
  Promise.all(
    Object.entries(cart).map(([id, qty]) =>
      fetch(`https://fakestoreapi.com/products/${id}`)
        .then(r => r.json())
        .then(prod => {
          const line = prod.price * qty;
          overall += line;

          const item = document.createElement('div');
          item.className = 'cart-item';
          item.innerHTML = `
            <img src="${prod.image}" alt="${prod.title}" />
            <div class="info">
              <h3>${prod.title}</h3>
              <p>Price: $${prod.price.toFixed(2)}</p>
              <div class="quantity-controls">
                <button class="minus">−</button>
                <span class="qty">${qty}</span>
                <button class="plus">+</button>
              </div>
              <p>Line: $<span class="line-total">${line.toFixed(2)}</span></p>
              <button class="remove">Remove</button>
            </div>
          `;
          container.appendChild(item);

          // Bind button actions
          item.querySelector('.minus').onclick   = () => updateQty(id, -1);
          item.querySelector('.plus').onclick    = () => updateQty(id, +1);
          item.querySelector('.remove').onclick  = () => removeItem(id);
        })
    )
  ).then(() => {
    totalEl.textContent    = overall.toFixed(2);
    countBadge.textContent = `Cart: ${Object.keys(cart).length}`;
    checkoutBtn.disabled   = false;
  });

  // Save cart and reload
  function saveAndReload() {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    location.reload();
  }

  // Update quantity logic
  function updateQty(id, delta) {
    if (!cart[id]) return;

    const newQty = cart[id] + delta;

    if (newQty <= 0) {
      removeItem(id);
    } else if (newQty > 10) {
      alert("⚠️ Maximum limit of 10 reached for this item.");
    } else {
      cart[id] = newQty;
      saveAndReload();
    }
  }

  // Remove item
  function removeItem(id) {
    delete cart[id];
    saveAndReload();
  }
});
