const { players } = require("../config/player.json");
const transferButton =
  "body > main > section > nav > button.ut-tab-bar-item.icon-transfer";

module.exports = async (page) => {
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
};
