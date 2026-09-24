// Renders the logged-in user's order/purchase history.

function orderCardHTML(order) {
  const itemsList = order.items.map((i) => `<li>${i.name} × ${i.quantity}</li>`).join('');
  return `
    <div class="order-card">
      <div class="order-header">
        <span>Order #${order._id.slice(-6).toUpperCase()}</span>
        <span class="order-status status-${order.status}">${order.status}</span>
      </div>
      <ul>${itemsList}</ul>
      <p>Total: $${order.totalPrice.toFixed(2)}</p>
      <p class="order-date">${new Date(order.createdAt).toLocaleDateString()}</p>
    </div>
  `;
}

async function renderOrders() {
  const container = document.getElementById('orders-list');
  if (!container) return;

  if (!getToken()) {
    container.innerHTML = '<p>Please <a href="login.html">log in</a> to view your orders.</p>';
    return;
  }

  try {
    const orders = await apiRequest('/orders/my', { auth: true });
    container.innerHTML = orders.length
      ? orders.map(orderCardHTML).join('')
      : '<p>You have no orders yet.</p>';
  } catch (err) {
    container.innerHTML = `<p>Error loading orders: ${err.message}</p>`;
  }
}

document.addEventListener('DOMContentLoaded', renderOrders);
