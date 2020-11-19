const register = async (event) => {
    event.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const config = {
        name,
        email,
        password
    }

    await api.post('/company', config).then(res => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Empresa registrada com sucesso!',
            showConfirmButton: true
        }).then(() => window.location.href = './companyLogin.html')
    }).catch(err => {
        const { error } = err.response.data
        Swal.fire({
            position: 'center',
            icon: 'error',
            title: error,
            showConfirmButton: true
        })
    })
}