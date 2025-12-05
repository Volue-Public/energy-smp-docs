# Introduction to Mesh functions

Mesh allows you to efficiently manage time series data used in several work processes. The solution lets you structure your data in your own logical hierarchy. The hierarchy is built from custom defined object types related to each other in an object model. Time series and property types are connected to the objects.

## Template calculations setup

The object model is well suited for setting up time series calculations as template expressions. This means more efficient set up and maintenance and ensures consistent results thought out the system.

To set up a calculation expression in SmG Calculator with Mesh as a foundation, you refer to time series types and property types from the object model, instead of physical time series and values (see Reference lookup for more details about these functions, e.g. @t(s)). This is specified as a navigation path or a model search from the target time series type, which holds the calculation result in the same way as for virtual time series in TSM. The function syntax in Mesh are the same as for TSM, but Mesh does not support all TSM functions and vice versa.

One specific calculation method is used for all the time series of the same type by use of one template definition. This reduces maintenance work dramatically and ensures data consistency.

If you have set up a template calculation referring to a time series that is not connected to any physical time series reference, the result view will be empty.

## Using extended periods

Some calculations need an extended period to produce correct and consistent results. For example, calculating a delta series needs the previous value;calculating accumulated series from the start of the year needs all valuesfrom this point, even if the requested period is September that year.In Mesh calculations,the functions that inherently need extended periods, are handled implicitly when creating the calculation expressions.

Still, there may be situations where you explicitly want to define extended periods. To do this you can use the PushExtPeriod and PopExtPeriod functions to ensure correct behavior.

The ground rules for applying the Push/Pop mechanism are:

- The expression uses data outside the requested period to produce correct results.
- The time series that need to be extended has no direct database connection, i.e. it cannot be extended by reading more data from the database.

