var jstz = require("../../dist/jstz.min.js");
var expected_tz = process.argv[2];
var actual_tz = null;

process.env.TZ = expected_tz;
actual_tz = jstz.determine().name();
process.stdout.write(actual_tz);