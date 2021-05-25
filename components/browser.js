const puppeteer = require("puppeteer");

// const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");
const RecaptchaPlugin = require("puppeteer-extra-plugin-recaptcha");

// puppeteer.use(StealthPlugin());
// puppeteer.use(AdblockerPlugin());

// puppeteer.use(
//   RecaptchaPlugin({
//     provider: {
//       id: "2captcha",
//       token: "fb87d5f63c46112ed611a25fedf58b6e", // REPLACE THIS WITH YOUR OWN 2CAPTCHA API KEY ⚡
//     },
//     visualFeedback: true,
//   })
// );

module.exports = async () => {
  const browser = await puppeteer.launch({
    headless: false,
    ignoreHTTPSErrors: true,
  });

  return browser;
};
