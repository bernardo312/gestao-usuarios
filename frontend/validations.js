// Mesma regra de email usada no backend (userValidation.js)
export function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}