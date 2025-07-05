import { expect, test } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { SendTransferModal } from "../pages/sendTransferModal";
import Testdata from "../data/testData.json";


let dashboardPage: DashboardPage;
let sendTransferModal: SendTransferModal;


const testUserSending = test.extend({

    storageState: require.resolve('../playwright/.auth/userSending.json'),
    
});

const testUserReceiving = test.extend({

    storageState: require.resolve('../playwright/.auth/userReceiving.json'),
    
});

test.beforeEach(async ({page}) => {
    dashboardPage = new DashboardPage(page);
    sendTransferModal = new SendTransferModal(page);
    await dashboardPage.visitDashboardPage();
})


testUserSending('TC-1 Verify successful sent transaction', async ({page}) => {

    
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await dashboardPage.SendMoneyButton.click();
    await page.waitForTimeout(5000);
    await sendTransferModal.sendTransfer(Testdata.validUser.email, '100');
    await expect(page.getByText('Transferencia enviada a')).toBeVisible();
   // await page.waitForTimeout(5000);
   

})

testUserReceiving('TC-2 Verify successful receivedtransaction', async ({page}) => {

    
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await expect(page.getByText('Transferencia de').first()).toBeVisible();

   

})

