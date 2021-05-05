module.exports = async (page) => {
  page.on("response", async (response) => {
    if (response.status == 458) {
      await page.solveRecaptchas();
      await page.click(`#recaptcha-demo-submit`);
    } else return;
  });
};
