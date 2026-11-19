import db from '../db.js';




function toUser(row) {
  if (!row) return null;
  return { ...row, active: row.active === 1 };
}

export async function findAll() {
  const rows = await db.all('SELECT id, name, email, login, active FROM users ORDER BY id');
  return rows.map(toUser);
}

export async function findById(id) {
  const row = await db.get('SELECT id, name, email, login, active FROM users WHERE id = ?', [id]);
  return toUser(row);
}

// Usadas para checar duplicidade. ignoreId serve na edição:
// o próprio usuário que está sendo editado pode manter o mesmo email/login.
export async function emailExists(email, ignoreId = 0) {
  const row = await db.get('SELECT id FROM users WHERE email = ? AND id <> ?', [email, ignoreId]);
  return !!row;
}

export async function loginExists(login, ignoreId = 0) {
  const row = await db.get('SELECT id FROM users WHERE login = ? AND id <> ?', [login, ignoreId]);
  return !!row;
}

export async function create({ name, email, login, passwordHash, active }) {
  const result = await db.run(
    'INSERT INTO users (name, email, login, password_hash, active) VALUES (?, ?, ?, ?, ?)',
    [name, email, login, passwordHash, active ? 1 : 0]
  );
  // id gerado pelo autoincremento
  return findById(result.lastID);
}

export async function update(id, { name, email, login, passwordHash, active }) {
  if (passwordHash) {
    await db.run(
      'UPDATE users SET name = ?, email = ?, login = ?, active = ?, password_hash = ? WHERE id = ?',
      [name, email, login, active ? 1 : 0, passwordHash, id]
    );
  } else {
    // Sem senha nova é mantido a senha antiga
    await db.run(
      'UPDATE users SET name = ?, email = ?, login = ?, active = ? WHERE id = ?',
      [name, email, login, active ? 1 : 0, id]
    );
  }
  return findById(id);
}

export async function remove(id) {
  const result = await db.run('DELETE FROM users WHERE id = ?', [id]);
  return result.changes > 0;
}