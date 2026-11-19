// Valida os dados recebidos. Retorna { error } ou { data } com os dados limpos.
// isUpdate = true -> na edição a senha é opcional (só troca se vier preenchida pelo usuario).
export function validateUser(body, isUpdate = false) {
  if (!body || typeof body !== 'object') {
    return { error: 'O corpo da requisição deve ser um JSON.' };
  }

  const name = typeof body.name === 'string' ? body.name.trim() : '';
  const email = typeof body.email === 'string' ? body.email.trim().toLowerCase() : '';
  const login = typeof body.login === 'string' ? body.login.trim() : '';
  const password = body.password;

  if (name.length < 3) {
    return { error: 'O campo name é obrigatório e deve ter no mínimo 3 caracteres.' };
  }

  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    return { error: 'O campo email é obrigatório e deve ter um formato válido.' };
  }

  if (login.length < 3) {
    return { error: 'O campo login é obrigatório e deve ter no mínimo 3 caracteres.' };
  }

  const passwordSent = password !== undefined && password !== null && password !== '';
  if (!isUpdate || passwordSent) {
    if (typeof password !== 'string' || password.length < 8) {
      return { error: 'O campo password é obrigatório e deve ter no mínimo 8 caracteres.' };
    }
  }

  if (body.active !== undefined && typeof body.active !== 'boolean') {
    return { error: 'O campo active deve ser true ou false.' };
  }

  // Caso não seja informado o usuario vem ativo
  const active = body.active === undefined ? true : body.active;

  return { data: { name, email, login, password: passwordSent ? password : null, active } };
}