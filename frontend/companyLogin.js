const login = async (event) => {
    event.preventDefault()

    const email = document.getElementById('email').value
    const password = document.getElementById('password').value

    const config = {
        email,
        password
    }

    await api.post('/session', config).then(res => {
        const company = JSON.stringify(res.data)
        localStorage.setItem('company', company)
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Logado com sucesso',
            showConfirmButton: false,
            timer: 1200
        }).then(() => window.location.href = './dashboard.html')
    }).catch(err => {
        const { error } = err.response.data
        Swal.fire({
            position: 'top-right',
            icon: 'error',
            title: error,
            showConfirmButton: false,
            toast: true,
            timer: 3000
        })
    })

}