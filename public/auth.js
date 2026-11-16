const form = document.querySelector('#login-form') || document.querySelector('#register-form');
const message = document.querySelector('#message');

if (form) form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const isRegister = form.id === 'register-form';
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch(`/api/auth/${isRegister ? 'register' : 'login'}`, {
      method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(payload)
    });
    const data = await response.json();
    if (!response.ok) throw new Error(data.message || 'No fue posible completar la operación.');
    if (isRegister) {
      message.textContent = 'Cuenta creada. Ahora puedes iniciar sesión.';
      message.className = 'message success';
      form.reset();
    } else {
      sessionStorage.setItem('sgp_token', data.token);
      sessionStorage.setItem('sgp_user', JSON.stringify(data.user));
      window.location.href = '/index.html';
    }
  } catch (error) {
    message.textContent = error.message;
    message.className = 'message';
  }
});
