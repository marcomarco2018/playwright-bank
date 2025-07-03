import { Locator, Page } from "@playwright/test";


export class CreateAccountModal {

    readonly page: Page;
    readonly AccountTypeComboBox: Locator;
    readonly AccountTypeOption: Locator;
    readonly InitialAmountInput:Locator;
    readonly CreateAccountButton:Locator;
    readonly CancelAccountCreationButton:Locator;

    constructor(page: Page){

        this.page = page;
        this.AccountTypeComboBox = page.getByRole('combobox', {name: 'Tipo de Cuenta *'});
        this.InitialAmountInput = page.getByRole('spinbutton', {name: 'Monto Inicial *'});
        this.CreateAccountButton = page.getByTestId('boton-crear-cuenta');
        this.CancelAccountCreationButton = page.getByTestId('boton-cancelar-crear-cuenta');
    }


    async selectAccountType(accountType: string){
        await this.AccountTypeComboBox.click();

        try {

            await this.page.getByRole('option', {name: accountType}).click();
            
        } catch (error) {
            console.log(`element not found: ${error}`)
        }
    
    }

    async enterAmount(amount: string){
        await this.InitialAmountInput.fill(amount);
    }

    async clickCreateAccountButton(){
        await this.CreateAccountButton.click();
    }

    async clickCancelAccountCreationButton(){
        await this.CancelAccountCreationButton.click();
    }




} 
