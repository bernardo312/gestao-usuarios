import { isValidEmail } from "./validations.js";

const form = {
  email: document.getElementById("email"),
  password: document.getElementById("password"),

  emailRequiredError: document.getElementById("email-requerido-erro"),
  emailInvalidError: document.getElementById("email-invalido-erro"),
  passwordRequiredError: document.getElementById("password-requerido-erro"),

  loginButton: document.getElementById("login"),
};

// Se a pessoa já estiver logada, vai direto para a lista
firebaseReady
  .then(() => {
    firebase.auth().onAuthStateChanged(user => {
      if (user) {
        window.location.href = "./pages/home/home.html";
      }
    });
  })
  .catch(error => {
    alert(error.message);
  });

function handleEmailInput() {
  updateLoginButton();
  toggleEmailErrors();
}

function handlePasswordInput() {
  updateLoginButton();
  togglePasswordErrors();
}

function hasValidEmail() {
  const email = form.email.value;
  if (!email) {
    return false;
  }
  return isValidEmail(email);
}

function hasPassword() {
  return form.password.value !== "";
}

function toggleEmailErrors() {
  const email = form.email.value;
  form.emailRequiredError.style.display = email ? "none" : "block";
  form.emailInvalidError.style.display = isValidEmail(email) ? "none" : "block";
}

function togglePasswordErrors() {
  const password = form.password.value;
  form.passwordRequiredError.style.display = password ? "none" : "block";
}


function updateLoginButton() {
  form.loginButton.disabled = !hasValidEmail() || !hasPassword();
}

async function login() {
  showLoading();
  try {
    await firebaseReady;
    // SESSION: a sessão termina quando a aba ou o navegador é fechado
    await firebase.auth().setPersistence(firebase.auth.Auth.Persistence.SESSION);
    await firebase.auth().signInWithEmailAndPassword(form.email.value, form.password.value);
    window.location.href = "./pages/home/home.html";
  } catch (error) {
    alert(getLoginErrorMessage(error));
  } finally {
    hideLoading();
  }
}


function getLoginErrorMessage(error) {
  if (error.code === "auth/user-not-found") {
    return "Usuário não encontrado. Verifique o e-mail digitado.";
  } else if (error.code === "auth/wrong-password") {
    return "Senha incorreta. Tente novamente.";
  } else if (error.code === "auth/invalid-credential") {
    return "Credenciais inválidas. Verifique se seu e-mail e a senha estão corretos";
  }
  return error.message;
}

form.email.addEventListener("input", handleEmailInput);
form.password.addEventListener("input", handlePasswordInput);
form.loginButton.addEventListener("click", login);