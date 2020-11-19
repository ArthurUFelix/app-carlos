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

        const swalWithBootstrapButtons = Swal.mixin({
            customClass: {
                confirmButton: 'btn btn-success',
                cancelButton: 'btn btn-danger'
            },
            buttonsStyling: false
        })

        swalWithBootstrapButtons.fire({
            title: 'Tem certeza?',
            text: "Não será possível reverter",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, retirar da fila!',
            cancelButtonText: 'Cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/user/${userId}`).then(res => {
                    localStorage.clear()
                    swalWithBootstrapButtons.fire(
                        'You are out!',
                        'Left from Queue.',
                        'success'
                    ).then(() => window.location.href = './userRegister.html')
                }).catch(err => {
                    const { error } = err.response.data
                    swalWithBootstrapButtons.fire(
                        'Cancelled',
                        error,
                        'error'
                    )
                })
            }
        })
    }