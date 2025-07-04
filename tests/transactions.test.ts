import { expect, test } from "@playwright/test";
import { DashboardPage } from "../pages/DashboardPage";

let dashboardPage: DashboardPage;



const testUserSending = test.extend({

    storageState: require.resolve('../playwright/.auth/userSending.json'),
    
});

const testUserReceiving = test.extend({

    storageState: require.resolve('../playwright/.auth/userReceiving.json'),
    
});

test.beforeEach(async ({page}) => {
    dashboardPage = new DashboardPage(page);
    await dashboardPage.visitDashboardPage();
})


testUserSending('TC-1 Verify successful transaction', async ({page}) => {

    
    await expect(dashboardPage.dashboardTitle).toBeVisible();
    await dashboardPage.SendMoneyButton.click();
    await page.waitForTimeout(5000);

})
