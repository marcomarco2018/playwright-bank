import { test as setup, expect } from "@playwright/test";
import { BackendUtils } from "../utils/backendUtils";
import { LoginPage } from "../pages/loginPage";
import { DashboardPage } from "../pages/DashboardPage";
import { CreateAccountModal } from "../pages/CreateAccountModal";
import TestData from "../data/testData.json";

let loginPage: LoginPage;
let dashboardPage: DashboardPage;
let createAccountModal: CreateAccountModal;

const userSendingAuthFile = 'playwright/.auth/userSending.json';
const userReceivingAuthFile = 'playwright/.auth/userReceiving.json';

setup.beforeEach(async ({page}) => {
    loginPage = new LoginPage(page);
    dashboardPage = new DashboardPage(page);
    createAccountModal = new CreateAccountModal(page);
    
    await loginPage.visitLoginPage();
})





setup('Generate user that sends the money', async ({page, request}) => {
    
    const newUser = await BackendUtils.createNewUserByAPI(request, TestData.validUser );
    await loginPage.submitLoginForm(newUser);
    await dashboardPage.clickCreateAccountButton();
    await createAccountModal.selectAccountType('Débito');
    await createAccountModal.enterAmount('1000');
    

    await createAccountModal.clickCreateAccountButton();
    await expect(page.getByText('Cuenta creada exitosamente')).toBeVisible();
    await page.context().storageState({ path: userSendingAuthFile });
    //await page.waitForTimeout(5000);
   
})


setup('Login with user that receives the money', async ({page, request}) => {
    
    
    await loginPage.submitLoginForm(TestData.validUser);
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await page.context().storageState({ path: userReceivingAuthFile });
    
   
})
