import { Locator, Page } from '@playwright/test';

export class LoginPage {
    readonly page: Page;
    readonly emailInput: Locator;
    readonly passwordInput: Locator;
    readonly loginButton: Locator;
    readonly registerLink: Locator;
    readonly createAccountButton: Locator;



    constructor(page: Page){
        this.page = page;
        this.emailInput = page.locator('input[name="email"]');
        this.passwordInput = page.locator('input[name="password"]');
        this.loginButton = page.getByTestId('boton-login');
        this.registerLink = page.getByTestId('link-registrarse-login');
        this.createAccountButton = page.getByTestId('boton-signup-header');
        
    }


    async visitLoginPage() {
        await this.page.goto('http://localhost:3000/login');
        await this.page.waitForLoadState('networkidle');
    }   


    async CompleteLoginForm(user: {email: string, password: string}): Promise<void> {
        await this.emailInput.fill(user.email);
        await this.passwordInput.fill(user.password);
        
    }

    async clickLoginButton(): Promise<void> {
        await this.loginButton.click();
    }

    async submitLoginForm(user: {email: string, password: string}): Promise<void> {

        await this.CompleteLoginForm(user);
        await this.clickLoginButton();
    }

    //ASK IF IT IS OK TO HAVE A METHOD FOR INVALID CREDENTIALS. 

    async clickRegisterLink(): Promise<void> {
        await this.registerLink.click();

    }

    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }







}
