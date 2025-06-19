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