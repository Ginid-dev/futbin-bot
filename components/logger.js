const jsonfile = require("jsonfile");

module.exports = (message, type) => {
  const file = type == "error" ? "./logs/errors.json" : "./logs/logs.json";
  jsonfile.readFile(file).then((obj) => {
    obj.logs.push({
      message: message,
      createdAt: new Date(),
    });

    return jsonfile.writeFile(file, obj);
  });
};
