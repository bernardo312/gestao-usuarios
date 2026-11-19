import { listUsers, deleteUser } from '../../api.js';
import { showMessage, showStoredMessage } from '../../mensagens.js';

const userList = document.getElementById('lista-usuarios');
const emptyMessage = document.getElementById('lista-vazia');
const searchInput = document.getElementById('pesquisa');


// A pesquisa filtra em cima dela, sem chamar a API de novo.
let allUsers = [];

function logout() {
  firebase.auth().signOut().then(() => {
    window.location.href = "../../login.html";
  });
}


async function loadUsers() {
  showLoading();
  try {
    allUsers = await listUsers();
    applySearch(); // desenha a tabela respeitando o que estiver digitado
  } catch (error) {
    showMessage(error.message, 'erro');
  } finally {
    hideLoading();
  }
}

// Tira acentos e deixa tudo minúsculo: "João" e "joao" ficam iguais
function normalizeText(text) {
  return text.normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
}


function applySearch() {
  const term = normalizeText(searchInput.value.trim());

  if (term === '') {
    renderTable(allUsers, '');
    return;
  }

  //id exato ou parte do nome
  const filteredUsers = allUsers.filter(user =>
    String(user.id) === term || normalizeText(user.name).includes(term)
  );
  renderTable(filteredUsers, searchInput.value.trim());
}

function renderTable(users, term) {
  userList.innerHTML = '';
  emptyMessage.style.display = users.length === 0 ? 'block' : 'none';
  emptyMessage.textContent = term
    ? `Nenhum usuário encontrado para "${term}".`
    : 'Nenhum usuário cadastrado.';

  users.forEach(user => {
    const row = document.createElement('tr');

    row.appendChild(createCell(user.id));
    row.appendChild(createCell(user.name));
    row.appendChild(createCell(user.email));
    row.appendChild(createCell(user.login));
    row.appendChild(createStatusCell(user.active));

    const actions = document.createElement('td');

    const editLink = document.createElement('a');
    editLink.textContent = 'Editar';
    editLink.className = 'botao';
    editLink.href = `../registrar_usuario/cadastrarUser.html?id=${user.id}`;

    const deleteButton = document.createElement('button');
    deleteButton.type = 'button';
    deleteButton.textContent = 'Excluir';
    deleteButton.className = 'clean';
    deleteButton.addEventListener('click', () => confirmAndDeleteUser(user));

    actions.appendChild(editLink);
    actions.appendChild(deleteButton);
    row.appendChild(actions);

    userList.appendChild(row);
  });
}

// textContent garante que o texto vindo da API é mostrado como texto, nunca executado como HTML.
function createCell(text) {
  const cell = document.createElement('td');
  cell.textContent = text;
  return cell;
}

// Célula de status
function createStatusCell(isActive) {
  const cell = document.createElement('td');
  const badge = document.createElement('span');
  badge.textContent = isActive ? 'Ativo' : 'Inativo';
  badge.className = isActive ? 'status status-ativo' : 'status status-inativo';
  cell.appendChild(badge);
  return cell;
}

async function confirmAndDeleteUser(user) {
  const confirmed = confirm(`Tem certeza que deseja excluir o usuário "${user.name}"?`);
  if (!confirmed) {
    return;
  }

  showLoading();
  try {
    await deleteUser(user.id);
    showMessage('Usuário excluído com sucesso!', 'sucesso');
  } catch (error) {
    showMessage(error.message, 'erro');
  } finally {
    hideLoading();
  }
  loadUsers();
}

document.getElementById('logout').addEventListener('click', logout);
searchInput.addEventListener('input', applySearch);

showStoredMessage();
loadUsers();