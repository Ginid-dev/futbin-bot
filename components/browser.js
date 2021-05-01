const puppeteer = require("puppeteer-extra");

const StealthPlugin = require("puppeteer-extra-plugin-stealth");
const AdblockerPlugin = require("puppeteer-extra-plugin-adblocker");

puppeteer.use(StealthPlugin());

puppeteer.use(AdblockerPlugin());

module.exports = async () => {
  const browser = await puppeteer.launch({ headless: false });

  return browser;
};
