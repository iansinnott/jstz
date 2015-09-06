"""
Module for generating rules and for testing.
"""

import subprocess
import json
import sys
from datetime import datetime
import os

AMBIGUOUS_DST_ZONES = ['Africa/Cairo', 'America/Asuncion', 'America/Campo_Grande', 'America/Goose_Bay',
                       'America/Havana', 'America/Mazatlan', 'America/Mexico_City', 'America/Miquelon',
                       'America/Santa_Isabel', 'America/Sao_Paulo', 'Asia/Amman', 'Asia/Damascus',
                       'Asia/Dubai', 'Asia/Gaza', 'Asia/Irkutsk', 'Asia/Jerusalem', 'Asia/Kamchatka',
                       'Asia/Krasnoyarsk', 'Asia/Omsk', 'Asia/Vladivostok', 'Asia/Yakutsk', 'Asia/Yekaterinburg',
                       'Asia/Yerevan', 'Australia/Lord_Howe', 'Australia/Perth', 'Europe/Helsinki',
                       'Europe/Minsk', 'Europe/Moscow', 'Pacific/Apia', 'Pacific/Fiji']

OTHER_DST_ZONES = ['Africa/Johannesburg', 'Africa/Windhoek', 'America/Adak', 'America/Anchorage', 'America/Chicago',
                   'America/Denver', 'America/Godthab', 'America/Halifax', 'America/Los_Angeles', 'America/Montevideo',
                   'America/New_York', 'America/Noronha', 'America/Santiago', 'America/St_Johns', 'Asia/Baghdad',
                   'Asia/Baku', 'Asia/Beirut', 'Asia/Dhaka', 'Asia/Jakarta', 'Asia/Karachi', 'Asia/Shanghai',
                   'Asia/Tehran', 'Asia/Tokyo', 'Atlantic/Azores', 'Australia/Adelaide', 'Australia/Brisbane',
                   'Australia/Sydney', 'Europe/Berlin', 'Europe/London', 'Pacific/Auckland', 'Pacific/Chatham',
                   'Pacific/Majuro', 'Pacific/Noumea', 'Pacific/Tongatapu']

OTHER_TIMEZONES = ['America/Guatemala', 'Pacific/Pitcairn', 'Asia/Kolkata', 'Pacific/Kiritimati',
                   'Australia/Darwin', 'Pacific/Pago_Pago', 'Pacific/Honolulu', 'America/Bogota',
                   'Atlantic/Cape_Verde', 'America/Phoenix', 'America/Santo_Domingo', 'UTC',
                   'Asia/Kathmandu', 'America/Argentina/Buenos_Aires', 'Pacific/Marquesas',
                   'Pacific/Norfolk', 'Asia/Kabul', 'Africa/Lagos', 'Pacific/Gambier', 'Asia/Rangoon',
                   'Etc/GMT+12', 'Australia/Eucla', 'America/Caracas']

OLSON_TO_WIN32_MAPPING = {
    'Etc/GMT+12': 'Dateline Standard Time',
    'Pacific/Pago_Pago': 'UTC-11',
    'Pacific Honolulu': 'Hawaiian Standard Time',
    'America/Anchorage': 'Alaskan Standard Time',
    'America/Santa_Isabel': 'Pacific Standard Time (Mexico)',
    'America/Los_Angeles': 'Pacific Standard Time',
    'America/Phoenix': 'US Mountain Standard Time',
    'America/Mazatlan': 'Mountain Standard Time (Mexico)',
    'America/Denver': 'Mountain Standard Time',
    'America/Guatemala': 'Central America Standard Time',
    'America/Chicago': 'Central Standard Time',
    'America/Mexico_City': 'Central Standard Time (Mexico)',
    'America/Bogota': 'SA Pacific Standard Time',
    'America/New_York': 'Eastern Standard Time',
    'America/Caracas': 'Venezuela Standard Time',
    'America/Asuncion': 'Paraguay Standard Time',
    'America/Halifax': 'Atlantic Standard Time',
    'America/Campo_Grande': 'Central Brazilian Standard Time',
    'America/Santo_Domingo': 'SA Western Standard Time',
    'America/Santiago': 'Pacific SA Standard Time',
    'America/St_Johns': 'Newfoundland Standard Time',
    'America/Sao_Paulo': 'E. South America Standard Time',
    'America/Argentina/Buenos_Aires': 'Argentina Standard Time',
    'America/Godthab': 'Greenland Standard Time',
    'America/Montevideo': 'Montevideo Standard Time',
    'America/Noronha': 'UTC-02',
    'Atlantic/Azores': 'Azores Standard Time',
    'Atlantic/Cape_Verde': 'Cape Verde Standard Time',
    'Europe/London': 'GMT Standard Time',
    'UTC': 'Greenwich Standard Time',
    'Europe/Berlin': 'W. Europe Standard Time',
    'Africa/Lagos': 'W. Central Africa Standard Time',
    'Africa/Windhoek': 'Namibia Standard Time',
    'Asia/Amman': 'Jordan Standard Time',
    'Europe/Helsinki': 'FLE Standard Time',
    'Asia/Beirut': 'Middle East Standard Time',
    'Africa/Cairo': 'Egypt Standard Time',
    'Asia/Damascus': 'Syria Standard Time',
    'Africa/Johannesburg': 'South Africa Standard Time',
    'Asia/Jerusalem': 'Israel Standard Time',
    'Asia/Baghdad': 'Arabic Standard Time',
    'Asia/Tehran': 'Iran Standard Time',
    'Asia/Dubai': 'Arabian Standard Time',
    'Asia/Baku': 'Azerbaijan Standard Time',
    'Asia/Kabul': 'Afghanistan Standard Time',
    'Asia/Karachi': 'Pakistan Standard Time',
    'Asia/Kolkata': 'India Standard Time',
    'Asia/Kathmandu': 'Nepal Standard Time',
    'Asia/Dhaka': 'Bangladesh Standard Time',
    'Asia/Rangoon': 'Myanmar Standard Time',
    'Asia/Jakarta': 'SE Asia Standard Time',
    'Asia/Shanghai': 'China Standard Time',
    'Asia/Tokyo': 'Tokyo Standard Time',
    'Australia/Adelaide': 'Cen. Australia Standard Time',
    'Australia/Darwin': 'AUS Central Standard Time',
    'Australia/Brisbane': 'E. Australia Standard Time',
    'Australia/Sydney': 'AUS Eastern Standard Time',
    'Pacific/Noumea': 'Central Pacific Standard Time',
    'Pacific/Majuro': 'UTC+12',
    'Pacific/Auckland': 'New Zealand Standard Time',
    'Pacific/Fiji': 'Fiji Standard Time',
    'Pacific/Tongatapu': 'Tonga Standard Time',
    'Pacific/Apia': 'Samoa Standard Time',
    'Pacific/Kiritimati': 'Line Islands Standard Time'
}

YEARS = range(2008, 2015)




def set_windows_timezone(timezone):
    windows_tz = OLSON_TO_WIN32_MAPPING[timezone]
    subprocess.call(['tzutil', '/s', windows_tz])

def generate_rules():
    rules = {'years': YEARS}
    zones = []
    
    for timezone in AMBIGUOUS_DST_ZONES:
        print "Generating rules for %s" % timezone
        call_args = ['node', 'dst.js', timezone] + [str(y) for y in YEARS]
        result = {
            'name': timezone,
            'rules': json.loads(subprocess.check_output(call_args))
        }
        zones.append(result)

    rules['zones'] = zones

    rules_json = json.dumps(rules, sort_keys=True, indent=4, separators=(',', ': '))

    rules_js = """/* Build time: %s Build by invoking python utilities/dst.py generate */
jstz.olson.dst_rules = %s;""" % (datetime.utcnow().strftime('%Y-%m-%d %H:%M:%SZ'), rules_json)

    with open('../jstz.rules.js', 'w') as rulefile:
        rulefile.write(rules_js)

    print "Written to ../jstz.rules.js"


def test(include_success=False):
    all_timezones = AMBIGUOUS_DST_ZONES + OTHER_DST_ZONES + OTHER_TIMEZONES
    success = True
    windows = True if sys.platform == 'win32' else False
    successes = 0
    failures = 0
    
    for timezone in all_timezones:
        
        if windows and timezone in OLSON_TO_WIN32_MAPPING.keys():
            set_windows_timezone(timezone)
        
        if not windows or windows and timezone in OLSON_TO_WIN32_MAPPING.keys():    
            call_args = ['node', 'test.js', timezone]
            output = subprocess.check_output(call_args)
    
            if "Assertion failed" in output or include_success:
                print output.replace('\n', '')
                success = False
                failures += 1
            else:
                successes += 1

    if success:
        print "All tests succeeded (%s zones successfully detected)" % (successes + failures)
    else:
        print "%s/%s tests failed" % (failures, successes + failures)

if __name__ == "__main__":
    os.chdir(os.path.dirname(os.path.realpath(__file__)))

    if len(sys.argv) < 2:
        print "Supply arguments 'generate' or 'test'"
        exit()

    if sys.argv[1] == 'generate':
        generate_rules()

    if sys.argv[1] == 'test':
        if len(sys.argv) > 2 and sys.argv[2] == 'include-success':
            test(True)
        else:
            test()
