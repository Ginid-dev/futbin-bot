const userAgent = require("user-agents");
const jsonfile = require("jsonfile");

const logger = require("../../components/logger");
const { email, password, backupcode } = require("../../config/auth.json");
const cookies = require("../../config/cookies.json");
const localStorageData = require("../../config/localstorage.json");

const buyPlayers = require("../../components/buyPlayer");
const sellPayers = require("../../components/sellPlayer");

const interval = 1000 * 60 * 5;

module.exports = async (browserInstance) => {
  try {
    const url = "https://www.ea.com/it-it/fifa/ultimate-team/web-app/";

    const loginBtnSelector =
      "#Login > div > div > button.btn-standard.call-to-action";

    const browser = await browserInstance();

    const page = await browser.newPage();

    await page.setUserAgent(userAgent.toString());
    await page.goto(url, { waitUntil: "load", timeout: 0 });

    // Set Cookies and localstorage items to create session
    if (
      cookies &&
      cookies.length &&
      Object.keys(localStorageData) &&
      Object.keys(localStorageData).length
    ) {
      await page.evaluate((localStorageData) => {
        Object.keys(localStorageData).map((item) => {
          localStorage.setItem(item, localStorageData[item]);
        });
      }, localStorageData);

      for (let cookie of cookies) await page.setCookie(cookie);
    } else {
      // Wait and Click on the login button
      await page.waitForSelector(loginBtnSelector);

      await page.waitForTimeout(5000);

      await page.click(loginBtnSelector);

      // Login to Web app with email and password
      await page.waitForSelector("#email");

      // Enter user email and password
      await page.evaluate(
        (email, password) => {
          document.querySelector("#email").value = email;
          document.querySelector("#password").value = password;
        },
        email,
        password
      );

      await page.waitForTimeout(1000);

      // Click on the sign button
      await page.click("#btnLogin");

      // Open verification page
      await page.waitForSelector("#btnSendCode");
      await page.click("#btnSendCode");

      // Enter backup code to login to Web APP
      await page.waitForSelector("#oneTimeCode");
      await page.evaluate((backupcode) => {
        document.querySelector("#oneTimeCode").value = backupcode;
      }, backupcode);

      // Click on the submit button
      await page.click("#btnSubmit");

      await page.waitForTimeout(5000);
    }

    // Store cookies in cookies.json and localstorage.json
    const cookiesObject = await page.cookies();
    const localStorageItems = await page.evaluate(() => {
      let json = {};
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        json[key] = localStorage.getItem(key);
      }
      return json;
    });

    jsonfile.writeFile("./config/cookies.json", cookiesObject);
    jsonfile.writeFile("./config/localstorage.json", localStorageItems);

    await page.waitForTimeout(3000);

    await tradePlayers(page);

    return logger("Login to Web APP", "log");
  } catch (error) {
    console.log("Error Auth");
    console.log(error);
    return logger(error, "error");
  }
};

const tradePlayers = async (page) => {
  // Start Buying players
  await buyPlayers(page);
  // Start selling players
  await sellPayers(page);

  // Sell and Buy player on specified Interval
  setTimeout(() => {
    tradePlayers(page);
  }, interval);
};
