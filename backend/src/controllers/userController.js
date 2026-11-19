import bcrypt from 'bcryptjs';
import * as User from '../models/userModel.js';
import { validateUser } from '../validations/userValidation.js';


function parseId(value) {
  const id = Number(value);
  return Number.isInteger(id) && id > 0 ? id : null;
}

export async function list(req, res) {
  const users = await User.findAll();
  res.status(200).json(users);
}

export async function getById(req, res) {
  const id = parseId(req.params.id);
  const user = id && (await User.findById(id));
  if (!user) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }
  res.status(200).json(user);
}

export async function create(req, res) {
  const { error, data } = validateUser(req.body);
  if (error) {
    return res.status(400).json({ error });
  }

  if (await User.emailExists(data.email)) {
    return res.status(400).json({ error: 'Já existe um usuário com este email.' });
  }
  if (await User.loginExists(data.login)) {
    return res.status(400).json({ error: 'Já existe um usuário com este login.' });
  }


  const passwordHash = await bcrypt.hash(data.password, 10);
  const user = await User.create({ ...data, passwordHash });

  res.status(201).json(user);
}

export async function update(req, res) {
  const id = parseId(req.params.id);
  const existing = id && (await User.findById(id));
  if (!existing) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }

  const { error, data } = validateUser(req.body, true);
  if (error) {
    return res.status(400).json({ error });
  }

  if (await User.emailExists(data.email, id)) {
    return res.status(400).json({ error: 'Já existe um usuário com este email.' });
  }
  if (await User.loginExists(data.login, id)) {
    return res.status(400).json({ error: 'Já existe um usuário com este login.' });
  }

  const passwordHash = data.password ? await bcrypt.hash(data.password, 10) : null;
  const user = await User.update(id, { ...data, passwordHash });

  res.status(200).json(user);
}

export async function remove(req, res) {
  const id = parseId(req.params.id);
  const deleted = id && (await User.remove(id));
  if (!deleted) {
    return res.status(404).json({ error: 'Usuário não encontrado.' });
  }
  res.status(204).send();
}