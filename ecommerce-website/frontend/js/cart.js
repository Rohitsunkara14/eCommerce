// Renders the cart page: line items, quantity changes, removal, and checkout.

function cartItemHTML(item) {
  return `
    <div class="cart-item" data-id="${item.product}">
      <img src="${item.image || 'https://via.placeholder.com/100x100?text=Item'}" alt="${item.name}" />
      <div class="cart-item-info">
        <h4>${item.name}</h4>
        <p>$${item.price.toFixed(2)}</p>
      </div>
      <input type="number" class="cart-qty" min="1" value="${item.quantity}" data-id="${item.product}" />
      <button class="btn btn-secondary remove-item" data-id="${item.product}">Remove</button>
      <p class="line-total">$${(item.price * item.quantity).toFixed(2)}</p>
    </div>
  `;
}

async function renderCart() {
  const container = document.getElementById('cart-items');
  if (!container) return;

  if (!getToken()) {
    container.innerHTML = '<p>Please <a href="login.html">log in</a> to view your cart.</p>';
    return;
  }

  try {
    const cart = await apiRequest('/cart', { auth: true });
    if (cart.items.length === 0) {
      container.innerHTML = '<p>Your cart is empty. <a href="index.html">Continue shopping</a>.</p>';
      document.getElementById('cart-summary').innerHTML = '';
      return;
    }

    container.innerHTML = cart.items.map(cartItemHTML).join('');

    container.querySelectorAll('.cart-qty').forEach((input) => {
      input.addEventListener('change', async () => {
        await apiRequest(`/cart/${input.dataset.id}`, {
          method: 'PUT',
          auth: true,
          body: { quantity: Number(input.value) },
        });
        renderCart();
      });
    });

    container.querySelectorAll('.remove-item').forEach((btn) => {
      btn.addEventListener('click', async () => {
        await apiRequest(`/cart/${btn.dataset.id}`, { method: 'DELETE', auth: true });
        renderCart();
      });
    });

    const total = cart.items.reduce((sum, i) => sum + i.price * i.quantity, 0);
    document.getElementById('cart-summary').innerHTML = `
      <h3>Total: $${total.toFixed(2)}</h3>
      <button class="btn btn-primary" id="checkout-btn">Proceed to Checkout</button>
    `;
    document.getElementById('checkout-btn').addEventListener('click', checkout);
  } catch (err) {
    container.innerHTML = `<p>Error loading cart: ${err.message}</p>`;
  }
}

async function checkout() {
  const address = prompt('Shipping address:');
  const city = prompt('City:');
  const postalCode = prompt('Postal code:');
  const country = prompt('Country:');

  if (!address || !city) return;

  try {
    const order = await apiRequest('/orders', {
      method: 'POST',
      auth: true,
      body: { shippingAddress: { address, city, postalCode, country } },
    });
    alert(`Order placed! Order ID: ${order._id}\n\nNote: connect a Stripe Checkout or Elements flow on the frontend using /api/orders/${order._id}/create-payment-intent to take real payments.`);
    window.location.href = 'orders.html';
  } catch (err) {
    alert(err.message);
  }
}

document.addEventListener('DOMContentLoaded', renderCart);
