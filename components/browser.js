const puppeteer = require("puppeteer");

module.exports = async () => {
  const browser = await puppeteer.launch({ headless: false });
  return browser;
};
