const core = require("@actions/core");
const github = require("@actions/github");
const YAML = require("yaml");

try {
  const source = core.getInput("source");
  const property = core.getInput("property");
  const map = YAML.parse(core.getInput("map"));
  const fail = core.getInput("fail");

  console.log(`source: ${source}`);
  console.log(`map: ${JSON.stringify(map, null, 2)}`);

  var result = null;
  for (const key in map) {
    var value = map[key];
    var tag = value[property];

    if (tag !== undefined) {
      if (source.indexOf(tag) !== -1) {
        result = value;
        break;
      }
    }
  }

  if (result) {
    console.log(`result: ${JSON.stringify(result)}`);

    console.log(`status: ok`);
    core.setOutput("status", "ok");

    for (const key in result) {
      console.log(`setOutput(${key}, ${result[key]})`);
      core.setOutput(key, result[key]);
    }
  } else {
    console.log("status: fail");
    core.setOutput("status", "fail");
    if (fail === "true" || fail === "yes" || fail === true) {
      core.setFailed("build tag not found");
    }
  }
} catch (error) {
  core.setFailed(error.message);
}
