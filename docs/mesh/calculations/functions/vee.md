# VEE group functions

VEE is short for Validate, Estimate and Edit.

If several functions in this group are used on the same time series data, the following rules apply:
- Already corrected time series points will not be recalculated by subsequent correction calculation functions.
- Already validated time series points (flag set to 'NOT_OK') will not be revalidated by subsequent validation calculation functions.
- For optimal result, it is recommended to apply the validation and correction methods from the most precise (best) to the more coarse algorithm.
 

