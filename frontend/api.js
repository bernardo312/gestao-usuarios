const API_URL = 'http://localhost:3000';


async function request(path, options = {}) {
  let response;
  try {
    response = await fetch(API_URL + path, {
      headers: { 'Content-Type': 'application/json' },
      ...options,
    });
  } catch (error) {
    // fetch só cai aqui quando nem chegou na API (backend desligado, sem rede)
    throw new Error('Não foi possível conectar à API. Verifique se o backend está rodando.');
  }

  // 204 No Content (DELETE): não tem corpo para ler
  if (response.status === 204) {
    return null;
  }

  const data = await response.json().catch(() => ({}));

  // response.ok é true para status 200 a 299. 400, 404 e 500 caem aqui.
  if (!response.ok) {
    throw new Error(data.error || 'Erro inesperado na API.');
  }

  return data;
}

export function listUsers() {
  return request('/users');
}

export function getUser(id) {
  return request(`/users/${id}`);
}

export function createUser(user) {
  return request('/users', { method: 'POST', body: JSON.stringify(user) });
}

export function updateUser(id, user) {
  return request(`/users/${id}`, { method: 'PUT', body: JSON.stringify(user) });
}

export function deleteUser(id) {
  return request(`/users/${id}`, { method: 'DELETE' });
}