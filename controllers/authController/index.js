const logger = require("../../components/logger");
const { email, password } = require("../../config/auth.json");

module.exports = async (browserInstance) => {
  try {
    const url = "https://www.ea.com/it-it/fifa/ultimate-team/web-app/";

    const loginBtnSelector =
      "#Login > div > div > button.btn-standard.call-to-action";

    const browser = await browserInstance();

    const page = await browser.newPage();

    await page.goto(url, { waitUntil: "load", timeout: 0 });

    await page.waitForSelector(loginBtnSelector);

    await page.waitForTimeout(5000);

    await page.click(loginBtnSelector);

    // Login to Web app

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

    return logger("Login to Web APP", "log");
  } catch (error) {
    console.log("Error Auth");
    console.log(error);
    return logger(error, "error");
  }
};
