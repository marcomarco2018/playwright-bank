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


test('Verify successful login with valid credentials', async({page}) => {

    await loginPage.submitLoginForm(TestData.validUser);
    await expect(page.getByText('Inicio')).toBeVisible();
    await expect(dashboardPage.dashboardTitle).toBeVisible();
})


test('TC-2 Verify User is redirected to the registration page when clicking on the register link', async ({page}) => {

     await loginPage.clickRegisterLink();
    

})


    test('Verfiy Create Account buttons is visible and redirects to the registration page', async ({page}) => {

        await expect(loginPage.createAccountButton).toBeVisible();
        await loginPage.clickCreateAccountButton();
        await expect(page).toHaveURL('http://localhost:3000/signup');
         
    })



    test('Login with new user created via backend', async ({page, request}) => {


        const newUser = await BackendUtils.createNewUserByAPI(request, TestData.validUser)
        console.log(newUser);

        await loginPage.submitLoginForm(newUser);

        await expect(page.getByText("Inicio")).toBeVisible();
        await expect(dashboardPage.dashboardTitle).toBeVisible(); 


    

    })


    test('Validate response status and body by intercepting request via front end', async ({page, request})=> {

       const newUser = await BackendUtils.createNewUserByAPI(request, TestData.validUser);

       const responsePromiseLogin = page.waitForResponse('http://localhost:4000/api/auth/login')

       await loginPage.submitLoginForm(newUser);

       const responseLogin = await responsePromiseLogin;

       const responseBodyLogin = await responseLogin.json(); 

       console.log(responseBodyLogin)

       expect(responseLogin.status()).toBe(200);

       expect(responseBodyLogin).toHaveProperty('token');
       expect(typeof responseBodyLogin.token).toBe('string');
       expect(responseBodyLogin).toHaveProperty('user');


       //when I pass a raw object it expects an exact match
       
       expect(responseBodyLogin.user).toEqual({

        id: expect.any(String),
        firstName: TestData.validUser.firstName,
        lastName: TestData.validUser.lastName,
        email: newUser.email
       })

        

 // here I do not pass the raw object I pass another matcher that only require contains, meaning partially match.

    expect(responseBodyLogin.user).toEqual(expect.objectContaining({ 
    id: expect.any(String),
    firstName: TestData.validUser.firstName,
    //lastName: TestData.validUser.lastName, <- notice this property is not contained in the response body
    email: newUser.email,
   }))

  } );








      

      

// } )



    
   

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
