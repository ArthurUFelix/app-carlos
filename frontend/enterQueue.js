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
                title: 'Você entrou na fila :)',
                showConfirmButton: false,
                timer: 1200
            }).then(() => window.location.href = './viewQueue.html')
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
            title: 'Você tem certeza?',
            text: "Você será retirado da fila!",
            icon: 'warning',
            showCancelButton: true,
            confirmButtonText: 'Sim, sair!',
            cancelButtonText: 'Não, cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/user/${userId}`).then(res => {
                    localStorage.clear()
                    swalWithBootstrapButtons.fire(
                        'Você saiu!',
                        '',
                        'success'
                    ).then(() => window.location.href = './userRegister.html')
                }).catch(err => {
                    const { error } = err.response.data
                    swalWithBootstrapButtons.fire(
                        'Cancelado',
                        error,
                        'error'
                    )
                })
            }
        })
    }