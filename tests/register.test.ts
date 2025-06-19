import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/registerPage";
import Testdata from "../data/testData.json"; // Ensure this path is correct based on your project structure

let registerPage: RegisterPage;



test.beforeEach(async ({ page }) => {
    registerPage = new RegisterPage(page);
    await registerPage.visitRegisterPage();
});

test('TC-1 Verify visual elements on the registration form', async ({ page }) => {

    await expect(registerPage.firstNameInput).toBeVisible();
    await expect(registerPage.lastNameInput).toBeVisible();     
    await expect(registerPage.emailInput).toBeVisible();
    await expect(registerPage.passwordInput).toBeVisible(); 
    await expect(registerPage.registerButton).toBeVisible();
    
});

test('TC-2 Verify registratio button is disabled when form is empty', async ({ page }) => {

    await expect(registerPage.registerButton).toBeDisabled();
});

test('TC-3 Verify registration button is enabled when form is filled', async ({ page }) => {

    await registerPage.completeRegisterForm(Testdata.validUser);
    await expect(registerPage.registerButton).toBeEnabled();

});

test('TC-4 Verify successful registration with valid data', async ({page})=>{

    test.slow(); // Slow down the test for better visibility, can be removed later

// const email = `testuser${Date.now()}@example.com`; // Generate a unique email for each test run
    const email = Testdata.validUser.email.split('@')[0] + Date.now().toString() + '@' + Testdata.validUser.email.split('@')[1]; // Ensure unique email for each test run 
    Testdata.validUser.email = email; // Update the email in Testdata
    await registerPage.submitRegisterForm(Testdata.validUser);
    await expect(page.getByText('Registro exitoso')).toBeVisible();

});

test('TC-5 Verify error message for existing email', async ({ page }) => {
   const email = Testdata.validUser.email.split('@')[0] + Date.now().toString() + '@' + Testdata.validUser.email.split('@')[1]; // Ensure unique email for each test run 
    Testdata.validUser.email = email; // Update the email in Testdata
    await registerPage.submitRegisterForm(Testdata.validUser);
    await expect(page.getByText('Registro exitoso')).toBeVisible();
    await registerPage.visitRegisterPage();
    await registerPage.submitRegisterForm(Testdata.validUser);
    await expect(page.getByText('Email already in use')).toBeVisible();
    await expect(page.getByText('Registro exitoso')).not.toBeVisible();


});









