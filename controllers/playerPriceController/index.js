const jsonfile = require("jsonfile");
const logger = require("../../components/logger");

const players = "./config/player.json";
const futBinBaseUrl = "https://www.futbin.com/21/player";

module.exports = async (browserInstance) => {
  const browser = await browserInstance();

  return jsonfile
    .readFile(players)
    .then(async (obj) => {
      if (!obj || !obj.players || !obj.players.length) {
        await browser.close();
        return;
      }

      for (let player of obj.players) {
        console.log("Executing loop");
        const url =
          futBinBaseUrl +
          "/" +
          player.ID +
          "/" +
          player.playername.toLocaleLowerCase().replace(" ", "-");

        player.price = await scrapPrice(browser, url);

        player.priceUpdatedAt = new Date();
      }

      return jsonfile.writeFile(players, obj);
    })
    .then(async () => {
      await browser.close();
      return logger("Updated player price", "log");
    })
    .catch((error) => {
      console.log("error here");
      console.log(error);
      logger(error, "error");
    });
};

const scrapPrice = async (browser, url) => {
  let playerPrice = null;

  try {
    console.log("player url", url);
    const page = await browser.newPage();
    const priceSelector = "#ps-lowest-1";

    await page.goto(url);

    await page.waitForTimeout(2000);

    await page.waitForSelector(priceSelector);

    playerPrice = await page.$eval(priceSelector, (el) =>
      el.innerText.replaceAll(",", "").trim()
    );

    console.log("player price", playerPrice);

    await page.close();

    return playerPrice;
  } catch (error) {
    console.log("error here");
    console.log(error);
    return logger(error, "error");
  }
};
