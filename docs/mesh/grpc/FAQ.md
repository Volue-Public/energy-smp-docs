# Frequently Asked Questions (FAQ)

## 1. Why do I get RESOURCE_EXHAUSTED error code?

The RESOURCE_EXHAUSTED error typically occurs when message size limits are exceeded.
Refer to [Message size limits](./MessageSizeLimits.md) for configuration details and solutions.

## 2. Why do I get an SSL_ERROR_SSL on the client side?

```bash
Ssl handshake failed (TSI_PROTOCOL_FAILURE): SSL_ERROR_SSL: error:100000f7:SSL routines:OPENSSL_internal:WRONG_VERSION_NUMBER
```

If your server is set up to not use TLS and you try to connect using a secure connection you will get this error.
Either change the server to use TLS or change you client code to connect without a secure connection.
We strongly suggest to use TLS for security reasons.
