import sqlite3 from 'sqlite3'
import { open } from 'sqlite'

const db = await open({
  filename: './database.db',
  driver: sqlite3.Database
})

//criar tabela se ela ainda nao existir

await db.exec(`
  CREATE TABLE IF NOT EXISTS users (
    id            INTEGER PRIMARY KEY AUTOINCREMENT,
    name          TEXT    NOT NULL,
    email         TEXT    NOT NULL UNIQUE,
    login         TEXT    NOT NULL UNIQUE,
    password_hash TEXT    NOT NULL,
    active        INTEGER NOT NULL DEFAULT 1
  )
`);




export default db;