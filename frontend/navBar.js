const company = JSON.parse(localStorage.getItem("company"));

const token = company.token;
const companyId = company.company.id;

api.defaults.headers = {
  "Content-Type": "application/json",
  Authorization: `Bearer ${token}`,
};

api
  .get(`/company/${companyId}`)
  .then((res) => {
    const company = res.data;
    const companyHeader = (
      `
      <div class="px-0 bg-warning navbar-wrap mb-2">
        <div class="container">
          <div class="row">
            <div class="col-md-12">
              <nav class="navbar px-0 navbar-expand-lg navbar-light">
                <img src="./assets/logo.png" width="10%"/>
                <a class="navbar-brand" href="./dashboard.html">
                  Bem vindo(a)
                  <strong> ${company.name} </strong>
                  <h6>${company.email}</h6>
                </a>
                <button
                  class="navbar-toggler"
                  type="button"
                  data-toggle="collapse"
                  data-target="#navbarsExample06"
                  aria-controls="navbarsExample06"
                  aria-expanded="false"
                  aria-label="Toggle navigation"
                >
                  <span class="oi oi-menu"></span>
                </button>

                <div class="collapse navbar-collapse" id="navbarsExample06">
                  <ul class="navbar-nav ml-auto">
                    <li class="nav-item d-flex">
                      <a
                        href="./manageQueues.html"
                        onclick="manageQueues(event)"
                        class="nav-link d-flex align-items-center icon"
                      >
                        <i class="ion-md-albums"></i>
                        <span class="profile">Filas</span>
                      </a>
                    </li>
                    <li class="nav-item d-flex">
                      <a
                        href="./manageCompany.html"
                        onclick="manageCompany(event)"
                        class="nav-link d-flex align-items-center icon"
                      >
                        <i class="ion-ios-contact"></i>
                        <span class="profile">Profile</span>
                      </a>
                    </li>
                    <li class="nav-item d-flex">
                      <a
                        href="#"
                        onclick="logout(event)"
                        class="nav-link d-flex align-items-center icon"
                      >
                        <i class="ion-ios-log-out"></i>
                        <span class="profile">Sair</span>
                      </a>
                    </li>
                  </ul>
                </div>
              </nav>
            </div>
          </div>
        </div>
      </div>
      `
    );
    document.body.insertAdjacentHTML("afterbegin", companyHeader);
  })
  .catch((err) => {
    const { error } = err.response.data;
    document.body.insertAdjacentHTML("afterbegin", error);
  });

const logout = (event) => {
  event.preventDefault();
  localStorage.clear("company");
  window.location.href = "./companyLogin.html";
};
