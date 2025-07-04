import { Locator, Page } from "@playwright/test";


export class SendTransferModal {

    readonly page: Page;
    readonly receiverEmailInput: Locator;
    readonly sourceAccountComboBox: Locator;
    readonly amountToTransferInput: Locator;
    readonly sendButton: Locator;


    constructor(page: Page){

        this.page = page;
        this.receiverEmailInput = page.getByRole('textbox', {name: 'Email del destinatario *'});
        this.sourceAccountComboBox = page.getByRole('combobox', { name: 'Cuenta origen *' });
        this.amountToTransferInput = page.getByRole('spinbutton', { name: 'Monto a enviar *' });
        this.sendButton = page.getByTestId('boton-enviar');
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
