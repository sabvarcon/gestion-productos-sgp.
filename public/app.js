const token = sessionStorage.getItem('sgp_token');
if (!token) window.location.replace('/login.html');

const headers = () => ({ 'Content-Type': 'application/json', Authorization: `Bearer ${token}` });
const form = document.querySelector('#product-form');
const tbody = document.querySelector('#products');
const message = document.querySelector('#message');
const user = JSON.parse(sessionStorage.getItem('sgp_user') || '{}');
document.querySelector('#welcome').textContent = user.name ? `Hola, ${user.name}` : '';

function notify(text, success = false) {
  message.textContent = text;
  message.className = success ? 'message success' : 'message';
}
async function api(url, options = {}) {
  const response = await fetch(url, { ...options, headers: { ...headers(), ...(options.headers || {}) } });
  const data = await response.json();
  if (response.status === 401) { sessionStorage.clear(); window.location.href = '/login.html'; }
  if (!response.ok) throw new Error(data.message || 'Ocurrió un error.');
  return data;
}
async function loadProducts() {
  try {
    const data = await api('/api/products');
    document.querySelector('#count').textContent = data.count;
    document.querySelector('#empty').style.display = data.count ? 'none' : 'block';
    tbody.innerHTML = '';
    data.products.forEach(product => {
      const tr = document.createElement('tr');
      const values = [product.name, `$${Number(product.price).toFixed(2)}`, product.stock, product.description || '—'];
      values.forEach(value => { const td = document.createElement('td'); td.textContent = value; tr.appendChild(td); });
      const actions = document.createElement('td');
      actions.innerHTML = `<div class="table-actions"><button class="secondary edit">Editar</button><button class="danger delete">Eliminar</button></div>`;
      actions.querySelector('.edit').addEventListener('click', () => editProduct(product));
      actions.querySelector('.delete').addEventListener('click', () => removeProduct(product._id));
      tr.appendChild(actions); tbody.appendChild(tr);
    });
  } catch (error) { notify(error.message); }
}
function editProduct(product) {
  document.querySelector('#product-id').value = product._id;
  ['name', 'price', 'stock', 'description'].forEach(key => form.elements[key].value = product[key] ?? '');
  document.querySelector('#form-title').textContent = 'Editar producto';
  document.querySelector('#save').textContent = 'Guardar cambios';
  document.querySelector('#cancel').classList.remove('hidden');
  window.scrollTo({ top: 0, behavior: 'smooth' });
}
function resetForm() {
  form.reset(); document.querySelector('#product-id').value = '';
  document.querySelector('#form-title').textContent = 'Agregar producto';
  document.querySelector('#save').textContent = 'Guardar producto';
  document.querySelector('#cancel').classList.add('hidden');
}
form.addEventListener('submit', async event => {
  event.preventDefault();
  const id = document.querySelector('#product-id').value;
  const payload = {
    name: form.elements.name.value.trim(), price: Number(form.elements.price.value),
    stock: Number(form.elements.stock.value), description: form.elements.description.value.trim()
  };
  try {
    await api(id ? `/api/products/${id}` : '/api/products', {
      method: id ? 'PUT' : 'POST', body: JSON.stringify(payload)
    });
    notify(id ? 'Producto actualizado.' : 'Producto agregado.', true);
    resetForm(); await loadProducts();
  } catch (error) { notify(error.message); }
});
async function removeProduct(id) {
  if (!confirm('¿Deseas eliminar este producto?')) return;
  try { await api(`/api/products/${id}`, { method: 'DELETE' }); notify('Producto eliminado.', true); await loadProducts(); }
  catch (error) { notify(error.message); }
}
document.querySelector('#cancel').addEventListener('click', resetForm);
document.querySelector('#refresh').addEventListener('click', loadProducts);
document.querySelector('#logout').addEventListener('click', () => { sessionStorage.clear(); window.location.href = '/login.html'; });
loadProducts();
