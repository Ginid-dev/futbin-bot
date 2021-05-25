const { players } = require("../config/player.json");

var currentPlayer = null,
  avaliableCoins = null;

const transferButton =
  "body > main > section > nav > button.ut-tab-bar-item.icon-transfer";

const searchUrl =
  "https://utas.external.s2.fut.ea.com/ut/game/fifa21/transfermarket?num=21&start=0&type=player";

module.exports = async (page) => {
  try {
    await page.waitForSelector(transferButton, { timeout: 0 });
    await page.waitForTimeout(10000);
    await page.click(transferButton);

    // Alter the players HTTP request for a specific player
    await page.setRequestInterception(true);

    page.on("request", async (request) => {
      try {
        if (
          request.url() == searchUrl &&
          request.method() == "GET" &&
          request.resourceType() == "xhr"
        ) {
          let url = searchUrl + "&maskedDefId=" + currentPlayer.resource_id;
          return await request.continue({ url: url });
        } else await request.continue({ url: request.url() });
      } catch (error) {
        return;
      }
    });

    for (let player of players) {
      currentPlayer = player;
      await makeBid(page, player);
    }

    return;
  } catch (error) {
    console.log(error);
  }
};

const makeBid = async (page, player) => {
  try {
    const buyPrice = player.price * 0.94;

    avaliableCoins = await page.$eval(
      "body > main > section > section > div.ut-navigation-bar-view.navbar-style-landscape > div.view-navbar-currency > div.view-navbar-currency-coins",
      (el) => el.innerText
    );

    // Return if user don't have enough coins
    if (avaliableCoins < buyPrice) {
      console.log("Insufficient Coins");
      return Promise.resolve();
    }

    // Wait and Click on the Transfer button on left side navigation
    await page.waitForSelector(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > div.tile.col-1-1.ut-tile-transfer-market",
      { timeout: 0 }
    );
    await page.waitForTimeout(2000);
    await page.click(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > div.tile.col-1-1.ut-tile-transfer-market"
    );

    // Go to search market
    await page.click(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div.ut-pinned-list-container.ut-content-container > div > div.button-container > button.btn-standard.call-to-action"
    );

    // wait for seach button
    const searchButton = await page.$x(
      "/html/body/main/section/section/div[2]/div/div[2]/div/div[2]/button[2]"
    );

    // Search the current player
    await page.waitForTimeout(2000);
    await searchButton[0].click();

    const priceInput =
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > section.ut-navigation-container-view.ui-layout-right > div > div > div.DetailPanel > div.bidOptions > div > input";

    await page.waitForSelector(priceInput);
    await page.evaluate(
      (priceInput, buyPrice) => {
        document.querySelector(priceInput).value = buyPrice;
      },
      priceInput,
      buyPrice
    );

    // Click on the Make an Offer button
    await page.click(
      "body > main > section > section > div.ut-navigation-container-view--content > div > div > section.ut-navigation-container-view.ui-layout-right > div > div > div.DetailPanel > div.bidOptions > button.btn-standard.call-to-action.bidButton"
    );

    await page.waitForTimeout(3000);

    // Check if there is any alert popup then close it
    if (
      (await page.$("body > div.view-modal-container.form-modal > section")) !==
      null
    )
      await page.click(
        "body > div.view-modal-container.form-modal > section > div > div > button"
      );

    await page.waitForTimeout(10000);
    await page.click(transferButton);

    return;
  } catch (error) {
    console.log(error);
    return;
  }
};
