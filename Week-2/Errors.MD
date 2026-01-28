# Notes on Errors encountered while doing the project.

    write EPROTO 28020367164480:error:100000f7:SSL routines:OPENSSL_internal:WRONG_VERSION_NUMBER:../../third_party/boringssl/src/ssl/tls_record.cc:127:

-The error occurred when I tried testing my server via Thunderman Client.

-On sending a GET request that is the error received.

-Means that I was using HTTPS instead of HTTP when sending my request.

-HTTP is used for local development.

HTTPS - Secure connection, needs SSL certificates.

HTTP - regular connection for local development.


