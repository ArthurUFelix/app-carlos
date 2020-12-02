describe("Company Login", () => {
    beforeEach(() => {
        cy.visit("./frontend/companyLogin.html");
      });

    const email = "teste@email.com";
    const password = "1234";
    const invalidEmailFormat = "teste";
    const invalidEmail = "testeinvalido@email.com";
    const invalidPassword = "invalid1234";
    
    it("Successful login", () => {
        cy.get('[id="email"]').type(email);
        cy.get('[id="password"]').type(password);
        cy.get('[id="login-btn"]').click()
        cy.document().should("contain.text", "Logado com sucesso")
    })

    it("Login with invalid password", () => {
        cy.get('[id="email"]').type(email);
        cy.get('[id="password"]').type(invalidPassword);
        cy.get('[id="login-btn"]').click()
        cy.document().should("contain.text", "Senha incorreta")
    })

    it("Login with invalid e-mail", () => {
        cy.get('[id="email"]').type(invalidEmail);
        cy.get('[id="password"]').type(password);
        cy.get('[id="login-btn"]').click()
        cy.document().should("contain.text", "Usuário não encontrado")
    })

    it("Login with invalid e-mail format", () => {
        cy.get('[id="email"]').type(invalidEmailFormat);
        cy.get('[id="password"]').type(password);
        cy.get('[id="login-btn"]').click()
        cy.document().should("contain.text", "Erro de validação")
    })

    it("Login with missing password", () => {
        cy.get('[id="email"]').type(email);
        cy.get('[id="login-btn"]').click()
        cy.document().should("contain.text", "Erro de validação")
    })

    it("Login with missing e-mail", () => {
        cy.get('[id="password"]').type(password);
        cy.get('[id="login-btn"]').click()
        cy.document().should("contain.text", "Erro de validação")
    })
})