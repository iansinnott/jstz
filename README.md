# JSTZ

[![Circle CI](https://img.shields.io/circleci/project/iansinnott/jstz.svg)](https://circleci.com/gh/iansinnott/jstz)
[![JSTZ on NPM](https://img.shields.io/npm/v/jstz.svg)](https://www.npmjs.com/package/jstz)

Timezone detection for JavaScript

## What

This library allows you to detect a user's timezone from within their browser. It is often useful to use JSTZ in combination with a timezone parsing library such as [Moment Timezone][].

This library is an unofficial fork of [pellepim/jstimezonedetect][jstimezonedetect]. The original library works well and can be used via [CDN][], but it was not configured to work with NPM. This meant the library was less accessible because it could not be retrieved with a simple npm command or included as a dependency in `package.json`. Thus this fork was born.

**Sidenote:** If you're wondering why this isn't an actual GitHub fork it's because the original project uses Mercurial and is hosted on BitBucket.

## Why

Dealing with timezones can be a pain. Libraries like [Moment Timezone][] help a lot with the parsing side of things, but if you want to _detect_ the users timezone you would normally have to do it manually. That's where this library comes in.

## Usage

```
$ npm install --save jstz
```

In your JS file:

```js
import jstz from 'jstz';
const timezone = jstz.determine();
timezone.name(); // => 'America/Los_Angeles' (or whatever your user's timezone is)
```

Or if you prefer ES5:

```js
var jstz = require('jstz');
var timezone = jstz.determine();
timezone.name(); // => 'America/Los_Angeles' (or whatever your user's timezone is)
```

**Note:** If you're not using a module system such as Webpack or Browserify then I recommend you use the original library delivered via CDNJS:

```html
<!doctype html>
<script src='https://cdnjs.cloudflare.com/ajax/libs/jstimezonedetect/1.0.4/jstz.min.js'></script>
<script>
  var jstz = require('jstz');
  var timezone = jstz.determine();
  console.log('Your timezone is: ' + timezone.name());
</script>
```

## Docs

To learn more about the library head on over to the original library's repo: <https://bitbucket.org/pellepim/jstimezonedetect>

## Use With Rails

`jstz` is an excellent library to use by Rails to determine the time zone of the browser (e.g. the gem [browser-timezone-rails](https://github.com/kbaum/browser-timezone-rails)), but some extra tweaking is necessary to make them play nicely together.

A common use case is to provide a time zone select (`f.time_zone_select`) where it defaults to the user's current time zone. That Rails helper uses `ActiveSupport::TimeZone`, which provides a more human-readable subset of the time zones (e.g. `Eastern Time (US & Canada)` instead of `America/New_York`). `jstz` doesn't know about this subset, so we need to use the `TZInfo` associated with those `ActiveSupport::TimeZone`s to have a correct translation.

This method could go on your base application controller, assuming you're setting a browser cookie `browser_time_zone`:

```ruby
# Returns the client's time zone based on a cookie set by the browser, defaults to application time zone
def browser_time_zone
  browser_tz = ActiveSupport::TimeZone.find_tzinfo(cookies[:browser_time_zone])
  ActiveSupport::TimeZone.all.find { |zone| zone.tzinfo == browser_tz } || Time.zone
rescue TZInfo::UnknownTimezone, TZInfo::InvalidTimezoneIdentifier
  Time.zone
end
```

Then in the view you could do something like:

```erb
<%= f.time_zone_select :time_zone, ActiveSupport::TimeZone.us_zones,
                       default: browser_time_zone.name %>
```

Further complicating matters, `jstz` uses the forward-thinking `window.Intl`, which has an awareness of time zones other than what is in Rails, so time zones such as `America/Montreal` from `Intl` will not be found in Rails. If you're using `jstz` with Rails, you will want to tempoarily "silence" the use of `Intl` when reading from `jstz`. Here's a code snippet:

```js
export function findTimeZone() {
  const oldIntl = window.Intl
  try {
    window.Intl = undefined
    const tz = jstz.determine().name()
    window.Intl = oldIntl
    return tz
  } catch (e) {
    // sometimes (on android) you can't override intl
    return jstz.determine().name()
  }
}
```

## Credits (from the original README.md)

Thanks to

  - [Josh Fraser][5] for the original idea
  - [Brian Donovan][6] for making jstz CommonJS compliant
  - [Ilya Sedlovsky][7] for help with namespacing
  - [Jordan Magnuson][9] for adding to cdnjs, documentation tags, and for reporting important issues
  - [Matt Johnson][11] for adding support for the Internationalization API

Other contributors:
[Gilmore Davidson][8]

[jstimezonedetect]: https://bitbucket.org/pellepim/jstimezonedetect
[CDN]: https://cdnjs.com/libraries/jstimezonedetect
[Moment Timezone]: http://momentjs.com/timezone/

[1]: http://www.iana.org/time-zones
[3]: https://bitbucket.org/pellepim/jstimezonedetect/src
[4]: https://github.com/gruntjs/grunt
[5]: http://www.onlineaspect.com/about/
[6]: https://bitbucket.org/eventualbuddha
[7]: https://bitbucket.org/purebill
[8]: https://bitbucket.org/gdavidson
[9]: https://github.com/JordanMagnuson
[11]: https://bitbucket.org/mj1856
