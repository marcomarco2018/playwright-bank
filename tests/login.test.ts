import {test, expect} from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import  TestData  from "../data/testData.json"; // Add this import if TestData is exported from a file
import { DashboardPage } from "../pages/DashboardPage";
import { BackendUtils } from "../utils/backendUtils";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;




test.beforeEach(async ({page}) => {

    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    await loginPage.visitLoginPage();

})


test('TC-1 Vefify successful login using valid credentials', async ({page}) => {

  console.log("TC-1 Vefify successful login using valid credentials");

        await loginPage.submitLoginForm(TestData.validUser);
        await expect(page.getByText('Inicio de sesión exitoso')).toBeVisible();  
        await expect(dashboardPage.dashboardTitle).toBeVisible();
    
})

test('TC-2 Verify User is redirected to the registration page when clicking on the register link', async ({page}) => {

     await loginPage.clickRegisterLink();
    await expect(page).toHaveURL('http://localhost:3000/signup'); 

})

test('TC-3 Verify Create Account button is visible on the login page', async ({page}) => {

    await expect(loginPage.createAccountButton).toBeVisible();
    
})



test('TC-4 Verify clicking on Create Account button redirects to the registration page', async ({page}) => {
    await loginPage.clickCreateAccountButton();
    await expect(page).toHaveURL('http://localhost:3000/signup'); 

}) 

test('TC5 Log in with new user created via backend', async ({page, request}) => {

    const newUser = await BackendUtils.createNewUserByAPI(request, TestData.validUser );
    console.log(newUser);

   const responsePromiseLogin = page.waitForResponse('http://localhost:4000/api/auth/login');

   await loginPage.submitLoginForm(newUser);
   const responseLogin = await responsePromiseLogin;
   const responseBodyLoginJSon  = await responseLogin.json();
   
   expect(responseLogin.status()).toBe(200);
   expect(responseBodyLoginJSon).toHaveProperty('token');
   expect(typeof responseBodyLoginJSon.token).toBe('string');
   expect(responseBodyLoginJSon).toHaveProperty('user');
   expect(responseBodyLoginJSon.user).toEqual(expect.objectContaining({ 
    id: expect.any(String),
    firstName: TestData.validUser.firstName,
    lastName: TestData.validUser.lastName, 
    email: newUser.email,
   }
)
    
   )
})

test('TC-6 Should display an error if the email input is not entered', async ({page}) => {

    await loginPage.passwordInput.fill('123456');

    // we ignore the email input

    // we try to send the form 
    await loginPage.clickLoginButton();
    await expect(loginPage.emailInput).toBeEmpty();
    await expect(loginPage.emailInput).toHaveJSProperty('validationMessage', 'Please fill out this field.');

})
test('TC-7 Evaluate wrong email format message', async ({page}) => {

    

    await loginPage.emailInput.fill('invalid-email-format');

    await loginPage.clickLoginButton;

    const message = await loginPage.emailInput.evaluate((input) => (input as HTMLInputElement).validationMessage);
    
    expect(message).toContain("Please include an '@' in the email address");
    

})
