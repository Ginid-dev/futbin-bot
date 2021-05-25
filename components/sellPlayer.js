const { players } = require("../config/player.json");
const transferButton =
  "body > main > section > nav > button.ut-tab-bar-item.icon-transfer";

let playerInList = [];

module.exports = async (page) => {
  try {
    page.on("response", async (response) => {
      try {
        if (await response.url().endsWith("/tradepile")) {
          const responseData = await response.json();
          if (responseData && responseData.auctionInfo)
            playerInList = responseData.auctionInfo
              .filter((x) => !x.untradeable)
              .map((x) => x.itemData.resourceId);

          if (playerInList && playerInList.length) {
            const playerCurrentPrice = players.filter(
              (x) => resource_id == x.playerInList[0]
            );

            if (playerCurrentPrice && playerCurrentPrice.length)
              await sellPlayers(page, playerCurrentPrice[0].price);
          }
        }
      } catch (error) {
        return;
      }
    });
  } catch (error) {
    console.log("Error on Selling");
    console.log(error);
  }
};

const sellPlayers = async (page, playerCurrentPrice) => {
  try {
    // Click on the transfer button
    await page.waitForSelector(transferButton, { timeout: 0 });
    await page.waitForTimeout(5000);
    await page.click(transferButton);

    // Goto transfer list
    await page.waitForTimeout(3000);
    const transferList = await page.$x(
      "/html/body/main/section/section/div[2]/div/div/div[3]"
    );
    await transferList[0].click();

    // Click/Select on the player in OGG Unsold list
    await page.waitForTimeout(1200);
    await page.waitForSelector("li.listFUTItem.expired");
    await page.click("li.listFUTItem.expired");

    // Click on Put back to the market Button
    await page.waitForTimeout(1200);
    await page.waitForSelector(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > section > div > div > div.DetailPanel > div.ut-quick-list-panel-view > div.ut-button-group > button"
    );
    await page.click(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > section > div > div > div.DetailPanel > div.ut-quick-list-panel-view > div.ut-button-group > button"
    );

    // Enter Initial price
    await page.evaluate((playerCurrentPrice) => {
      document.querySelector(
        "body > main > section > section > div.ut-navigation-container-view--content > div > div > section > div > div > div.DetailPanel > div.ut-quick-list-panel-view > div.panelActions.open > div:nth-child(2) > div.ut-numeric-input-spinner-control > input"
      ).value = playerCurrentPrice;
    }, playerCurrentPrice);

    await page.click(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > section > div > div > div.DetailPanel > div.ut-quick-list-panel-view > div.panelActions.open > div:nth-child(2) > div.ut-numeric-input-spinner-control > button.btn-standard.decrement-value"
    );

    // Enter Buy now price
    await page.evaluate((playerCurrentPrice) => {
      document.querySelector(
        "body > main > section > section > div.ut-navigation-container-view--content > div > div > section > div > div > div.DetailPanel > div.ut-quick-list-panel-view > div.panelActions.open > div:nth-child(3) > div.ut-numeric-input-spinner-control > input"
      ).value = playerCurrentPrice;
    }, playerCurrentPrice);
    await page.$eval(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > section > div > div > div.DetailPanel > div.ut-quick-list-panel-view > div.panelActions.open > div:nth-child(3) > div.ut-numeric-input-spinner-control > input",
      (e) => e.blur()
    );

    // Click on the Put on the Market
    await page.click(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > section > div > div > div.DetailPanel > div.ut-quick-list-panel-view > div.panelActions.open > button"
    );
  } catch (error) {
    console.log("Error on selling");
    console.log(error);
  }
};
