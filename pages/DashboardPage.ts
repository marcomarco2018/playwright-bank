import { Locator, Page } from "@playwright/test";


export class DashboardPage {


    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly createAccountButton: Locator;
    readonly SendMoneyButton: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByTestId('titulo-dashboard');
        this.createAccountButton = page.getByTestId('tarjeta-agregar-cuenta');
        this.SendMoneyButton = page.getByTestId('boton-enviar');
    }



    async visitDashboardPage(): Promise<void> {
        await this.page.goto('http://localhost:3000/dashboard');
        await this.page.waitForLoadState('networkidle');
    }


    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }

}