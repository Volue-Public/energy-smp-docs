# Reference lookup
The lookup functions have their name from the target type. The variant with a
single argument produces a warning message in Nimbus (Mesh log), if the lookup
fails and return system defined default value, like empty series (defined as
breakpoint series with a single NaN point at start of requested time period).

The variant with two arguments does not complain by sending messages to the log
if lookup fails. If lookup fails, the default value found in the second argument
is applied. The default value related to arrays (i.e. using @T(), @D() or @S())
must be minimum one value. **Note!** The default value is only used if Mesh
cannot find the attribute, so an empty value on the found attribute does not
imply use of a default value.

| Function | Description |
|---|---|
| @t(s) | Looks up a time series from search/navigate string given as argument. <br>If the target is not found, a log message a log message informs that the system <br/>failed to resolve the target. |
| @t(s,t) | Basically the same as @t(s), but in case the lookup fails it returns the default <br/>time series given as the second argument. <br/>The function remains silent even if the returned value comes from the default argument. <br/>Note! The default argument most likely is another @t function call. |
| @T(s) | Looks up a time series array from search/navigate string given as argument. <br/>If the target is not found, a log message informs that the system failed to resolve the target. |
| @T(s,T) | Basically, this is the same as @T(s). However, in case the lookup fails, it returns the default <br/>time series array given as the second argument. The function remains silent <br/>even if the returned value comes from the default argument. <br/>Note! The default argument may be another @T function call or an expression like <br/>{@TS(‘VARINT’)} given an array of one breakpoint series with a NaN value. |
| @d(s) | Looks up a numeric value from search/navigate string given as argument. <br/>If the target is not found, a log message informs that the system failed to resolve the target. |
| @d(s,d) | Basically, this is the same as @d(s). However, in case the lookup fails, it returns <br/>the default time series given as the second argument. The function remains <br/>silent even if the returned value comes from the default argument. <br/>Note! The default argument may be a constant values or another @d function call. |
| @D(s) | Looks up a numeric array from the search/navigate string given as argument. If the target <br/>is not found, a log message informs that the system failed to resolve the target. |
| @D(s,D) | Basically, this is the same as @D(s). However, in case the lookup fails, it returns <br/>the default numeric array given as the second argument. The function remains <br/>silent even if the returned value comes from the default argument. <br/>Note! The default argument may be an explicit array (like {1,2,3}), or another <br/>@D function call. The explicit version must have at least one member in the array. |
| @s(s) | Looks up a string value from the search/navigate string given as argument. If the target <br/>is not found, a log message informs that the system failed to resolve target. |
| @s(s,s) | Basically, this is the same as @s(s). However, in case the lookup fails, it returns the <br/>default time series given as the second argument. The function remains <br/>silent even if the returned value comes from the default argument. <br/>Note! The default argument may be a constant values or another @s function call. |
| @S(s) | Looks up a string array from the search/navigate string given as argument. If the target <br/>is not found, a log message informs that the system failed to resolve the target. |
| @S(s,S) | Basically, this is the same as @S(s). However, in case the lookup fails, it returns the default <br/>array of strings given as the second argument. The function remains silent even if <br/>the returned value comes from the default argument. <br/>Note! The default argument may be an explicit value (like {‘None’}) or another <br/>@S function call. |
