import { Locator, Page } from "@playwright/test";


export class DashboardPage {


    readonly page: Page;
    readonly dashboardTitle: Locator;
    readonly createAccountButton: Locator;
    readonly SendMoneyButton: Locator;
    readonly elementsFromTransferList: Locator;
    readonly elementsFromAmountsList: Locator;

    constructor(page: Page) {
        this.page = page;
        this.dashboardTitle = page.getByTestId('titulo-dashboard');
        this.createAccountButton = page.getByTestId('tarjeta-agregar-cuenta');
        this.SendMoneyButton = page.getByTestId('boton-enviar');
        this.elementsFromTransferList = page.getByTestId('descripcion-transaccion');
        //other option to locate the transfer list items
        //this.elementsFromTransferList = page.locator('[data-testid="descripcion-transaccion"]');
        this.elementsFromAmountsList = page.getByTestId('monto-transaccion');
        //data-testid="monto-transaccion"
    }


    async visitDashboardPage(): Promise<void> {
        await this.page.goto('http://localhost:3000/dashboard');
        await this.page.waitForLoadState('networkidle');
    }


    async clickCreateAccountButton(): Promise<void> {
        await this.createAccountButton.click();
    }

}