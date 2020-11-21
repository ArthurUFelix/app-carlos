const editCompany = async (event) => {
    event.preventDefault()

    const name = document.getElementById('name').value
    const email = document.getElementById('email').value
    const oldPassword = document.getElementById('oldPassword').value
    const password = document.getElementById('newPassword').value
    const confirmPassword = document.getElementById('confirmPassword').value

    const config = {}

    if (name !== '') config.name = name
    if (email !== '') config.email = email

    if (oldPassword !== '' && password !== '' && confirmPassword !== '') {
        config.oldPassword = oldPassword
        config.password = password
        config.confirmPassword = confirmPassword
    }

    if (oldPassword !== '' && (password === '' || confirmPassword === '')) {
        return Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Insira a nova senha',
            showConfirmButton: true
        })
    }

    if (oldPassword === '' && (password !== '' || confirmPassword !== '')) {
        return Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Insira a senha atual',
            showConfirmButton: true
        })
    }

    await api.put(`/company/${companyId}`, config).then(res => {
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Perfil editado com sucesso',
            showConfirmButton: true
        }).then(() => window.location.href = './dashboard.html')
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

const deleteCompany = async (event) => {
    event.preventDefault()

    const swalWithBootstrapButtons = Swal.mixin({
        customClass: {
            confirmButton: 'btn btn-success',
            cancelButton: 'btn btn-danger'
        },
        buttonsStyling: false
    })

    swalWithBootstrapButtons.fire({
        title: 'Tem certeza?',
        text: "Não será possível reverter!",
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sim, pode deletar!',
        cancelButtonText: 'Cancelar!',
        reverseButtons: true
    }).then((result) => {
        if (result.isConfirmed) {
            api.delete(`/company/${companyId}`).then(res => {
                localStorage.clear()
                swalWithBootstrapButtons.fire(
                    'Deletado!',
                    'Seu perfil foi deletado :(.',
                    'success'
                ).then(() => window.location.href = './companyLogin.html')
            }).catch(err => {
                const { error } = err.response.data
                swalWithBootstrapButtons.fire(
                    error,
                    'Cancelado',
                    'error'
                )
            })
        }
    })
}