/*global fs, process*/
/**
 * Generates rules for ONE time zone.
 *
 * call with $node dst.js TIMEZONE_KEY [YEARS...]
 *
 * such as:
 *
 * $node dst.js America/Denver 2008 2009 2010 2011 2012 2013 2014
 *
 * which will return an object with the start and end date of all DST changes
 * for each year provided, in order.
 *
 * This script should basically only be called from dst.py while generating
 * the rules.js file.
 */
var fs = require('fs');

var consts = {
    DAY: 86400000,
    HOUR: 3600000,
    MINUTE: 60000,
    SECOND: 1000
};

function dst_dates(year) {
    var year_start = new Date(year, 0, 1, 0, 0, 1, 0).getTime();
    var year_end = new Date(year, 12, 31, 23, 59, 59).getTime();
    var current = year_start;
    var offset = (new Date(current)).getTimezoneOffset();
    var dst_start = null;
    var dst_end = null;

    while (current < year_end - 86400000) {
        var dateToCheck = new Date(current);
        var dateToCheckOffset = dateToCheck.getTimezoneOffset();

        if (dateToCheckOffset !== offset) {
            if (dateToCheckOffset < offset) {
                dst_start = dateToCheck;
            }
            if (dateToCheckOffset > offset) {
                dst_end = dateToCheck;
            }
            offset = dateToCheckOffset;
        }

        current += 86400000;
    }

    if (dst_start && dst_end) {
        return {
            s: _find_dst_fold(dst_start).getTime(),
            e: _find_dst_fold(dst_end).getTime()
        }
    }

    return false;
}

function _find_dst_fold(a_date, padding, iterator) {
    if (typeof padding === 'undefined') {
        padding = consts.DAY;
        iterator = consts.HOUR;
    }

    var date_start = new Date(a_date.getTime() - padding).getTime();
    var date_end = a_date.getTime() + padding;
    var offset = new Date(date_start).getTimezoneOffset();

    var current = date_start;

    var dst_change = null;
    while (current < date_end - iterator) {
        var dateToCheck = new Date(current);
        var dateToCheckOffset = dateToCheck.getTimezoneOffset();

        if (dateToCheckOffset !== offset) {
            dst_change = dateToCheck;
            break;
        }
        current += iterator;
    }

    if (padding === consts.DAY) {
        return _find_dst_fold(dst_change, consts.HOUR, consts.MINUTE);
    }

    if (padding === consts.HOUR) {
        return _find_dst_fold(dst_change, consts.MINUTE, consts.SECOND);
    }

    return dst_change;
}

if (process.argv[2] !== 'current') {
    process.env.TZ = process.argv[2];
}

var years = (function () {
    var year_list = [];
    process.argv.forEach(function (val, index, array) {
        if (index > 2) {
            year_list.push(parseInt(process.argv[index], 10));
        }
    });
    return year_list;
}());

var rules = (function () {
    var rule_list = [];
    for (var i = 0; i < years.length; i++) {
        var year_rules = dst_dates(years[i]);
        rule_list.push(year_rules);
    }
    return rule_list;
}());

console.log(JSON.stringify(rules));


