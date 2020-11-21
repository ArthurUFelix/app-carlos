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
            title: 'User registered',
            showConfirmButton: false,
            timer: 1200
        }).then(() => window.location.href = './enterQueue.html')
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

const user = JSON.parse(localStorage.getItem('user'))

const userId = user.id

const enterQueue = async (event) => {
    event.preventDefault()

    const ingressCode = document.getElementById('ingressCode').value

    const config = {
        ingressCode
    }

    const responseEnterQueue = await api.post(`/user/${userId}`, config)

    alert('Entered in Queue')

    const queueId = responseEnterQueue.data.position.queueId

    localStorage.setItem('queueId', JSON.stringify(queueId))

    window.location.href = './viewQueue.html'
}

const clearInfo = async (event) => {
    event.preventDefault()

    if (window.confirm("Do you really want to leave?")) {
        const user = JSON.parse(localStorage.getItem('user'))

        const userId = user.id

        await api.delete(`/user/${userId}`)

        localStorage.clear()

        window.location.href = './userRegister.html'
    }
}
