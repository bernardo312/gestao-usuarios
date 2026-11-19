let messageTimer;

// type = 'sucesso' ou 'erro' (são os nomes das classes no CSS)
export function showMessage(text, type) {
  const div = document.getElementById('mensagem');

  clearTimeout(messageTimer);

  div.textContent = text;
  div.className = `mensagem ${type}`;

  // Sucesso some sozinho depois de 2 segundos (2000 milissegundos).
  // Erro fica na tela, para a pessoa ter tempo de ler e corrigir.
  if (type === 'sucesso') {
    messageTimer = setTimeout(() => {
      div.className = 'mensagem'; // sem 'sucesso', o CSS volta a esconder
    }, 2000);
  }
}

// Guarda uma mensagem para mostrar na PRÓXIMA página, usado quando salvamos um usuário e voltamos para a lista.
export function storeMessage(text) {
  sessionStorage.setItem('mensagem', text);
}


export function showStoredMessage() {
  const text = sessionStorage.getItem('mensagem');
  if (text) {
    showMessage(text, 'sucesso');
    sessionStorage.removeItem('mensagem');
  }
}