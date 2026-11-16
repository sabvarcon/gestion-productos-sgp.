const form = document.querySelector('#login-form') || document.querySelector('#register-form');
const message = document.querySelector('#message');

if (form) form.addEventListener('submit', async (event) => {
  event.preventDefault();
  const isRegister = form.id === 'register-form';
  const payload = Object.fromEntries(new FormData(form).entries());
  try {
    const response = await fetch(`/api/auth/${isRegister ? 'register' : 'login'}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify(payload)
    });

    const raw = await response.text();
    let data;
    try {
      data = raw ? JSON.parse(raw) : {};
    } catch {
      throw new Error(`El servidor devolvió una respuesta no válida (HTTP ${response.status}). Revisa los registros de Vercel y la conexión con MongoDB.`);
    }

    if (!response.ok) throw new Error(data.message || `Error del servidor (HTTP ${response.status}).`);
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
    message.textContent = error.message || 'No fue posible conectar con el servidor.';
    message.className = 'message';
  }
});
