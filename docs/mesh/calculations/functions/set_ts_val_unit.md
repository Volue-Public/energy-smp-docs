## SET_TS_VALUNIT

### About the function
This function is used to change the unit of a time series. Especially calculated
series may contain several multiplied time series and result in different unit
than the input time series.

### Syntax

- SET_TS_VALUNIT(t,d)
- SET_TS_VALUNIT(t,s)

### Description

| # | Type | Description |
|---|---|---|
| 1 | t | Time series. |
| 2 | d or s | Unit code number or text. |

See [Unit codes for SET_TS_VALUNIT](../functions/unit_codes_for_set_ts_val_unit.md).
**Note!** The text for unit code is language dependent. If in doubt, open the
Time series application search window. Look in the **Unit** drop down menu to
check if you are using the correct language for the code.

**Note!** The value unit may affect the default transformation method that is used 
when the series is requested in another resolution.

### Examples

Example 1: @SET_TS_VALUNIT(t,d)

To change the unit of a result series to meters/second, the unit code is 120:

@SET_TS_VALUNIT(timeseries1,120)

Example 2: @SET_TS_VALUNIT(t,s)

To change the unit of a result series to meters/second using text:

@SET_TS_VALUNIT(timeseries1,'m/sec')

This gives the same result as example 1.
