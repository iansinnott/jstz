/*global process*/
/**
 * Script to test jstz.
 *
 * Check for current timezone:
 * $ node test.js
 * 'Europe/Berlin'
 *
 * Check for specific timezone:
 * $node test.js America/Denver
 *
 * @type {exports.jstz|*}
 */
var jstz = require("../dist/jstz.js");

var expected_tz = process.argv[2];
var actual_tz = null;

if (typeof expected_tz === 'undefined') {
    actual_tz = jstz.determine().name();
    console.log(actual_tz);
} else {
    process.env.TZ = expected_tz;
    actual_tz = jstz.determine().name();

    if (expected_tz === actual_tz) {
        console.log("Successfully validated ", expected_tz, "===", actual_tz);
    } else {
        console.log("Assertion failed ", expected_tz, "!==", actual_tz);
    }
}