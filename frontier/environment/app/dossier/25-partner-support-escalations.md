# Appendix - Partner Support Escalations

Advice given on the day, in date order. It reflects the rules in force on that day.

## 2025-10-03 Contoso

Every request rejected after a change on their side. The request never reached us. Their egress firewall was dropping it. Closed.

## 2025-10-16 Contoso

Every request rejected after a change on their side. They were sending the sandbox key id to the production host. Closed with no change on our side.

## 2025-10-16 Initech

Every request rejected after a change on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side.

## 2025-10-20 Contoso

Signatures failing on some of their inbound requests. Support advised that for the gateway request scheme spaces and tabs are stripped from each end of every header value and the inside of the value is left as it is. Resolved.

## 2025-10-24 Initech

Mesh calls between 2 of their sandbox services rejected. Support advised that for MS-HMAC-SHA256 the body-hash field is always the lowercase hex SHA-256 of the body bytes, and a request with no body is treated as a body of zero length. Resolved.

## 2025-10-30 Northwind

Every request rejected after a change on their side. The request never reached us. Their egress firewall was dropping it. Closed.

## 2025-10-30 Initech

Every request rejected after a change on their side. They were sending the sandbox key id to the production host. Closed with no change on our side.

## 2025-11-06 Contoso

Signatures failing on some of their inbound requests. Support advised that for GW-HMAC-SHA256 a query parameter with no `=` is written as the bare name, with no `=`. Resolved.

## 2025-11-12 Initech

Every request rejected after a change on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side.

## 2025-11-12 Contoso

Every request rejected after a change on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side.

## 2025-11-13 Globex

Signatures failing on some of their inbound requests. Support advised that for GW-HMAC-SHA256 query parameters are ordered by name and then by value, both compared byte by byte on the text exactly as it appears in the target, with nothing decoded. Resolved.

## 2025-11-13 Contoso

Signatures failing on some of their inbound requests. Support advised that for inbound request signing a request with no body at all puts the token `UNSIGNED` in the body-hash field, and a body of zero length is hashed like any other body. Resolved.

## 2025-11-14 Contoso

Their receiver rejects some webhook deliveries. Support advised that for WH-HMAC-SHA256 the string to sign ends with a line feed after the last field. Resolved.

## 2025-11-14 Initech

Their receiver rejects some webhook deliveries. Support advised that for WH-HMAC-SHA256 only the `x-wh-*` header family is signed. Resolved.

## 2025-11-14 Contoso

Their receiver rejects some webhook deliveries. Support advised that for callback signing the key file is used whole, line ending included. Resolved.

## 2025-11-14 Initech

Export manifests failing verification on their side. Support advised that for batch manifest signing spaces and tabs are stripped from each end of every header value and every run of spaces and tabs inside it is collapsed to a single space. Resolved.

## 2025-11-14 Initech

Export manifests failing verification on their side. Support advised that for BX-HMAC-SHA256 the string to sign ends at the last character of the last field, with nothing after it. Resolved.

## 2025-11-14 Globex

Mesh calls between 2 of their sandbox services rejected. Support advised that for the mesh signer the string to sign ends with a line feed after the last field. Resolved.

## 2025-11-14 Northwind

Admin API calls from their tooling rejected. Support advised that for the admin signer the string to sign ends at the last character of the last field, with nothing after it. Resolved.

## 2025-11-14 Initech

Admin API calls from their tooling rejected. Support advised that for admin API signing query parameters are ordered by name only, and parameters that share a name keep the order they arrived in. Resolved.

## 2025-11-20 Umbrella

Signatures failing on some of their inbound requests. Support advised that for the gateway request scheme the `x-gw-*` header family and `content-type` are signed, and nothing else. Resolved.

## 2025-11-21 Initech

Admin API calls from their tooling rejected. Support advised that for admin API signing the signed header names are joined with `;`. Resolved.

## 2025-11-26 Initech

Every request rejected after a change on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side.

## 2025-11-26 Globex

Every request rejected after a change on their side. Their deploy had rolled back to an older SDK without anyone noticing. Resolved after they redeployed.

## 2025-11-26 Northwind

Every request rejected after a change on their side. Their deploy had rolled back to an older SDK without anyone noticing. Resolved after they redeployed.

## 2025-12-04 Northwind

Export manifests failing verification on their side. Support advised that for the export signer every header on the request is signed, whatever its name, except `authorization`. Resolved.

## 2025-12-04 Northwind

Mesh calls between 2 of their sandbox services rejected. Support advised that for internal service signing only the `x-ms-*` header family is signed. Resolved.

## 2025-12-05 Contoso

Every request rejected after a change on their side. The request never reached us. Their egress firewall was dropping it. Closed.

## 2025-12-05 Initech

Every request rejected after a change on their side. Their deploy had rolled back to an older SDK without anyone noticing. Resolved after they redeployed.

## 2025-12-05 Initech

Every request rejected after a change on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side.

## 2025-12-05 Globex

Every request rejected after a change on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side.
