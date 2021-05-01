const CronJob = require("cron").CronJob;
const browserInstance = require("./components/browser");

const { authController, playerPriceController } = require("./controllers");

const updatePlayerPriceJob = new CronJob(
  "* * * * *",
  () => {
    return playerPriceController(browserInstance);
  },
  null,
  true,
  "America/Los_Angeles"
);

updatePlayerPriceJob.start();
