// Product catalog: fetching, filtering, sorting, searching, and cart button clicks.
// Also renders single product details + reviews on product-detail.html.

function getCartCountBadge() {
  return document.getElementById('cart-count');
}

async function updateCartBadge() {
  const badge = getCartCountBadge();
  if (!badge) return;
  if (!getToken()) {
    badge.textContent = '0';
    return;
  }
  try {
    const cart = await apiRequest('/cart', { auth: true });
    const count = cart.items.reduce((sum, i) => sum + i.quantity, 0);
    badge.textContent = count;
  } catch {
    badge.textContent = '0';
  }
}

async function addProductToCart(productId, quantity = 1) {
  if (!getToken()) {
    alert('Please log in first.');
    window.location.href = 'login.html';
    return;
  }
  try {
    await apiRequest('/cart', { method: 'POST', auth: true, body: { productId, quantity } });
    updateCartBadge();
    alert('Added to cart!');
  } catch (err) {
    alert(err.message);
  }
}

function productCardHTML(p) {
  return `
    <div class="product-card">
      <a href="product-detail.html?id=${p._id}">
        <img src="${p.image || 'https://via.placeholder.com/300x300?text=Product'}" alt="${p.name}" />
        <h3>${p.name}</h3>
      </a>
      <p class="price">$${p.price.toFixed(2)}</p>
      <p class="rating">⭐ ${p.rating.toFixed(1)} (${p.numReviews})</p>
      <button class="btn btn-primary add-to-cart" data-id="${p._id}">Add to Cart</button>
    </div>
  `;
}

async function loadCategories() {
  const select = document.getElementById('filter-category');
  if (!select) return;
  try {
    const categories = await apiRequest('/products/categories');
    categories.forEach((c) => {
      const opt = document.createElement('option');
      opt.value = c;
      opt.textContent = c;
      select.appendChild(opt);
    });
  } catch (err) {
    console.error(err);
  }
}

async function loadProducts(page = 1) {
  const grid = document.getElementById('product-grid');
  if (!grid) return;

  const keyword = document.getElementById('search-input')?.value || '';
  const category = document.getElementById('filter-category')?.value || '';
  const sort = document.getElementById('sort-select')?.value || '';

  const params = new URLSearchParams({ page, limit: 12 });
  if (keyword) params.set('keyword', keyword);
  if (category) params.set('category', category);
  if (sort) params.set('sort', sort);

  grid.innerHTML = '<p>Loading products...</p>';

  try {
    const data = await apiRequest(`/products?${params.toString()}`);
    if (data.products.length === 0) {
      grid.innerHTML = '<p>No products found.</p>';
      return;
    }
    grid.innerHTML = data.products.map(productCardHTML).join('');

    document.querySelectorAll('.add-to-cart').forEach((btn) => {
      btn.addEventListener('click', () => addProductToCart(btn.dataset.id));
    });

    renderPagination(data.page, data.pages);
  } catch (err) {
    grid.innerHTML = `<p>Error loading products: ${err.message}</p>`;
  }
}

function renderPagination(current, pages) {
  const container = document.getElementById('pagination');
  if (!container || pages <= 1) {
    if (container) container.innerHTML = '';
    return;
  }
  let html = '';
  for (let i = 1; i <= pages; i++) {
    html += `<button class="page-btn ${i === current ? 'active' : ''}" data-page="${i}">${i}</button>`;
  }
  container.innerHTML = html;
  container.querySelectorAll('.page-btn').forEach((btn) => {
    btn.addEventListener('click', () => loadProducts(Number(btn.dataset.page)));
  });
}

// --- Product detail page ---
async function loadProductDetail() {
  const container = document.getElementById('product-detail');
  if (!container) return;

  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    container.innerHTML = '<p>Product not found.</p>';
    return;
  }

  try {
    const p = await apiRequest(`/products/${id}`);
    container.innerHTML = `
      <div class="detail-image">
        <img src="${p.image || 'https://via.placeholder.com/400x400?text=Product'}" alt="${p.name}" />
      </div>
      <div class="detail-info">
        <h1>${p.name}</h1>
        <p class="rating">⭐ ${p.rating.toFixed(1)} (${p.numReviews} reviews)</p>
        <p class="price">$${p.price.toFixed(2)}</p>
        <p class="stock">${p.stock > 0 ? `${p.stock} in stock` : 'Out of stock'}</p>
        <p class="description">${p.description}</p>
        <div class="qty-row">
          <label for="qty">Qty:</label>
          <input type="number" id="qty" value="1" min="1" max="${p.stock}" />
          <button class="btn btn-primary" id="detail-add-cart">Add to Cart</button>
        </div>
      </div>
    `;
    document.getElementById('detail-add-cart').addEventListener('click', () => {
      const qty = Number(document.getElementById('qty').value) || 1;
      addProductToCart(p._id, qty);
    });

    loadReviews(id);
  } catch (err) {
    container.innerHTML = `<p>Error: ${err.message}</p>`;
  }
}

async function loadReviews(productId) {
  const list = document.getElementById('review-list');
  if (!list) return;
  try {
    const reviews = await apiRequest(`/products/${productId}/reviews`);
    list.innerHTML = reviews.length
      ? reviews.map((r) => `
          <div class="review">
            <strong>${r.name}</strong> — ⭐ ${r.rating}
            <p>${r.comment}</p>
          </div>
        `).join('')
      : '<p>No reviews yet. Be the first!</p>';
  } catch (err) {
    list.innerHTML = `<p>Error loading reviews: ${err.message}</p>`;
  }

  const reviewForm = document.getElementById('review-form');
  if (reviewForm) {
    reviewForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      if (!getToken()) {
        alert('Please log in to leave a review.');
        return;
      }
      const rating = document.getElementById('review-rating').value;
      const comment = document.getElementById('review-comment').value;
      try {
        await apiRequest(`/products/${productId}/reviews`, {
          method: 'POST',
          auth: true,
          body: { rating, comment },
        });
        reviewForm.reset();
        loadReviews(productId);
      } catch (err) {
        alert(err.message);
      }
    });
  }
}

document.addEventListener('DOMContentLoaded', () => {
  updateCartBadge();
  loadCategories();
  loadProducts();
  loadProductDetail();

  document.getElementById('search-input')?.addEventListener('keyup', (e) => {
    if (e.key === 'Enter') loadProducts();
  });
  document.getElementById('search-btn')?.addEventListener('click', () => loadProducts());
  document.getElementById('filter-category')?.addEventListener('change', () => loadProducts());
  document.getElementById('sort-select')?.addEventListener('change', () => loadProducts());
});
