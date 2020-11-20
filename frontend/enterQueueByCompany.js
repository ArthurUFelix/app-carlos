const user = JSON.parse(localStorage.getItem('user'))

const userId = user.id

const enterQueue = async (event) => {
    event.preventDefault()

    const ingressCode = document.getElementById('ingressCode').value

    const config = {
        ingressCode
    }

    await api.post(`/user/${userId}`, config).then(res => {
        const { queueId } = res.data.position
        localStorage.setItem('queueId', JSON.stringify(queueId))
        Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Cliente inserido na fila',
            showConfirmButton: false,
            timer: 1200
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

const clearInfo = async (event) => {
    event.preventDefault()

    await api.delete(`/user/${userId}`).then(res => {
        localStorage.removeItem('user')
        window.location.href = './userRegisterByCompany.html'
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
