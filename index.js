const fs = require("fs");
const CronJob = require("cron").CronJob;
const browserInstance = require("./components/browser");

const { authController, playerPriceController } = require("./controllers");

const createLogFiles = (folderName, file) => {
  const logContent = '{ "logs": [] }';
  const path = folderName + "/" + file;

  try {
    if (!fs.existsSync(folderName)) fs.mkdirSync(folderName);

    fs.stat(path, (err, stat) => {
      if (err)
        fs.writeFile(path, logContent, (err) => {
          if (err) console.log(err);
          console.log(path + "  file created");
        });
    });
  } catch (err) {
    console.error(err);
  }
};

// Create log files if not exist
createLogFiles("logs", "logs.json");
createLogFiles("logs", "errors.json");

authController(browserInstance);

// const updatePlayerPriceJob = new CronJob(
//   "* * * * *",
//   () => {
//     return playerPriceController(browserInstance);
//   },
//   null,
//   true,
//   "America/Los_Angeles"
// );

// updatePlayerPriceJob.start();
