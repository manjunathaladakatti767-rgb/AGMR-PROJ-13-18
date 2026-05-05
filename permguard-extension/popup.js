document.addEventListener('DOMContentLoaded', async () => {
  const loginForm = document.getElementById('login-form');
  const userInfoDiv = document.getElementById('user-info');
  const userNameSpan = document.getElementById('user-name');
  const loginBtn = document.getElementById('login-btn');
  const logoutBtn = document.getElementById('logout-btn');

  // Check if already logged in
  const result = await chrome.storage.local.get(['userInfo']);
  if (result.userInfo) {
    const user = JSON.parse(result.userInfo);
    showUser(user.name);
  }

  function showUser(name) {
    loginForm.style.display = 'none';
    userInfoDiv.style.display = 'block';
    userNameSpan.textContent = name;
  }

  loginBtn.addEventListener('click', async () => {
    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    if (!email || !password) return alert('Please enter credentials');

    try {
      const response = await fetch('http://localhost:5000/api/auth/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();

      if (response.ok) {
        await chrome.storage.local.set({ userInfo: JSON.stringify(data) });
        showUser(data.name);
      } else {
        alert(data.message || 'Login failed');
      }
    } catch (err) {
      alert('Cannot connect to PermGuard Backend.');
    }
  });

  logoutBtn.addEventListener('click', async () => {
    await chrome.storage.local.remove(['userInfo']);
    loginForm.style.display = 'block';
    userInfoDiv.style.display = 'none';
  });
});
