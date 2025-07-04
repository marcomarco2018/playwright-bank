import { Locator, Page } from "@playwright/test";


export class SendTransferModal {

    readonly page: Page;
    readonly receiverEmailInput: Locator;
    readonly sourceAccountComboBox: Locator;
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
    }


}