const createQueue = async (event) => {
    event.preventDefault();

    const ingressCode = document.getElementById("ingressCode").value;
    const observation = document.getElementById("observation").value;
    const startTime = document.getElementById("startTime").value;
    const endTime = document.getElementById("endTime").value;

    const config = {
        companyId,
        ingressCode,
        observation,
        startTime,
        endTime,
    };
    await api
        .post("/queue", config)
        .then((res) => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Fila criada com sucesso',
                showConfirmButton: true
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
            });
        });
};

const editQueue = async (event) => {
    event.preventDefault()

    const queueId = document.getElementById('editQueueId').value
    const ingressCode = document.getElementById('editIngressCode').value
    const observation = document.getElementById('editObservation').value
    const startTime = document.getElementById('editStartTime').value
    const endTime = document.getElementById('editEndTime').value

    const config = {
        companyId
    }

    if (ingressCode !== '') config.ingressCode = ingressCode
    if (observation !== '') config.observation = observation
    if (startTime !== '') config.startTime = startTime
    if (endTime !== '') config.endTime = endTime

    if (queueId !== '') {
        await api.put(`/queue/${queueId}`, config).then(res => {
            Swal.fire({
                position: 'center',
                icon: 'success',
                title: 'Fila editada com sucesso',
                showConfirmButton: true
            }).then(() => window.location.href = './dashboard.html')
        }).catch(err => {
            const { error } = err.response.data
            const { statusText } = err.response
            Swal.fire({
                position: 'center',
                icon: 'error',
                title: error !== undefined ? error : statusText,
                showConfirmButton: true
            })
        })
    } else {
        Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Por favor, insira o NÚMERO da fila',
            showConfirmButton: true
        })
    }
}

const deleteQueue = (event) => {
    event.preventDefault()

    const queueId = document.getElementById('deleteQueueId').value

    if (queueId !== '') {
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
            confirmButtonText: 'Sim, deletar a fila!',
            cancelButtonText: 'Cancelar!',
            reverseButtons: true
        }).then((result) => {
            if (result.isConfirmed) {
                api.delete(`/queue/${queueId}`).then(res => {
                    swalWithBootstrapButtons.fire(
                        'Deletado!',
                        'Fila deletada com sucesso.',
                        'success'
                    ).then(() => window.location.href = './dashboard.html')
                }).catch(err => {
                    const { error } = err.response.data
                    swalWithBootstrapButtons.fire(
                        'Cancelado:',
                        error,
                        'error'
                    )
                })
            }
        })
    } else {
        return Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Insira o número da fila!',
            showConfirmButton: true
        })
    }
}
