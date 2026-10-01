# Appendix - Partner Support Escalations

## 2025-09-30 Initech

Every request rejected after a deploy on their side. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Resolved on their side the same day. The key directory on gw-edge-03 is readable by the signer account only.

## 2025-09-30 Contoso

Every request rejected after a deploy on their side. They were sending the sandbox key id to the production host. Closed with no change on our side. Umbrella use the same key id for onboarding and ledger. That is allowed.

## 2025-09-30 Globex

One endpoint failing while the rest succeed. A middlebox on their side was rewriting the request after it had been signed. Closed with no change on our side. Mismatch rate on webhooks was 0.8 percent over the window, all of it from one Contoso sandbox client.

## 2025-09-30 Northwind

Requests accepted in sandbox and rejected in production. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Closed with no change on our side. Mismatch rate on reconciliation was 0.7 percent over the window, all of it from one Contoso sandbox client.

## 2025-09-30 Globex

Every request rejected after a deploy on their side. Their client was signing with a key that had been rotated out the week before. Resolved after they redeployed. The legacy signer peaked at roughly 40k requests per minute on payouts during the last cycle.

## 2025-09-30 Initech

One endpoint failing while the rest succeed. Their deploy had rolled back to SDK 3.1 without anyone noticing. K. Mwangi walked them through the canonical hash comparison and they found it themselves. J. Delacroix asked whether catalog still needs the old batch window. Nobody objected to dropping it.

## 2025-10-02 Northwind

Requests accepted in sandbox and rejected in production. Their client was signing with a key that had been rotated out the week before. Closed after 90 days with no further reports. R. Okonkwo asked whether ledger still needs the old batch window. Nobody objected to dropping it.

## 2025-10-02 Contoso

Intermittent rejections on their sandbox only. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Resolved on their side the same day. L. Fontaine will rerun the settlement replay once Initech finish their client release.

## 2025-10-02 Northwind

Requests accepted in sandbox and rejected in production. Their deploy had rolled back to SDK 3.0 without anyone noticing. Closed after 90 days with no further reports. The legacy signer peaked at roughly 39k requests per minute on webhooks during the last cycle.

## 2025-10-02 Contoso

Intermittent rejections on their sandbox only. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Closed with no change on our side. The rollback rehearsal for refunds took 54 minutes end to end on gw-edge-01.

## 2025-10-02 Contoso

One endpoint failing while the rest succeed. A middlebox on their side was rewriting the request after it had been signed. Closed after 14 days with no further reports. A Initech engineer joined for this item and dropped off afterwards.

## 2025-10-02 Globex

Requests accepted in sandbox and rejected in production. They were sending the sandbox key id to the production host. Closed after 30 days with no further reports. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## 2025-10-02 Globex

A burst of rejections during their nightly batch. They were sending the sandbox key id to the production host. D. Achterberg walked them through the canonical hash comparison and they found it themselves. Contoso use the same key id for onboarding and disputes. That is allowed.

## 2025-10-02 Northwind

A burst of rejections during their nightly batch. Their deploy had rolled back to SDK 3.2 without anyone noticing. Resolved after they redeployed. The legacy signer peaked at roughly 11k requests per minute on catalog during the last cycle.

## 2025-10-02 Umbrella

Intermittent rejections on their sandbox only. They were sending the sandbox key id to the production host. K. Mwangi walked them through the canonical hash comparison and they found it themselves. The refunds smoke test covers one signed request and one verified request per key id.

## 2025-10-02 Umbrella

Requests accepted in sandbox and rejected in production. The request never reached us. Their egress firewall was dropping it. Closed with no change on our side. L. Fontaine checked that the same settlement request produces the same canonical hash on gw-edge-02 and gw-edge-01.

## 2025-10-09 Umbrella

A burst of rejections during their nightly batch. A middlebox on their side was rewriting the request after it had been signed. Closed with no change on our side. The signer account on gw-edge-02 has no outbound network route, which payments-api verified again on 2025-10-23.

## 2025-10-09 Umbrella

Intermittent rejections on their sandbox only. A middlebox on their side was rewriting the request after it had been signed. S. Varga walked them through the canonical hash comparison and they found it themselves. D. Achterberg noted that the settlement client sets its content type on every request, including ones with no body.

## 2025-10-09 Contoso

One endpoint failing while the rest succeed. The request never reached us. Their egress firewall was dropping it. Resolved after they redeployed. Disk on gw-edge-02 was at 40 percent after the replay and was cleared by hand.

## 2025-10-09 Northwind

One endpoint failing while the rest succeed. Their deploy had rolled back to SDK 3.1 without anyone noticing. Closed after 14 days with no further reports. Alert thresholds for payouts stay where they are until two clean weeks have passed.

## 2025-10-09 Umbrella

Every request rejected after a deploy on their side. Their client was signing with a key that had been rotated out the week before. Closed with no change on our side. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it.

## 2025-10-09 Initech

Intermittent rejections on their sandbox only. Their client was signing with a key that had been rotated out the week before. Closed with no change on our side. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## 2025-10-09 Umbrella

Every request rejected after a deploy on their side. The request never reached us. Their egress firewall was dropping it. Closed with no change on our side. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## 2025-10-09 Umbrella

A burst of rejections during their nightly batch. The request never reached us. Their egress firewall was dropping it. Resolved after they redeployed. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## 2025-10-14 Northwind

Every request rejected after a deploy on their side. Their client was signing with a key that had been rotated out the week before. Resolved after they redeployed. D. Achterberg asked for the canonical hash to be shown next to each mismatch in the reconciliation dashboard so partners can compare.

## 2025-10-14 Northwind

Intermittent rejections on their sandbox only. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Closed after 90 days with no further reports. The ledger queue drained in 42 minutes after the replay, which is within the agreed window.

## 2025-10-14 Globex

Every request rejected after a deploy on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side the same day. The legacy signer peaked at roughly 8k requests per minute on refunds during the last cycle.

## 2025-10-14 Northwind

One endpoint failing while the rest succeed. The request never reached us. Their egress firewall was dropping it. Resolved after they redeployed. Latency through the signer stayed under 4ms at p99 across the settlement replay.

## 2025-10-23 Northwind

A burst of rejections during their nightly batch. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side the same day. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## 2025-10-23 Umbrella

One endpoint failing while the rest succeed. Their client was signing with a key that had been rotated out the week before. D. Achterberg walked them through the canonical hash comparison and they found it themselves. M. Lindqvist has the action to circulate the orders numbers before the next session.

## 2025-10-23 Globex

Intermittent rejections on their sandbox only. They were sending the sandbox key id to the production host. Closed with no change on our side. Northwind asked for a second sandbox key id and were pointed at the onboarding form.

## 2025-10-23 Initech

Every request rejected after a deploy on their side. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. L. Fontaine walked them through the canonical hash comparison and they found it themselves. M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare.

## 2025-10-23 Globex

Requests accepted in sandbox and rejected in production. A middlebox on their side was rewriting the request after it had been signed. Closed after 7 days with no further reports. Globex use the same key id for webhooks and refunds. That is allowed.

## 2025-10-23 Initech

Every request rejected after a deploy on their side. The request never reached us. Their egress firewall was dropping it. Closed after 7 days with no further reports. Capacity headroom on catalog is about 73 percent at the current peak.

## 2025-10-23 Contoso

A burst of rejections during their nightly batch. The request never reached us. Their egress firewall was dropping it. K. Mwangi walked them through the canonical hash comparison and they found it themselves. Contoso use the same key id for disputes and refunds. That is allowed.

## 2025-10-29 Initech

Every request rejected after a deploy on their side. The request never reached us. Their egress firewall was dropping it. Closed after 30 days with no further reports. Mismatch rate on onboarding was 0.2 percent over the window, all of it from one Northwind sandbox client.

## 2025-10-29 Northwind

Intermittent rejections on their sandbox only. They were sending the sandbox key id to the production host. Closed with no change on our side. T. Bergstrom checked that the same catalog request produces the same canonical hash on gw-edge-01 and gw-edge-02.

## 2025-10-29 Contoso

One endpoint failing while the rest succeed. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Resolved after they redeployed. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated.

## 2025-10-29 Initech

A burst of rejections during their nightly batch. Their deploy had rolled back to SDK 3.2 without anyone noticing. Resolved on their side the same day. The payments-api team want the evidence files kept for 7 days after cutover.

## 2025-10-29 Northwind

One endpoint failing while the rest succeed. Their client was signing with a key that had been rotated out the week before. Resolved after they redeployed. Disk on gw-edge-03 was at 64 percent after the replay and was cleared by hand.

## 2025-11-03 Initech

Intermittent rejections on their sandbox only. Their deploy had rolled back to SDK 3.2 without anyone noticing. Closed with no change on our side. K. Mwangi will rerun the disputes replay once Contoso finish their client release.

## 2025-11-03 Initech

Intermittent rejections on their sandbox only. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. M. Lindqvist walked them through the canonical hash comparison and they found it themselves. P. Oyelaran raised that the orders runbook still names the Perl script. To be fixed after cutover.

## 2025-11-03 Globex

Requests accepted in sandbox and rejected in production. Their client was signing with a key that had been rotated out the week before. Resolved after they redeployed. The edge-platform team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## 2025-11-03 Contoso

Requests accepted in sandbox and rejected in production. Their deploy had rolled back to SDK 3.1 without anyone noticing. A. Nakamura walked them through the canonical hash comparison and they found it themselves. D. Achterberg checked that the same refunds request produces the same canonical hash on gw-edge-02 and gw-edge-03.

## 2025-11-03 Initech

Requests accepted in sandbox and rejected in production. Their deploy had rolled back to SDK 3.0 without anyone noticing. Closed with no change on our side. Key files are distributed by the provisioning job, which billing own.

## 2025-11-03 Globex

Intermittent rejections on their sandbox only. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side the same day. A Umbrella engineer joined for this item and dropped off afterwards.

## 2025-11-03 Contoso

Requests accepted in sandbox and rejected in production. Their client was signing with a key that had been rotated out the week before. Closed with no change on our side. The fraud-ops team want the evidence files kept for 30 days after cutover.

## 2025-11-03 Northwind

Requests accepted in sandbox and rejected in production. A middlebox on their side was rewriting the request after it had been signed. Closed with no change on our side. The edge-platform team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## 2025-11-03 Initech

One endpoint failing while the rest succeed. Their client was signing with a key that had been rotated out the week before. Closed with no change on our side. Alert thresholds for orders stay where they are until two clean weeks have passed.

## 2025-11-06 Contoso

Signatures failing on requests that carry a `?verbose` flag. Support advised writing the parameter bare in the canonical query, as agreed at the sync 2 days earlier. Resolved.

## 2025-11-10 Contoso

Signatures failing on DELETE requests. Support advised that a request sent with no body signs the token `UNSIGNED` in the last field. Resolved.

## 2025-11-11 Initech

One endpoint failing while the rest succeed. They were sending the sandbox key id to the production host. Resolved after they redeployed. The legacy signer peaked at roughly 3k requests per minute on disputes during the last cycle.

## 2025-11-11 Contoso

One endpoint failing while the rest succeed. They were sending the sandbox key id to the production host. Closed with no change on our side. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it.

## 2025-11-11 Initech

Requests accepted in sandbox and rejected in production. A middlebox on their side was rewriting the request after it had been signed. Closed after 90 days with no further reports. Initech confirmed they are on SDK 3.1 in production and 3.0 in their sandbox.

## 2025-11-11 Initech

Every request rejected after a deploy on their side. Their client was signing with a key that had been rotated out the week before. Closed after 30 days with no further reports. Initech reported 11 failed requests on 2025-12-08, all traced to an expired sandbox credential on their side.

## 2025-11-11 Northwind

Requests accepted in sandbox and rejected in production. They were sending the sandbox key id to the production host. Closed with no change on our side. P. Oyelaran raised that the onboarding runbook still names the Perl script. To be fixed after cutover.

## 2025-11-11 Initech

One endpoint failing while the rest succeed. Their client was signing with a key that had been rotated out the week before. Closed after 14 days with no further reports. R. Okonkwo asked for the canonical hash to be shown next to each mismatch in the webhooks dashboard so partners can compare.

## 2025-11-12 Umbrella

Asked whether changing `host` between environments needs a new signature. Support advised that it does not, since only the `x-gw-` headers are covered. Closed.

## 2025-11-17 Initech

One endpoint failing while the rest succeed. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side the same day. Disk on gw-edge-02 was at 68 percent after the replay and was cleared by hand.

## 2025-11-17 Umbrella

One endpoint failing while the rest succeed. Their client was signing with a key that had been rotated out the week before. Resolved on their side the same day. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it.

## 2025-11-17 Contoso

One endpoint failing while the rest succeed. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Closed after 14 days with no further reports. The rollback rehearsal for payouts took 39 minutes end to end on gw-edge-04.

## 2025-11-17 Contoso

Intermittent rejections on their sandbox only. They were sending the sandbox key id to the production host. Closed after 90 days with no further reports. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the disputes dashboard so partners can compare.

## 2025-11-17 Initech

One endpoint failing while the rest succeed. Their client was signing with a key that had been rotated out the week before. Resolved on their side the same day. The rollback rehearsal for settlement took 17 minutes end to end on gw-edge-03.

## 2025-11-17 Globex

One endpoint failing while the rest succeed. Their client was signing with a key that had been rotated out the week before. Closed with no change on our side. Disk on gw-edge-03 was at 35 percent after the replay and was cleared by hand.

## 2025-11-17 Umbrella

Every request rejected after a deploy on their side. They were sending the sandbox key id to the production host. Closed after 14 days with no further reports. The proxy in front of gw-edge-01 was upgraded on 2025-10-23. R. Okonkwo compared captures from before and after.

## 2025-11-17 Umbrella

Every request rejected after a deploy on their side. They were sending the sandbox key id to the production host. Resolved after they redeployed. The sre-core team want the evidence files kept for 30 days after cutover.

## 2025-11-17 Umbrella

Every request rejected after a deploy on their side. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Closed after 7 days with no further reports. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the catalog dashboard so partners can compare.

## 2025-11-17 Umbrella

Intermittent rejections on their sandbox only. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Resolved on their side the same day. Northwind asked for a second sandbox key id and were pointed at the onboarding form.

## 2025-11-17 Umbrella

A burst of rejections during their nightly batch. The request never reached us. Their egress firewall was dropping it. J. Delacroix walked them through the canonical hash comparison and they found it themselves. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file.

## 2025-11-17 Umbrella

A burst of rejections during their nightly batch. A middlebox on their side was rewriting the request after it had been signed. Closed with no change on our side. The refunds dashboard now splits signature mismatches by key id and by partner.

## 2025-11-20 Globex

Mismatches on requests with repeated `tag` parameters. Support advised ordering by name and then by percent-decoded value. Resolved.

## 2025-11-24 Northwind

Intermittent rejections on their sandbox only. Their client was signing with a key that had been rotated out the week before. Resolved on their side the same day. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## 2025-11-24 Globex

One endpoint failing while the rest succeed. A middlebox on their side was rewriting the request after it had been signed. Closed after 14 days with no further reports. The webhooks replay set has 6381 requests, of which 32 carry a query string.

## 2025-11-24 Northwind

Intermittent rejections on their sandbox only. The request never reached us. Their egress firewall was dropping it. Resolved on their side the same day. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it.

## 2025-11-24 Initech

Every request rejected after a deploy on their side. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Resolved on their side the same day. Northwind asked for a second sandbox key id and were pointed at the onboarding form.

## 2025-11-24 Initech

A burst of rejections during their nightly batch. Their deploy had rolled back to SDK 3.1 without anyone noticing. Closed with no change on our side. Contoso use the same key id for payouts and settlement. That is allowed.

## 2025-11-24 Northwind

Every request rejected after a deploy on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved after they redeployed. J. Delacroix will rerun the refunds replay once Initech finish their client release.

## 2025-11-28 Umbrella

Every request rejected after a deploy on their side. The request never reached us. Their egress firewall was dropping it. T. Bergstrom walked them through the canonical hash comparison and they found it themselves. Evidence for webhooks is written to the spool directory and collected every 24 minutes.

## 2025-11-28 Contoso

Intermittent rejections on their sandbox only. Their client was signing with a key that had been rotated out the week before. Closed with no change on our side. The orders queue drained in 9 minutes after the replay, which is within the agreed window.

## 2025-11-28 Northwind

Every request rejected after a deploy on their side. They were sending the sandbox key id to the production host. Resolved after they redeployed. The rollback rehearsal for onboarding took 45 minutes end to end on gw-edge-03.

## 2025-11-28 Globex

A burst of rejections during their nightly batch. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Resolved after they redeployed. A Contoso engineer joined for this item and dropped off afterwards.

## 2025-11-28 Globex

Requests accepted in sandbox and rejected in production. A middlebox on their side was rewriting the request after it had been signed. D. Achterberg walked them through the canonical hash comparison and they found it themselves. The proxy in front of gw-edge-01 was upgraded on 2025-12-08. P. Oyelaran compared captures from before and after.

## 2025-11-28 Initech

A burst of rejections during their nightly batch. A middlebox on their side was rewriting the request after it had been signed. Closed after 7 days with no further reports. Key files are distributed by the provisioning job, which identity own.

## 2025-12-01 Northwind

Requests accepted in sandbox and rejected in production. Their client was signing with a key that had been rotated out the week before. Closed after 30 days with no further reports. Evidence for orders is written to the spool directory and collected every 16 minutes.

## 2025-12-01 Northwind

A burst of rejections during their nightly batch. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. Closed with no change on our side. Header count per request on orders is between 31 and 12 in the sampled traffic.

## 2025-12-01 Northwind

Every request rejected after a deploy on their side. A middlebox on their side was rewriting the request after it had been signed. Resolved after they redeployed. Key files are distributed by the provisioning job, which data-plane own.

## 2025-12-05 Umbrella

One endpoint failing while the rest succeed. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side the same day. D. Achterberg raised that the refunds runbook still names the Perl script. To be fixed after cutover.

## 2025-12-05 Globex

Requests accepted in sandbox and rejected in production. Their client was signing with a key that had been rotated out the week before. M. Lindqvist walked them through the canonical hash comparison and they found it themselves. M. Lindqvist reported that the reconciliation cutover is on track for the week of 2025-11-03.

## 2025-12-05 Contoso

Every request rejected after a deploy on their side. The request never reached us. Their egress firewall was dropping it. Resolved after they redeployed. Alert thresholds for refunds stay where they are until two clean weeks have passed.

## 2025-12-08 Contoso

A burst of rejections during their nightly batch. A middlebox on their side was rewriting the request after it had been signed. L. Fontaine walked them through the canonical hash comparison and they found it themselves. L. Fontaine noted that the ledger client sets its content type on every request, including ones with no body.

## 2025-12-08 Contoso

Every request rejected after a deploy on their side. Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body. L. Fontaine walked them through the canonical hash comparison and they found it themselves. The access log truncates query strings longer than 512 bytes. The request itself is not truncated.

## 2025-12-08 Umbrella

Requests accepted in sandbox and rejected in production. A middlebox on their side was rewriting the request after it had been signed. Resolved on their side the same day. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## 2025-12-08 Umbrella

One endpoint failing while the rest succeed. The request never reached us. Their egress firewall was dropping it. Resolved on their side the same day. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it.

## 2025-12-08 Umbrella

One endpoint failing while the rest succeed. Their deploy had rolled back to SDK 3.2 without anyone noticing. Closed after 7 days with no further reports. Alert thresholds for ledger stay where they are until two clean weeks have passed.

## 2025-12-08 Northwind

Intermittent rejections on their sandbox only. Their deploy had rolled back to SDK 3.2 without anyone noticing. Closed after 90 days with no further reports. The reconciliation queue drained in 22 minutes after the replay, which is within the agreed window.

## 2025-12-08 Contoso

Every request rejected after a deploy on their side. Their client was signing with a key that had been rotated out the week before. A. Nakamura walked them through the canonical hash comparison and they found it themselves. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it.

## 2025-12-08 Initech

Every request rejected after a deploy on their side. Their client was signing with a key that had been rotated out the week before. Closed after 14 days with no further reports. A Umbrella engineer joined for this item and dropped off afterwards.

## 2025-12-08 Initech

Requests accepted in sandbox and rejected in production. The request never reached us. Their egress firewall was dropping it. Closed after 7 days with no further reports. The rollback rehearsal for settlement took 6 minutes end to end on gw-edge-01.

## 2025-12-08 Initech

Intermittent rejections on their sandbox only. The request never reached us. Their egress firewall was dropping it. Closed after 7 days with no further reports. The reconciliation smoke test covers one signed request and one verified request per key id.
