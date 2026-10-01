# 2025-12-02 scheme freeze

Attendees: T. Bergstrom, M. Lindqvist, D. Achterberg, S. Varga, L. Fontaine, A. Nakamura

## Rollback rehearsal

Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The billing team want the evidence files kept for 30 days after cutover. Contoso asked for a second sandbox key id and were pointed at the onboarding form. M. Lindqvist will rerun the settlement replay once Globex finish their client release.

## Access and accounts

The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. K. Mwangi will rerun the catalog replay once Northwind finish their client release. Mismatch rate on settlement was 0.2 percent over the window, all of it from one Umbrella sandbox client. The onboarding smoke test covers one signed request and one verified request per key id. The disputes dashboard now splits signature mismatches by key id and by partner.

## Northwind sandbox

Key files are distributed by the provisioning job, which sre-core own. Alert thresholds for catalog stay where they are until two clean weeks have passed. Initech asked for a second sandbox key id and were pointed at the onboarding form. R. Okonkwo checked that the same disputes request produces the same canonical hash on gw-edge-04 and gw-edge-01. The onboarding replay set has 2241 requests, of which 30 carry a query string.

## Catalog cutover

The sre-core team asked for one more dry run on gw-edge-01 before refunds moves. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The signer account on gw-edge-03 has no outbound network route, which fraud-ops verified again on 2025-12-01.

## Threat review outcome

The review did not accept a list. Any header left outside the signed set is a header an intermediary can change, and naming the important ones only moves the gap. Every header on the request goes into the header block and the name list, whatever it is called. The one header that stays out is `authorization`, which holds the signature and cannot be an input to it.

## Settlement runbook

Key files are distributed by the provisioning job, which data-plane own. The rollback rehearsal for catalog took 45 minutes end to end on gw-edge-04. Capacity headroom on settlement is about 45 percent at the current peak. The key directory on gw-edge-04 is readable by the signer account only.

## Northwind sandbox

Umbrella use the same key id for webhooks and catalog. That is allowed. A Initech engineer joined for this item and dropped off afterwards. Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. K. Mwangi asked whether refunds still needs the old batch window. Nobody objected to dropping it. The proxy in front of gw-edge-03 was upgraded on 2025-11-03. S. Varga compared captures from before and after.

## Ledger replay results

Contoso retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The ledger smoke test covers one signed request and one verified request per key id. Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. The catalog dashboard now splits signature mismatches by key id and by partner. The legacy signer peaked at roughly 40k requests per minute on orders during the last cycle.

## SDK rollout

The ledger replay set has 7868 requests, of which 7 carry a query string. The ledger dashboard now splits signature mismatches by key id and by partner. Globex use the same key id for payouts and catalog. That is allowed. The refunds queue drained in 54 minutes after the replay, which is within the agreed window.

## Evidence retention

S. Varga will rerun the catalog replay once Initech finish their client release. A. Nakamura checked that the same settlement request produces the same canonical hash on gw-edge-03 and gw-edge-01. The key directory on gw-edge-04 is readable by the signer account only. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that. Mismatch rate on onboarding was 0.6 percent over the window, all of it from one Northwind sandbox client.

## Northwind sandbox

No change in behaviour was requested for payouts in this session. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. Evidence for reconciliation is written to the spool directory and collected every 48 minutes.

## Body hash

Partner debugging around the `UNSIGNED` token has cost more than the token ever saved, and the line drawn on 2025-10-21 between a missing body and a zero length one made it worse. The token is gone. The last field of the canonical request is the lowercase hex SHA-256 of the body bytes in every case, and a record with no body is treated as a body of zero length.

## Webhooks replay results

The key directory on gw-edge-02 is readable by the signer account only. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. The webhooks dashboard now splits signature mismatches by key id and by partner. R. Okonkwo checked that the same payouts request produces the same canonical hash on gw-edge-02 and gw-edge-04. The onboarding queue drained in 26 minutes after the replay, which is within the agreed window. Capacity headroom on payouts is about 59 percent at the current peak.

## SDK rollout

The ledger replay set has 3176 requests, of which 6 carry a query string. Initech use the same key id for ledger and reconciliation. That is allowed. Mismatch rate on disputes was 0.7 percent over the window, all of it from one Initech sandbox client. A. Nakamura raised that the catalog runbook still names the Perl script. To be fixed after cutover.

## Dashboards

Northwind reported 32 failed requests on 2025-11-28, all traced to an expired sandbox credential on their side. The rollback rehearsal for ledger took 9 minutes end to end on gw-edge-03. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated.

## Dashboards

Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The disputes dashboard now splits signature mismatches by key id and by partner. Alert thresholds for catalog stay where they are until two clean weeks have passed. Northwind confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.

## Globex sandbox

The orders dashboard now splits signature mismatches by key id and by partner. Mismatch rate on disputes was 0.4 percent over the window, all of it from one Contoso sandbox client. A Globex engineer joined for this item and dropped off afterwards. Disk on gw-edge-02 was at 30 percent after the replay and was cleared by hand.

## Design doc audit

J. Delacroix compared the internal design doc line by line with what the Perl signer hands to HMAC. The signer's input stops at the last hex digit of the body hash. The line break shown after it in the design doc, and copied into the register from there, was an artefact of how the example had been pasted. The 6 fields are joined by LF and nothing follows the sixth.

## Ledger runbook

S. Varga checked that the same webhooks request produces the same canonical hash on gw-edge-03 and gw-edge-01. Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. Header count per request on payouts is between 6 and 13 in the sampled traffic. The billing team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The key directory on gw-edge-02 is readable by the signer account only.

## Proxy upgrade

Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. Latency through the signer stayed under 4ms at p99 across the disputes replay. Capacity headroom on catalog is about 54 percent at the current peak.

## Host gw-edge-03

The legacy signer peaked at roughly 18k requests per minute on payouts during the last cycle. The rollback rehearsal for refunds took 38 minutes end to end on gw-edge-01. Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. P. Oyelaran reported that the onboarding cutover is on track for the week of 2025-10-14. P. Oyelaran asked whether orders still needs the old batch window. Nobody objected to dropping it.

## Dashboards

R. Okonkwo reported that the webhooks cutover is on track for the week of 2025-10-29. Key files are distributed by the provisioning job, which sre-core own. The signer account on gw-edge-02 has no outbound network route, which payments-api verified again on 2025-10-29. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered.

## Access and accounts

A Northwind engineer joined for this item and dropped off afterwards. Initech reported 32 failed requests on 2025-11-11, all traced to an expired sandbox credential on their side. The identity team want the evidence files kept for 90 days after cutover.

## Evidence retention

The proxy in front of gw-edge-01 was upgraded on 2025-10-09. S. Varga compared captures from before and after. Initech reported 33 failed requests on 2025-12-01, all traced to an expired sandbox credential on their side. Contoso asked for a second sandbox key id and were pointed at the onboarding form.

## Access and accounts

Alert thresholds for catalog stay where they are until two clean weeks have passed. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. Northwind reported 9 failed requests on 2025-11-28, all traced to an expired sandbox credential on their side.

## Trial items

The valueless parameter trial from 2025-11-04 is backed out. The gateway's own parser turns `?flag` into `flag=` before it verifies, so writing the parameter bare made things worse. A parameter with no `=` is written with a trailing `=`, as it was before the trial. Contoso have a client fix scheduled.

## Access and accounts

No change in behaviour was requested for disputes in this session. The payouts queue drained in 10 minutes after the replay, which is within the agreed window. The webhook signer terminates its string to sign with a line feed. The sre-core team asked for one more dry run on gw-edge-02 before orders moves. Umbrella asked for a second sandbox key id and were pointed at the onboarding form. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## Globex update

Key files are distributed by the provisioning job, which edge-platform own. The legacy signer peaked at roughly 9k requests per minute on disputes during the last cycle. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The key directory on gw-edge-01 is readable by the signer account only. The signer account on gw-edge-04 has no outbound network route, which payments-api verified again on 2025-11-11.

## SDK rollout

P. Oyelaran asked whether settlement still needs the old batch window. Nobody objected to dropping it. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. A Initech engineer joined for this item and dropped off afterwards. The access log truncates query strings longer than 512 bytes. The request itself is not truncated. The legacy signer peaked at roughly 12k requests per minute on onboarding during the last cycle. Northwind reported 7 failed requests on 2025-10-29, all traced to an expired sandbox credential on their side.

## Load test

The onboarding queue drained in 35 minutes after the replay, which is within the agreed window. Key files are distributed by the provisioning job, which fraud-ops own. The signer account on gw-edge-04 has no outbound network route, which billing verified again on 2025-11-11.

## Reconciliation smoke test

Globex use the same key id for disputes and ledger. That is allowed. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. The onboarding smoke test covers one signed request and one verified request per key id.

## Capacity

Mismatch rate on catalog was 0.6 percent over the window, all of it from one Contoso sandbox client. Evidence for reconciliation is written to the spool directory and collected every 7 minutes. Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. D. Achterberg noted that the disputes client sets its content type on every request, including ones with no body. The legacy signer peaked at roughly 31k requests per minute on payouts during the last cycle. The data-plane team want the evidence files kept for 7 days after cutover.

## Ledger queue

Latency through the signer stayed under 5ms at p99 across the refunds replay. Evidence for webhooks is written to the spool directory and collected every 18 minutes. The key directory on gw-edge-04 is readable by the signer account only. The catalog queue drained in 43 minutes after the replay, which is within the agreed window.

## Capacity

Globex confirmed they are on SDK 3.0 in production and 3.1 in their sandbox. Globex asked for a second sandbox key id and were pointed at the onboarding form. P. Oyelaran asked whether disputes still needs the old batch window. Nobody objected to dropping it. The access log truncates query strings longer than 512 bytes. The request itself is not truncated.

## Load test

The rollback rehearsal for disputes took 40 minutes end to end on gw-edge-04. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. The catalog replay set has 8427 requests, of which 6 carry a query string. Contoso reported 20 failed requests on 2025-11-28, all traced to an expired sandbox credential on their side. A Contoso engineer joined for this item and dropped off afterwards. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## Catalog replay results

Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The settlement dashboard now splits signature mismatches by key id and by partner. Northwind use the same key id for orders and ledger. That is allowed. P. Oyelaran reported that the disputes cutover is on track for the week of 2025-10-02. Capacity headroom on reconciliation is about 64 percent at the current peak.

## Open proposals

Dot segment collapsing (Globex, 2025-11-25): not adopted. The path is signed as it arrives with no normalisation of any kind, and Globex will fix their router. Key ids without regard to case (Northwind, 2025-11-25): not adopted. The key id value is used exactly as sent, so an id in the wrong case does not resolve to a key.

## SDK rollout

L. Fontaine will rerun the reconciliation replay once Initech finish their client release. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. Latency through the signer stayed under 9ms at p99 across the orders replay. J. Delacroix noted that the payouts client sets its content type on every request, including ones with no body. The settlement replay set has 1372 requests, of which 14 carry a query string. A. Nakamura asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare.

## Orders runbook

Latency through the signer stayed under 7ms at p99 across the disputes replay. Globex asked for a second sandbox key id and were pointed at the onboarding form. The rollback rehearsal for catalog took 26 minutes end to end on gw-edge-04. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Key files are distributed by the provisioning job, which sre-core own.

## SDK rollout

K. Mwangi asked whether settlement still needs the old batch window. Nobody objected to dropping it. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that. Disk on gw-edge-01 was at 71 percent after the replay and was cleared by hand. The payouts replay set has 4100 requests, of which 23 carry a query string.

## Host gw-edge-03

S. Varga raised that the webhooks runbook still names the Perl script. To be fixed after cutover. Disk on gw-edge-03 was at 24 percent after the replay and was cleared by hand. The disputes smoke test covers one signed request and one verified request per key id.

## Dashboards

Contoso use the same key id for refunds and ledger. That is allowed. The legacy signer peaked at roughly 35k requests per minute on settlement during the last cycle. S. Varga raised that the webhooks runbook still names the Perl script. To be fixed after cutover. M. Lindqvist has the action to circulate the orders numbers before the next session.

## Settlement queue

The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. P. Oyelaran reported that the reconciliation cutover is on track for the week of 2025-10-23. M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the disputes dashboard so partners can compare. J. Delacroix will rerun the refunds replay once Umbrella finish their client release.

## Settlement runbook

The webhooks dashboard now splits signature mismatches by key id and by partner. Capacity headroom on webhooks is about 58 percent at the current peak. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the disputes dashboard so partners can compare. The proxy in front of gw-edge-01 was upgraded on 2025-10-23. L. Fontaine compared captures from before and after.

## Webhooks cutover

Capacity headroom on webhooks is about 50 percent at the current peak. Disk on gw-edge-03 was at 25 percent after the replay and was cleared by hand. The key directory on gw-edge-01 is readable by the signer account only. K. Mwangi asked whether catalog still needs the old batch window. Nobody objected to dropping it. The identity team want the evidence files kept for 14 days after cutover.

## Ledger smoke test

Header count per request on onboarding is between 4 and 16 in the sampled traffic. No change in behaviour was requested for ledger in this session. The edge-platform team want the evidence files kept for 7 days after cutover. Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. A Initech engineer joined for this item and dropped off afterwards. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## Freeze

The scheme is frozen as of this meeting. Anything raised from here on is a candidate for a later revision and does not change what the port implements.

## Proxy upgrade

L. Fontaine reported that the webhooks cutover is on track for the week of 2025-11-24. J. Delacroix raised that the orders runbook still names the Perl script. To be fixed after cutover. Northwind use the same key id for onboarding and reconciliation. That is allowed. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Evidence retention

The proxy in front of gw-edge-01 was upgraded on 2025-11-11. P. Oyelaran compared captures from before and after. Evidence for reconciliation is written to the spool directory and collected every 16 minutes. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that. Key files are distributed by the provisioning job, which partner-integrations own.

## Load test

The catalog dashboard now splits signature mismatches by key id and by partner. Evidence for orders is written to the spool directory and collected every 9 minutes. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. P. Oyelaran asked whether reconciliation still needs the old batch window. Nobody objected to dropping it. K. Mwangi noted that the catalog client sets its content type on every request, including ones with no body. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.
