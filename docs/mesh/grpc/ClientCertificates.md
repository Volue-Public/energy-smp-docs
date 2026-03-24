# gRPC client TLS certificates

Mesh server gRPC interface can be configured to use Transport Layer Security
(TLS) and if used then only TLS connections from the clients will be accepted.

## Certificates

TLS uses X.509 digital certificates, further on referred as TLS certificate.
Such certificate contains, among others, public key and information about the
issuer. Additionally for each TLS certificate there is a corresponding private
key. Contrary to the public key, it is a secret and **must** be kept secure.
Those are needed for server authentication and encryption of the
transmitted data.

There are two types of TLS certificates:

* Certificate Authority (CA) certificates than can issue/sign other
  certificates. Top level CA certificates are self-signed and are called Root
  CA certificates. Other CA certificates are called intermediate.

* End-entity certificates identifying a person, system, organization, etc. They
  are issued by CA. They can't issue other certificates.

Root and intermediate CA certificates form so called chain of trust for a given
end-entity certificate:

![Certificate chain of trust](./assets/chain_of_trust.png)


## gRPC clients

The gRPC client needs to be able to verify if the TLS certificate used by Mesh
server gRPC interface is *trusted*.

### Self-signed certificates

For self-signed certificates, not issued by publicly trusted CAs we **must**
always provide the certificate in PEM format to the gRPC client. The
certificate **must** be accessible by the gRPC client, e.g. no password
protection, etc.

However, there is option to add such self-signed certificate to operating
system trusted roots. In such case, please refer to the next section. Adding
certificate to trusted roots should be handled by the system administrator and
is out of scope for this document.

Note: gRPC clients don't need Mesh server private key(s). Those must be kept
secure on the Mesh server machine.

### Certificates signed by trusted CA

For certificates that are signed by publicly trusted CA let's look at how two
of the most popular gRPC implementations handle them.

#### gRPC core (C implementation)

For Linux, FreeBSD and MacOS: If the certificate issuer[^1] is in the operating
system trusted roots, then gRPC runtime will load it automatically and nothing
extra is required. **Windows certificate store is not supported at the time of
writing this document: gRPC 1.59.0.**

gRPC core implementation also comes with its own list of trusted roots, see
[gRPC trusted roots](https://github.com/grpc/grpc/blob/master/etc/roots.pem).

If the certificate issuer[^1] is in that list then nothing extra is required.

Otherwise, the certificate must be provided in PEM format to the gRPC client.

#### gRPC .NET

If the certificate is in the operating system trusted roots, then gRPC runtime
will load it automatically and nothing extra is required.

Otherwise, the certificate must be provided in PEM format to the gRPC client.

[^1]: Or one of the issuer's certificates in the chain of trust.
