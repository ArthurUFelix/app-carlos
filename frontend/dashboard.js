const manageCompany = (event) => {
  event.preventDefault();

  window.location.href = "./manageCompany.html";
};

const manageQueues = (event) => {
  event.preventDefault();

  window.location.href = "./manageQueues.html";
};

const formatDate = (fullDate) => {
  const date = new Date(fullDate);

  const month = date.getMonth() + 1;
  const year = date.getFullYear();
  const day = date.getDate();
  const [time] = date.toTimeString().split("G");

  return day + "/" + month + "/" + year + " às " + time.substring(0, 5);
};

const viewQueue = async (event) => {
  event.preventDefault()
  const queueId = document.getElementById('queueId').value
  localStorage.setItem('queueId', JSON.stringify(queueId))   
  window.location.href = './viewQueueByCompany.html'

}

const userRegister = (event) => {
  event.preventDefault()
  window.location.href = './userRegisterByCompany.html'
}

const handleUserFromQueue = async (event, queueId) => {
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
      text: "Confirme para chamar o próximo da fila!",
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Chamar o próximo',
      cancelButtonText: 'Cancelar!',
      reverseButtons: true
  }).then((result) => {
      if (result.isConfirmed) {
              api.post(`/queue/${queueId}/user`).then(res => {
              const { message } = res.data
              const { userId } = res.data.handledPosition

              api.get(`/user/${userId}`).then(res => {
                  const { name, phone } = res.data
                  Swal.fire({
                      position: 'center',
                      icon: 'success',
                      title: message,
                      html: `Nome: ${name} <br> Celular: ${phone}`,
                      showConfirmButton: true
                  })
              }).catch(err => {
                  const { error } = err.response.data
                  Swal.fire({
                      position: 'center',
                      icon: 'error',
                      title: 'User error:',
                      text: error,
                      showConfirmButton: true
                  })
              })
          }).catch(err => {
              const { error } = err.response.data
              Swal.fire({
                  position: 'center',
                  icon: 'error',
                  title: 'Erro na operação:',
                  text: error,
                  showConfirmButton: true
              })
          })      
      }
  })
}

const deleteCompany = async (event) => {
  event.preventDefault();

  if (window.confirm("Are you sure?")) {
    await api.delete(`/company/${companyId}`);

    window.location.href = "./companyLogin.html";
  }
};

api
  .get("/queue")
  .then((res) => {
    const queues = res.data.reduce(
      (html, queue) =>
        html +
        `<div class="blog-card">
                    <input type="radio" name="select" id="tap-1" checked>
                    <input type="checkbox" id="imgTap">
                    <div class="sliders">              
                    </div>
                    <div class="inner-part">
                    <label for="imgTap" class="img">
                        <img class="img-1" src="./assets/mobile.svg">
                    </label>
                    <div class="content content-1">
                        <span>${formatDate(queue.startTime)}</span>
                        <div class="text">Senha da Fila: <strong> ${
                          queue.ingressCode
                        } </strong></div>
                        <div class="text">Observação: ${queue.observation}</div>
                        <div class="text">Número da fila:<strong> ${
                          queue.id
                        } </strong></div>
                        <button onclick="handleUserFromQueue(event, ${
                          queue.id
                        })">Chamar o próximo! :)</button>
                    </div>
                    </div>
                 </div>` +
        `<br>`,
      ""
    );
    document.body.insertAdjacentHTML("beforeEnd", `<ul>${queues}</ul>`);
  })
  .catch((err) => {
    const { error } = err.response.data;
    document.body.insertAdjacentHTML("beforeEnd", error);
  });
