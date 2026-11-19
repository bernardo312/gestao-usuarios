import express from 'express';
import cors from 'cors';
import { STATUS_CODES } from 'node:http';
import * as userController from './controllers/userController.js';

const app = express();

app.use(cors());         // libera o frontend a chamar a API
app.use(express.json()); // lê o JSON do body

// Log das requsicoes
app.use((req, res, next) => {
  res.on('finish', () => {
    const statusName = STATUS_CODES[res.statusCode]; // exemplo:  201 Created
    console.log(`${req.method} ${req.originalUrl} -> ${res.statusCode} ${statusName}`);
  });
  next();
});

app.get('/', (req, res) => {
  res.send('API no ar');
});

// Rotas
app.get('/users', userController.list);
app.get('/users/:id', userController.getById);
app.post('/users', userController.create);
app.put('/users/:id', userController.update);
app.delete('/users/:id', userController.remove);


// No Express, erros dentro de funções async chegam aqui automaticamente.
app.use((err, req, res, next) => {
  if (err.type === 'entity.parse.failed') {
    return res.status(400).json({ error: 'JSON inválido.' });
  }
  console.error(err);
  res.status(500).json({ error: 'Erro interno no servidor.' });
});

export default app;