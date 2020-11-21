const logged = localStorage.getItem('company')

if (logged === null) {
  alert('Você não está logado!')
  window.location.href = './landing.html'
}
