import { expect, test } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";
import { SendTransferModal } from "../pages/sendTransferModal";
import Testdata from "../data/testData.json";
import fs from 'fs/promises';


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
});


// test that sends money through the API and verifies the transaction in the UI 
testUserReceiving('TC-3 Verify transaction received through API', async ({page, request}) => {

    //preparing for data and token read from sender 


    // read the user data from the file to get the email
    const userSendingData = require.resolve('../playwright/.auth/userSending.data.json');
    const userSendingContentData = await fs.readFile(userSendingData, 'utf-8');
    const userSending = JSON.parse(userSendingContentData);
    const userSendingEmail = userSending.email;

    // now we assert that the email is not empty
    expect(userSendingEmail, "The user sender email was not read correctly from the file").toBeDefined();

    // read the file of auth from the user sending to get his token
    const userSendingAuth = require.resolve('../playwright/.auth/userSending.json');
    const userSendingContentAuth = await fs.readFile(userSendingAuth, 'utf-8');
    const userSendingAuthData = JSON.parse(userSendingContentAuth);
    const userSendingJWT = userSendingAuthData.origins[0]?.localStorage.find(item => item.name === 'jwt')?.value;
    // now we assert that the token is not empty
    expect(userSendingJWT, "The user sender token was not read correctly from the file").toBeDefined();
    const jwt = userSendingJWT;


    // #3 Get the account first and send transfer though the API

    // Get the account of the user sending to no the source account ID

    const accountsResponse = await request.get('http://localhost:4000/api/accounts', {
        headers: {
            'Authorization': `Bearer ${jwt}`
        }
    });

    expect(accountsResponse.ok(), `The accounts response from the API failed: ${accountsResponse.status()}`).toBeTruthy();

    const accountsData = await accountsResponse.json();
    //verify that the accounts data is not empty, at least one account should be present
    expect(accountsData.length, "The accounts data from the API is empty").toBeGreaterThan(0);
    // now we can get the source account ID from the first account
    const sourceAccountId = accountsData[0]._id;

    // generate a random amount 
    const randomAmount = Math.floor(Math.random() * 100) + 1; // random amount between 1 and 100
    console.log(`sending transfer of $${randomAmount} from account: ${sourceAccountId}`)


    // send the transfer through the API
    const transferResponse = await request.post('http://localhost:4000/api/transactions/transfer', {
        headers: {
            'Authorization': `Bearer ${jwt}`
        },
        data: { 
            fromAccountId: sourceAccountId,
            toEmail: Testdata.validUser.email, // fixed email of the user receiving
            amount: randomAmount
        }
});

    expect(transferResponse.ok(), `The transfer response from the API failed: ${transferResponse.status()}`).toBeTruthy();

    // #4 Verify the transaction in the UI, vefify the amount arrived. 

    await page.reload();
    await page.waitForLoadState('networkidle');
    await expect(dashboardPage.dashboardTitle).toBeVisible();
   
    // verify that the transaction is present in the transfer list and the email of the sender is present there in the last transaction
    expect(dashboardPage.elementsFromTransferList.first()).toContainText(userSendingEmail);
    //verify the amount is correct 
    // we use a regex to match the amount in the text content of the first element 

    const montoRegex = new RegExp(String(randomAmount.toFixed(2)));
    console.log(`Verifying the amount of the transaction: ${randomAmount}`);
    expect(dashboardPage.elementsFromAmountsList.first()).toContainText(montoRegex)


     await page.waitForTimeout(5000);

});







