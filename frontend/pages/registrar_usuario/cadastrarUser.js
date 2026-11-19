import { getUser, createUser, updateUser } from '../../api.js';
import { isValidEmail } from '../../validations.js';
import { showMessage, storeMessage } from '../../mensagens.js';

// A mesma tela serve para cadastrar e para editar.
// Se a URL tiver ?id=5, estamos editando o usuário 5. Sem id, é cadastro novo.
const params = new URLSearchParams(window.location.search);
const userId = params.get('id');
const isEditing = userId !== null;

const form = {
  title: document.getElementById('titulo'),
  name: document.getElementById('name'),
  email: document.getElementById('email'),
  login: document.getElementById('login'),
  password: document.getElementById('password'),
  active: document.getElementById('active'),
  passwordHint: document.getElementById('senha-dica'),
  submitButton: document.getElementById('registrar'),

  nameError: document.getElementById('nome-erro'),
  emailError: document.getElementById('email-erro'),
  loginError: document.getElementById('login-erro'),
  passwordError: document.getElementById('password-erro'),
};


function toggleError(element, show) {
  element.style.display = show ? 'block' : 'none';
}

// Roda a cada tecla digitada
function validateForm() {
  const name = form.name.value.trim();
  const email = form.email.value.trim();
  const login = form.login.value.trim();
  const password = form.password.value;

  const isNameValid = name.length >= 3;
  const isEmailValid = isValidEmail(email);
  const isLoginValid = login.length >= 3;
  // Na edição a senha pode ficar em branco (mantém a atual)
  const isPasswordValid = (isEditing && password === '') || password.length >= 8;

  // Só mostra o erro depois que a pessoa começou a digitar no campo
  toggleError(form.nameError, name !== '' && !isNameValid);
  toggleError(form.emailError, email !== '' && !isEmailValid);
  toggleError(form.loginError, login !== '' && !isLoginValid);
  toggleError(form.passwordError, password !== '' && !isPasswordValid);

  form.submitButton.disabled = !(isNameValid && isEmailValid && isLoginValid && isPasswordValid);
}


async function loadUser() {
  showLoading();
  try {
    const user = await getUser(userId);
    form.name.value = user.name;
    form.email.value = user.email;
    form.login.value = user.login;
    form.active.checked = user.active;
    validateForm();
  } catch (error) {
    showMessage(error.message, 'erro');
  } finally {
    hideLoading();
  }
}


async function saveUser() {
  const user = {
    name: form.name.value,
    email: form.email.value,
    login: form.login.value,
    active: form.active.checked,
  };

  if (form.password.value !== '') {
    user.password = form.password.value;
  }

  showLoading();
  form.submitButton.disabled = true; // evita clique duplo enquanto espera
  try {
    if (isEditing) {
      await updateUser(userId, user);
      storeMessage('Usuário atualizado com sucesso!');
    } else {
      await createUser(user);
      storeMessage('Usuário cadastrado com sucesso!');
    }
    window.location.href = '../home/home.html';
  } catch (error) {
    showMessage(error.message, 'erro');
    form.submitButton.disabled = false;
  } finally {
    hideLoading();
  }
}

form.name.addEventListener('input', validateForm);
form.email.addEventListener('input', validateForm);
form.login.addEventListener('input', validateForm);
form.password.addEventListener('input', validateForm);
form.submitButton.addEventListener('click', saveUser);

if (isEditing) {
  form.title.textContent = 'Editar Usuário';
  form.submitButton.textContent = 'Salvar alterações';
  form.passwordHint.style.display = 'block';
  document.title = 'Editar Usuário';
  loadUser();
}