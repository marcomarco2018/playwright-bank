import { test, expect } from "@playwright/test";
import { RegisterPage } from "../pages/registerPage";
import Testdata from "../data/testData.json"; // Ensure this path is correct based on your project structure
import { generateRandomEmail } from "../utils/randomEmail";



let registerPage: RegisterPage;

//test.use({ viewport: null, launchOptions: { slowMo: 3000, args: ['--start-maximized'] } });


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



test('TC-2 Verify registration button is disabled when form is empty', async ({ page }) => {

    await expect(registerPage.registerButton).toBeDisabled();
});



test('TC-3 Verify registration button is enabled when form is filled', async ({ page }) => {

    await registerPage.completeRegisterForm(Testdata.validUser);
    await expect(registerPage.registerButton).toBeEnabled();

});


test('verify successfull registration with valid data', async ( {page} ) => {
    test.slow(); // Slow down the test for better visibility, can be removed later

    // const email = `testuser${Date.now()}@example.com`; // Generate a unique email for each test run
    const email = generateRandomEmail(Testdata.validUser.email);
    Testdata.validUser.email = email;
    await registerPage.submitRegisterForm(Testdata.validUser); 
    await expect(page.getByText('Registro exitoso')).toBeVisible();
    await expect(page).toHaveURL('http://localhost:3000/login');
    
})



test('Verify error message for existing email', async ({page }) => {

    const email = generateRandomEmail(Testdata.validUser.email); 
    Testdata.validUser.email = email;
    await registerPage.submitRegisterForm(Testdata.validUser);
    await expect(page.getByText('Registro exitoso')).toBeVisible();
    await registerPage.visitRegisterPage();
    await registerPage.submitRegisterForm(Testdata.validUser); 
    await expect(page.getByText('Email already in use')).toBeVisible();
    await page.waitForTimeout(2000); // Wait for 2 seconds to see the error message clearly


//const email = 



})




test('TC-6 verify successful registration with valid data verifying the response from the server(API)', async ({ page }) => {

    test.slow(); // Slow down the test for better visibility, can be removed later

    await test.step('Complete the registration form with valid data', async () => {
        const email = Testdata.validUser.email.split('@')[0] + Date.now().toString() + '@' + Testdata.validUser.email.split('@')[1]; // Ensure unique email for each test run
        Testdata.validUser.email = email; // Update the email in Testdata
        await registerPage.completeRegisterForm(Testdata.validUser);

    });

    const responsePromise = page.waitForResponse('**/api/auth/signup'); // Adjust the URL to match your API endpoint
    await registerPage.registerButton.click(); // Click the register button to trigger the API call
    const response = await responsePromise;
    const responseBody = await response.json();

    expect(response.status()).toBe(201); // Check if the response status is 201 Created
    expect(responseBody).toHaveProperty('token'); // Adjust the
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody).toHaveProperty('user'); // Check if the user object is present
    expect(responseBody.user).toEqual(expect.objectContaining({
        id: expect.any(String), // Assuming the user ID is a string
        firstName: Testdata.validUser.firstName,
        lastName: Testdata.validUser.lastName,  
        email: Testdata.validUser.email
        // Add other user properties to check as needed
    }));

    await expect(page.getByText('Registro exitoso')).toBeVisible(); // Verify the success message is displayed 

});


test('TC-7 Generate signup from the API', async ({ page }) => {

    test.slow(); // Slow down the test for better visibility, can be removed later

    const email = Testdata.validUser.email.split('@')[0] + Date.now().toString() + '@' + Testdata.validUser.email.split('@')[1]; // Ensure unique email for each test run
    const response = await page.request.post('http://localhost:4000/api/auth/signup', {

        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json',
        },
        data: {
        
            firstName: Testdata.validUser.firstName,
            lastName: Testdata.validUser.lastName,
            email: email, 
            password: Testdata.validUser.password,

        }
    });  

    const responseBody = await response.json();
    expect(response.status()).toBe(201); // Check if the response status is 201 Created
    expect(responseBody).toHaveProperty('token'); // Check if the token is present      
    expect(typeof responseBody.token).toBe('string');
    expect(responseBody).toHaveProperty('user'); // Check if the user object is present
    expect(responseBody.user).toEqual(expect.objectContaining({
        id: expect.any(String), // Assuming the user ID is a string
        firstName: Testdata.validUser.firstName,
        lastName: Testdata.validUser.lastName,  
        email: email // Use the generated email
        // Add other user properties to check as needed
    }));
});



test('TC-8 Verify how the frontend handles the 500 error from the API', async ({ page }) => {
    
    const email = Testdata.validUser.email.split('@')[0] + Date.now().toString() + '@' + Testdata.validUser.email.split('@')[1]; // Ensure unique email for each test run 

    //intercept the API request to simulate a 500 error
    await page.route('**/api/auth/signup', async (route) => {
        await route.fulfill({
            status: 500,
            contentType: 'application/json',
            body: JSON.stringify({ error: 'Internal Server Error' })
        });
    });

    //fullfill the registration form with valid data, navigation to the registration page is already done in the beforeEach hook
    await registerPage.firstNameInput.fill(Testdata.validUser.firstName);
    await registerPage.lastNameInput.fill(Testdata.validUser.lastName);
    await registerPage.emailInput.fill(email);
    await registerPage.passwordInput.fill(Testdata.validUser.password);
    await registerPage.registerButton.click();

    //verify the proper error message is displayed
  //  await expect(page.getByText('Error al registrar el usuario. Por favor, inténtelo de nuevo más tarde.')).toBeVisible();
    await expect(page.getByText('registro fallido')).toBeVisible(); // Verify the




})
