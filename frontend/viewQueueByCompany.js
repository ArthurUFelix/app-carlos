const queueId = JSON.parse(localStorage.getItem('queueId'))


api.get(`/user/queue/${queueId}`).then(res => {
    for (i = 0; i < res.data.length; i++) {
        const { position, userId } = res.data[i]

        api.get(`/user/${userId}`).then(res => {
            const { name } = res.data
            const { phone } = res.data
            const userInfo =
                `
                    <div class="list-users">
                    <div class="card">
                    <div class="card-content">
                            <div class="card-body cleartfix">
                            <div class="media align-items-stretch">
                                <div class="align-self-center">
                                    <h1 class="mr-2">Posição: <strong>${position}</strong></h1>
                                </div>
                                <div class="media-body">
                                    <h4>${name}</h4>
                                </div>
                                <div class="align-self-center">
                                   <h4>${phone}</h4> 
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div> 
           `
            document.body.insertAdjacentHTML('beforeEnd', `<ul>${userInfo}<ul>`)
        }).catch(err => {
            const { error } = err.response.data
            Swal.fire({
                position: 'top-right',
                icon: 'error',
                title: error,
                toast: true,
                showConfirmButton: false,
                timer: 3000
            })
        })
    }
}).catch(err => {
    const { error } = err.response.data
    Swal.fire({
        position: 'top-right',
        icon: 'error',
        title: error,
        toast: true,
        showConfirmButton: false,
        timer: 3000
    })
})