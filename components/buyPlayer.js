const { players } = require("../config/player.json");

var currentPlayer = null;

const transferButton =
  "body > main > section > nav > button.ut-tab-bar-item.icon-transfer";

module.exports = async (page) => {
  try {
    await page.setRequestInterception(true);

    /*  page.on("request", async (request) => {
      await updateUrl(request);
      request.continue();
    }); */

    await page.waitForSelector(transferButton);
    await page.waitForTimeout(10000);
    await page.click(transferButton);

    for (let player of players) {
      currentPlayer = player;
      await makeBid(page, player);
    }
  } catch (error) {
    console.log(error);
  }
};

const makeBid = async (page, player) => {
  await page.waitForSelector(
    "body > main > section > section > div.ut-navigation-container-view--content > div > div > div.tile.col-1-1.ut-tile-transfer-market"
  );
  await page.waitForTimeout(2000);
  await page.click(
    "body > main > section > section > div.ut-navigation-container-view--content > div > div > div.tile.col-1-1.ut-tile-transfer-market"
  );

  await page.click(
    "body > main > section > section > div.ut-navigation-container-view--content > div > div.ut-pinned-list-container.ut-content-container > div > div.button-container > button.btn-standard.call-to-action"
  );

  await page.waitForTimeout(20000);
  await page.click(transferButton);

  return;
};

const updateUrl = async (request) => {
  console.log("currentPlayer");
  console.log(currentPlayer);

  console.log("Request");
  // console.log(request);
};
