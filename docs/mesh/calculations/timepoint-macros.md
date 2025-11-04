# Time point specification

A time point can be specified in two ways:

- an explicit definition using from 8 to 17 numeric characters
- a macro based definition that related to current time

The format of an explicit time point specification:

- YYYYMMDDhhmmssxxx
  - Year given as 4 digits
  - Month as a two digits, from 01 to 12
  - Day as a two digits, from 01 to 31
  - Hour as a two digits, from 00 to 23
  - Minute as a two digits, from 00 to 59
  - Seconds as two digits, from 00 to 59
  - Milliseconds as three digits, from 000 to 999
- If the specification contains 8 characters, the default value is 0 for the fields starting from hour
- If the specification contains 10 characters, the default value is 0 for the fields starting from minute etc,
- Optional time zone prefix
  - Available codes are
    - UTC
    - LOCAL
    - STANDARD
  - The zone name STANDARD is the same as omitting time zone prefix, i.e. maps to default behaviour.
  
Default time zone is STANDARD, that is local time zone with daylight saving time (DST) disabled. No DST means using the same UTC offset all year long.

Examples:

- 20251022 -> UTC 2025-10-21T23:00:00Z
- 202510220143 -> UTC 2025-10-22T00:43:00Z
- LOCAL20251022 -> UTC 2025-10-21T22:00:00Z

A more flexible way to specify a time point is using the following format:

- [zone] anchor sign offset
  - Example
  - LOCALDAY+3d-2h+51x
    - Zone is LOCAL - local time zone with DST enabled
    - Anchor is DAY - start  of day in the current zone (LOCAL)
    - Offset is calculated from 
      - +3d - add 3 days
      - -2h - subtract 2 hours
      - +51x - add 51 minutes

- The valid time zone codes are: UTC, LOCAL  and STANDARD 
- The anchor codes are the same as time resolution specification, YEAR, MONTH, WEEK, DAY, HOUR, MIN30 and MIN15.
- The available offset codes are
  - d - days
  - h - hours
  - x - minutes

Default time zone if zone prefix is omitted is STANDARD, i.e. local time zone with DST disabled.

Assume current time is `Wednesday, October 22, 2025 10:41:49 AM`. PS! This time point is inside the DST time period.

Examples:

- DAY+2h -> UTC 2025-10-22T01:00:00Z
- WEEK+1d+4h-10x -> UTC 2025-10-21T04:50:00Z
- UTCDAY+2h -> UTC 2025-10-22T02:00:00Z
- LOCALDAY+2h -> UTC 2025-10-22T00:00:00Z
