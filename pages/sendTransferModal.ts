import { Locator, Page } from "@playwright/test";


export class SendTransferModal {

    readonly page: Page;
    readonly receiverEmailInput: Locator;
    readonly sourceAccountComboBox: Locator;
    readonly sourceAccountOption: Locator;
    readonly amountToTransferInput: Locator;
    readonly CancelButton: Locator;
    readonly sendButton: Locator;


    constructor(page: Page){

        this.page = page;
        this.receiverEmailInput = page.getByRole('textbox', {name: 'Email del destinatario *'});
        this.sourceAccountComboBox = page.getByRole('combobox', { name: 'Cuenta origen *' });
        this.amountToTransferInput = page.getByRole('spinbutton', { name: 'Monto a enviar *' });
        this.CancelButton = page.getByRole('button', { name: 'Cancelar' });
        this.sendButton = page.getByRole('button', { name: 'Enviar' });
        this.sourceAccountOption = page.getByRole('option', { name: '••••' });
    }

    async sendTransfer(ReceiverEmail: string,amount: string){
        await this.receiverEmailInput.fill(ReceiverEmail);
        await this.sourceAccountComboBox.click();
        await this.sourceAccountOption.first().click();
        await this.amountToTransferInput.fill(amount);
        await this.sendButton.click();
    }


}