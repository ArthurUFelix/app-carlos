const register = async (event) => {
    event.preventDefault()

    const name = document.getElementById('name').value
    const phone = document.getElementById('phone').value

    const config = {
        name,
        phone
    }

    await api.post('/user', config).then(res => {
        const user = JSON.stringify(res.data)
        localStorage.setItem('user', user)

        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cadastro realizado com sucesso',
            showConfirmButton: false,
            timer: 1200
        }).then(() => window.location.href = './enterQueueByCompany.html')
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
