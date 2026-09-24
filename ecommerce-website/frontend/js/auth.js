// Handles sign-up, login, logout, and reflecting login state in the navbar.

function saveSession(user) {
  localStorage.setItem('token', user.token);
  localStorage.setItem('user', JSON.stringify({ _id: user._id, name: user.name, email: user.email, role: user.role }));
}

function getUser() {
  const raw = localStorage.getItem('user');
  return raw ? JSON.parse(raw) : null;
}

function logout() {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  window.location.href = 'login.html';
}

function renderNavAuthState() {
  const user = getUser();
  const authArea = document.getElementById('nav-auth-area');
  if (!authArea) return;

  if (user) {
    authArea.innerHTML = `
      <span class="nav-user">Hi, ${user.name}</span>
      <a href="orders.html">My Orders</a>
      <a href="#" id="logout-link">Logout</a>
    `;
    document.getElementById('logout-link').addEventListener('click', (e) => {
      e.preventDefault();
      logout();
    });
  } else {
    authArea.innerHTML = `
      <a href="login.html">Login</a>
      <a href="signup.html">Sign Up</a>
    `;
  }
}

document.addEventListener('DOMContentLoaded', renderNavAuthState);

// --- Signup form ---
const signupForm = document.getElementById('signup-form');
if (signupForm) {
  signupForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const name = document.getElementById('signup-name').value;
    const email = document.getElementById('signup-email').value;
    const password = document.getElementById('signup-password').value;
    const errorBox = document.getElementById('signup-error');

    try {
      const user = await apiRequest('/auth/signup', { method: 'POST', body: { name, email, password } });
      saveSession(user);
      window.location.href = 'index.html';
    } catch (err) {
      errorBox.textContent = err.message;
    }
  });
}

// --- Login form ---
const loginForm = document.getElementById('login-form');
if (loginForm) {
  loginForm.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const password = document.getElementById('login-password').value;
    const errorBox = document.getElementById('login-error');

    try {
      const user = await apiRequest('/auth/login', { method: 'POST', body: { email, password } });
      saveSession(user);
      window.location.href = 'index.html';
    } catch (err) {
      errorBox.textContent = err.message;
    }
  });
}
