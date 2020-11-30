describe("Company Register", () => {
    beforeEach(() => {
        cy.visit("./frontend/companyRegister.html");
      });

    const name = "Teste2"
    const email = "teste2@email.com";
    const password = "1234";
    const registeredEmail = "teste2@email.com";
    const invalidEmailFormat = "teste";
    
    it("Successfully registered", () => {
        cy.get('[id="name"]').type(name);
        cy.get('[id="email"]').type(email);
        cy.get('[id="password"]').type(password);
        cy.get('[id="register-btn"]').click()
        cy.document().should("contain.text", "Empresa cadastrada com sucesso")
    })

    it("E-mail already registered", () => {
        cy.get('[id="name"]').type(name);
        cy.get('[id="email"]').type(registeredEmail);
        cy.get('[id="password"]').type(password);
        cy.get('[id="register-btn"]').click()
        cy.document().should("contain.text", "E-mail já cadastrado")
    })


    it("Register with invalid e-mail format", () => {
        cy.get('[id="name"]').type(name);
        cy.get('[id="email"]').type(invalidEmailFormat);
        cy.get('[id="password"]').type(password);
        cy.get('[id="register-btn"]').click()
        cy.document().should("contain.text", "Erro de validação")
    })

    it("Register with missing required data", () => {
        cy.get('[id="email"]').type(email);
        cy.get('[id="password"]').type(password);
        cy.get('[id="register-btn"]').click()
        cy.document().should("contain.text", "Erro de validação")
    })

})