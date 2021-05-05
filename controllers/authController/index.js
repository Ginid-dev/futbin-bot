const userAgent = require("user-agents");
const jsonfile = require("jsonfile");

const logger = require("../../components/logger");
const { email, password, backupcode } = require("../../config/auth.json");
const cookies = require("../../config/cookies.json");
const localStorageData = require("../../config/localstorage.json");

const buyPlayer = require("../../components/buyPlayer");

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

      for (let cookie of cookies) {
        await page.setCookie(cookie);
      }
    } else {
      await page.waitForSelector(loginBtnSelector);

      await page.waitForTimeout(5000);

      await page.click(loginBtnSelector);

      // Login to Web app with email and password
      await page.waitForSelector("#email");

      await page.evaluate(
        (email, password) => {
          document.querySelector("#email").value = email;
          document.querySelector("#password").value = password;
        },
        email,
        password
      );

      await page.waitForTimeout(1000);

      await page.click("#btnLogin");

      // Open verification page
      await page.waitForSelector("#btnSendCode");
      await page.click("#btnSendCode");

      // Enter backup code to login to Web APP
      await page.waitForSelector("#oneTimeCode");
      await page.evaluate((backupcode) => {
        document.querySelector("#oneTimeCode").value = backupcode;
      }, backupcode);

      await page.click("#btnSubmit");

      // Store cookies on first login of Bot
      const cookiesObject = await page.cookies();

      await page.waitForTimeout(5000);
      const localStorageData = await page.evaluate(() => {
        let json = {};
        for (let i = 0; i < localStorage.length; i++) {
          const key = localStorage.key(i);
          json[key] = localStorage.getItem(key);
        }
        return json;
      });

      jsonfile.writeFile("./config/cookies.json", cookiesObject);
      jsonfile.writeFile("./config/localstorage.json", localStorageData);
    }

    await buyPlayer(page);

    return logger("Login to Web APP", "log");
  } catch (error) {
    console.log("Error Auth");
    console.log(error);
    return logger(error, "error");
  }
};
