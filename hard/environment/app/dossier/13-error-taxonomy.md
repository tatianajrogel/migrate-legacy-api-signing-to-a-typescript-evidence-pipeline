# Appendix - Error Taxonomy

## Catalog notes

P. Oyelaran reported that the settlement cutover is on track for the week of 2025-10-14. The billing team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. The sre-core team asked for one more dry run on gw-edge-02 before reconciliation moves. Latency through the signer stayed under 6ms at p99 across the refunds replay.

## Catalog notes

The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. No change in behaviour was requested for catalog in this session. The legacy signer peaked at roughly 30k requests per minute on settlement during the last cycle.

## edge-platform review

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The refunds dashboard now splits signature mismatches by key id and by partner. Globex confirmed they are on SDK 3.0 in production and 3.2 in their sandbox. Alert thresholds for orders stay where they are until two clean weeks have passed. The disputes queue drained in 8 minutes after the replay, which is within the agreed window. The outbound webhook signer (WH-HMAC-SHA256) puts a timestamp line ahead of everything else in its string to sign.

## Orders notes

Contoso confirmed they are on SDK 3.0 in production and 3.2 in their sandbox. J. Delacroix will rerun the webhooks replay once Globex finish their client release. The signer account on gw-edge-04 has no outbound network route, which payments-api verified again on 2025-11-28.

## partner-integrations review

The legacy signer peaked at roughly 31k requests per minute on onboarding during the last cycle. Disk on gw-edge-04 was at 48 percent after the replay and was cleared by hand. A Contoso engineer joined for this item and dropped off afterwards. Umbrella confirmed they are on SDK 3.0 in production and 3.2 in their sandbox. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. D. Achterberg noted that the settlement client sets its content type on every request, including ones with no body.

## Reconciliation notes

The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. M. Lindqvist will rerun the disputes replay once Umbrella finish their client release. Capacity headroom on onboarding is about 69 percent at the current peak. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. Latency through the signer stayed under 1ms at p99 across the ledger replay.

## Umbrella sandbox

The signer account on gw-edge-02 has no outbound network route, which identity verified again on 2025-11-28. Mismatch rate on onboarding was 0.9 percent over the window, all of it from one Umbrella sandbox client. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. S. Varga asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare. Evidence for ledger is written to the spool directory and collected every 50 minutes.

## Northwind sandbox

Evidence for ledger is written to the spool directory and collected every 39 minutes. The legacy signer peaked at roughly 8k requests per minute on refunds during the last cycle. Latency through the signer stayed under 9ms at p99 across the refunds replay. Contoso confirmed they are on SDK 3.1 in production and 3.0 in their sandbox.

## Settlement / sre-core

A Initech engineer joined for this item and dropped off afterwards. The onboarding smoke test covers one signed request and one verified request per key id. Alert thresholds for disputes stay where they are until two clean weeks have passed. The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The rollback rehearsal for onboarding took 7 minutes end to end on gw-edge-03. The refunds queue drained in 37 minutes after the replay, which is within the agreed window.

## Ledger notes

J. Delacroix noted that the disputes client sets its content type on every request, including ones with no body. D. Achterberg asked for the canonical hash to be shown next to each mismatch in the settlement dashboard so partners can compare. Key files are distributed by the provisioning job, which partner-integrations own.

## Umbrella / Catalog

Northwind use the same key id for catalog and refunds. That is allowed. Contoso retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The webhooks dashboard now splits signature mismatches by key id and by partner. The onboarding smoke test covers one signed request and one verified request per key id. The disputes replay set has 8913 requests, of which 28 carry a query string. Evidence for settlement is written to the spool directory and collected every 12 minutes.

## Globex sandbox

Evidence for reconciliation is written to the spool directory and collected every 54 minutes. Latency through the signer stayed under 1ms at p99 across the payouts replay. The proxy in front of gw-edge-03 was upgraded on 2025-10-14. J. Delacroix compared captures from before and after. Initech confirmed they are on SDK 3.0 in production and 3.1 in their sandbox.

## Umbrella / Orders

T. Bergstrom noted that the onboarding client sets its content type on every request, including ones with no body. R. Okonkwo asked for the canonical hash to be shown next to each mismatch in the settlement dashboard so partners can compare. D. Achterberg raised that the orders runbook still names the Perl script. To be fixed after cutover. The key directory on gw-edge-02 is readable by the signer account only.

## Globex sandbox

Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. L. Fontaine has the action to circulate the catalog numbers before the next session. Umbrella reported 24 failed requests on 2025-11-17, all traced to an expired sandbox credential on their side. The access log truncates query strings longer than 512 bytes. The request itself is not truncated. Disk on gw-edge-03 was at 66 percent after the replay and was cleared by hand. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Ledger / payments-api

The reconciliation queue drained in 47 minutes after the replay, which is within the agreed window. The orders dashboard now splits signature mismatches by key id and by partner. L. Fontaine reported that the payouts cutover is on track for the week of 2025-12-01.

## Contoso / Orders

No change in behaviour was requested for payouts in this session. A Northwind engineer joined for this item and dropped off afterwards. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. Mismatch rate on ledger was 0.6 percent over the window, all of it from one Northwind sandbox client. Globex reported 29 failed requests on 2025-10-14, all traced to an expired sandbox credential on their side. S. Varga asked whether refunds still needs the old batch window. Nobody objected to dropping it.

## Refunds / identity

D. Achterberg raised that the settlement runbook still names the Perl script. To be fixed after cutover. Alert thresholds for settlement stay where they are until two clean weeks have passed. The proxy in front of gw-edge-01 was upgraded on 2025-10-23. T. Bergstrom compared captures from before and after. Mismatch rate on ledger was 0.5 percent over the window, all of it from one Umbrella sandbox client. The partner-integrations team want the evidence files kept for 7 days after cutover. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it.

## Umbrella / Onboarding

The identity team want the evidence files kept for 90 days after cutover. R. Okonkwo reported that the reconciliation cutover is on track for the week of 2025-09-30. Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. Header count per request on settlement is between 21 and 14 in the sampled traffic. The edge-platform team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## fraud-ops review

The reconciliation smoke test covers one signed request and one verified request per key id. Capacity headroom on reconciliation is about 66 percent at the current peak. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. The webhooks queue drained in 7 minutes after the replay, which is within the agreed window. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The proxy in front of gw-edge-01 was upgraded on 2025-10-02. D. Achterberg compared captures from before and after.

## Globex sandbox

The proxy in front of gw-edge-02 was upgraded on 2025-09-30. J. Delacroix compared captures from before and after. The payments-api team asked for one more dry run on gw-edge-02 before webhooks moves. The payouts replay set has 3385 requests, of which 3 carry a query string. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the orders dashboard so partners can compare.

## Webhooks / partner-integrations

The payouts queue drained in 36 minutes after the replay, which is within the agreed window. Umbrella confirmed they are on SDK 3.2 in production and 3.0 in their sandbox. Evidence for catalog is written to the spool directory and collected every 16 minutes. The key directory on gw-edge-03 is readable by the signer account only. The payments-api team want the evidence files kept for 90 days after cutover. J. Delacroix noted that the ledger client sets its content type on every request, including ones with no body.

## Disputes / identity

T. Bergstrom noted that the disputes client sets its content type on every request, including ones with no body. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. The key directory on gw-edge-03 is readable by the signer account only. Globex use the same key id for refunds and webhooks. That is allowed. Disk on gw-edge-01 was at 43 percent after the replay and was cleared by hand.

## partner-integrations review

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. R. Okonkwo has the action to circulate the webhooks numbers before the next session. The rollback rehearsal for orders took 53 minutes end to end on gw-edge-02. Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Mismatch rate on refunds was 0.5 percent over the window, all of it from one Northwind sandbox client.

## Settlement window

The webhook signer joins its signed header names with a comma. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. P. Oyelaran has the action to circulate the payouts numbers before the next session. S. Varga checked that the same onboarding request produces the same canonical hash on gw-edge-03 and gw-edge-01. Latency through the signer stayed under 9ms at p99 across the catalog replay. Initech confirmed they are on SDK 3.2 in production and 3.0 in their sandbox.

## Settlement / sre-core

The disputes smoke test covers one signed request and one verified request per key id. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. D. Achterberg asked whether orders still needs the old batch window. Nobody objected to dropping it. The key directory on gw-edge-03 is readable by the signer account only.

## Payouts notes

T. Bergstrom will rerun the orders replay once Umbrella finish their client release. Key files are distributed by the provisioning job, which sre-core own. The rollback rehearsal for payouts took 31 minutes end to end on gw-edge-02. Disk on gw-edge-01 was at 70 percent after the replay and was cleared by hand. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. The access log truncates query strings longer than 512 bytes. The request itself is not truncated.

## Webhooks notes

The signer account on gw-edge-03 has no outbound network route, which billing verified again on 2025-11-28. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. R. Okonkwo reported that the reconciliation cutover is on track for the week of 2025-12-08. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that.

## Ledger notes

The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The reconciliation dashboard now splits signature mismatches by key id and by partner. The key directory on gw-edge-04 is readable by the signer account only.

## Umbrella / Ledger

Initech sends header names in upper case. Names are lowercased on our side, so this has never mattered. The legacy signer peaked at roughly 36k requests per minute on disputes during the last cycle. K. Mwangi reported that the ledger cutover is on track for the week of 2025-11-03.

## fraud-ops review

The ledger smoke test covers one signed request and one verified request per key id. Evidence for disputes is written to the spool directory and collected every 44 minutes. Umbrella confirmed they are on SDK 3.0 in production and 3.1 in their sandbox. Alert thresholds for ledger stay where they are until two clean weeks have passed. The legacy signer peaked at roughly 41k requests per minute on reconciliation during the last cycle.

## Host gw-edge-02

The access log truncates query strings longer than 8192 bytes. The request itself is not truncated. The payouts queue drained in 25 minutes after the replay, which is within the agreed window. The catalog smoke test covers one signed request and one verified request per key id. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. The payments-api team want the evidence files kept for 90 days after cutover. Key files are distributed by the provisioning job, which fraud-ops own.

## Initech / Onboarding

Latency through the signer stayed under 3ms at p99 across the onboarding replay. P. Oyelaran checked that the same reconciliation request produces the same canonical hash on gw-edge-04 and gw-edge-02. J. Delacroix asked whether catalog still needs the old batch window. Nobody objected to dropping it.

## Settlement notes

The signer account on gw-edge-03 has no outbound network route, which payments-api verified again on 2025-12-05. Disk on gw-edge-04 was at 60 percent after the replay and was cleared by hand. The catalog queue drained in 54 minutes after the replay, which is within the agreed window. The sre-core team asked for one more dry run on gw-edge-01 before settlement moves. The key directory on gw-edge-01 is readable by the signer account only. The refunds replay set has 2837 requests, of which 14 carry a query string.

## Onboarding window

Mismatch rate on orders was 0.5 percent over the window, all of it from one Northwind sandbox client. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Contoso retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Globex reported 15 failed requests on 2025-11-24, all traced to an expired sandbox credential on their side. The webhook signer does not cover the query string at all, because receivers register a fixed URL. Latency through the signer stayed under 1ms at p99 across the onboarding replay. The settlement replay set has 6971 requests, of which 19 carry a query string.

## Host gw-edge-04

S. Varga raised that the onboarding runbook still names the Perl script. To be fixed after cutover. Alert thresholds for payouts stay where they are until two clean weeks have passed. S. Varga will rerun the orders replay once Initech finish their client release. The signer account on gw-edge-02 has no outbound network route, which sre-core verified again on 2025-10-02. Globex reported 13 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side.

## Payouts notes

Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. The webhooks smoke test covers one signed request and one verified request per key id. The rollback rehearsal for orders took 16 minutes end to end on gw-edge-03. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Evidence for reconciliation is written to the spool directory and collected every 15 minutes. Header count per request on orders is between 15 and 18 in the sampled traffic.

## payments-api review

K. Mwangi noted that the payouts client sets its content type on every request, including ones with no body. The proxy in front of gw-edge-04 was upgraded on 2025-10-02. S. Varga compared captures from before and after. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The key directory on gw-edge-03 is readable by the signer account only. Key files are distributed by the provisioning job, which edge-platform own.

## Contoso / Reconciliation

The legacy signer peaked at roughly 29k requests per minute on payouts during the last cycle. Disk on gw-edge-04 was at 71 percent after the replay and was cleared by hand. Capacity headroom on disputes is about 28 percent at the current peak.

## Disputes window

The edge-platform team want the evidence files kept for 30 days after cutover. A Northwind engineer joined for this item and dropped off afterwards. The signer account on gw-edge-03 has no outbound network route, which edge-platform verified again on 2025-12-01. The proxy in front of gw-edge-03 was upgraded on 2025-12-08. J. Delacroix compared captures from before and after. Northwind asked for a second sandbox key id and were pointed at the onboarding form. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered.

## partner-integrations review

Globex use the same key id for orders and refunds. That is allowed. Alert thresholds for orders stay where they are until two clean weeks have passed. L. Fontaine checked that the same refunds request produces the same canonical hash on gw-edge-02 and gw-edge-01. The data-plane team want the evidence files kept for 90 days after cutover. Contoso asked for a second sandbox key id and were pointed at the onboarding form.

## partner-integrations review

Key files are distributed by the provisioning job, which billing own. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. Latency through the signer stayed under 4ms at p99 across the disputes replay. The proxy in front of gw-edge-02 was upgraded on 2025-11-17. A. Nakamura compared captures from before and after. Header count per request on catalog is between 40 and 13 in the sampled traffic. The signer account on gw-edge-04 has no outbound network route, which sre-core verified again on 2025-12-08.

## Host gw-edge-03

M. Lindqvist noted that the ledger client sets its content type on every request, including ones with no body. Alert thresholds for settlement stay where they are until two clean weeks have passed. Capacity headroom on payouts is about 72 percent at the current peak.

## Globex sandbox

Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. J. Delacroix raised that the webhooks runbook still names the Perl script. To be fixed after cutover. Evidence for settlement is written to the spool directory and collected every 30 minutes.

## Globex / Orders

The key directory on gw-edge-02 is readable by the signer account only. The orders replay set has 6519 requests, of which 21 carry a query string. D. Achterberg checked that the same settlement request produces the same canonical hash on gw-edge-04 and gw-edge-01. Header count per request on disputes is between 16 and 13 in the sampled traffic. Disk on gw-edge-01 was at 24 percent after the replay and was cleared by hand.

## Settlement / payments-api

The ledger smoke test covers one signed request and one verified request per key id. The webhook signer renders its signatures as base64, which the fraud-ops team would like to keep. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. A Initech engineer joined for this item and dropped off afterwards. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare.

## Contoso / Disputes

Disk on gw-edge-04 was at 37 percent after the replay and was cleared by hand. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The key directory on gw-edge-03 is readable by the signer account only.

## identity review

Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. Header count per request on disputes is between 40 and 12 in the sampled traffic. The rollback rehearsal for catalog took 17 minutes end to end on gw-edge-02. The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The legacy signer peaked at roughly 28k requests per minute on catalog during the last cycle.

## Webhooks / identity

Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. Contoso asked for a second sandbox key id and were pointed at the onboarding form. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. The onboarding dashboard now splits signature mismatches by key id and by partner. K. Mwangi noted that the reconciliation client sets its content type on every request, including ones with no body. Northwind reported 16 failed requests on 2025-11-17, all traced to an expired sandbox credential on their side.

## Host gw-edge-04

M. Lindqvist will rerun the ledger replay once Umbrella finish their client release. The identity team asked for one more dry run on gw-edge-01 before disputes moves. The webhooks dashboard now splits signature mismatches by key id and by partner. Capacity headroom on refunds is about 54 percent at the current peak.

## fraud-ops review

Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. No change in behaviour was requested for reconciliation in this session. Northwind asked for a second sandbox key id and were pointed at the onboarding form. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Globex use the same key id for orders and refunds. That is allowed.

## Contoso / Orders

Latency through the signer stayed under 6ms at p99 across the webhooks replay. A. Nakamura has the action to circulate the catalog numbers before the next session. The payouts smoke test covers one signed request and one verified request per key id.

## Northwind sandbox

Alert thresholds for reconciliation stay where they are until two clean weeks have passed. A. Nakamura noted that the settlement client sets its content type on every request, including ones with no body. The proxy in front of gw-edge-03 was upgraded on 2025-11-03. P. Oyelaran compared captures from before and after.

## Initech sandbox

Latency through the signer stayed under 5ms at p99 across the ledger replay. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Header count per request on settlement is between 20 and 9 in the sampled traffic. The edge-platform team asked for one more dry run on gw-edge-01 before ledger moves. The catalog smoke test covers one signed request and one verified request per key id. A. Nakamura raised that the catalog runbook still names the Perl script. To be fixed after cutover.

## Payouts / edge-platform

The access log truncates query strings longer than 512 bytes. The request itself is not truncated. Evidence for reconciliation is written to the spool directory and collected every 53 minutes. Latency through the signer stayed under 6ms at p99 across the orders replay.

## Northwind sandbox

Latency through the signer stayed under 7ms at p99 across the refunds replay. Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. The webhook signer terminates its string to sign with a line feed. Capacity headroom on disputes is about 78 percent at the current peak. The onboarding dashboard now splits signature mismatches by key id and by partner.

## identity review

No change in behaviour was requested for payouts in this session. L. Fontaine raised that the orders runbook still names the Perl script. To be fixed after cutover. Header count per request on payouts is between 12 and 10 in the sampled traffic. The edge-platform team asked for one more dry run on gw-edge-03 before disputes moves. A Northwind engineer joined for this item and dropped off afterwards.
