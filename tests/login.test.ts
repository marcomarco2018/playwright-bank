import {test, expect} from "@playwright/test";
import { LoginPage } from "../pages/loginPage";
import  TestData  from "../data/testData.json"; // Add this import if TestData is exported from a file
import { DashboardPage } from "../pages/DashboardPage";

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
