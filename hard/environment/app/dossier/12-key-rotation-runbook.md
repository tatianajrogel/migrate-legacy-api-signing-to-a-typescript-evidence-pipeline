# Appendix - Key Rotation Runbook

## Settlement window

A. Nakamura noted that the ledger client sets its content type on every request, including ones with no body. Mismatch rate on payouts was 0.3 percent over the window, all of it from one Contoso sandbox client. The key directory on gw-edge-01 is readable by the signer account only. The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Northwind sandbox

The legacy signer peaked at roughly 38k requests per minute on disputes during the last cycle. A. Nakamura asked for the canonical hash to be shown next to each mismatch in the refunds dashboard so partners can compare. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. The proxy in front of gw-edge-02 was upgraded on 2025-12-05. R. Okonkwo compared captures from before and after. The signer account on gw-edge-03 has no outbound network route, which partner-integrations verified again on 2025-11-03.

## Initech / Reconciliation

The key directory on gw-edge-03 is readable by the signer account only. The proxy in front of gw-edge-02 was upgraded on 2025-10-09. L. Fontaine compared captures from before and after. J. Delacroix raised that the disputes runbook still names the Perl script. To be fixed after cutover. T. Bergstrom has the action to circulate the orders numbers before the next session. S. Varga will rerun the reconciliation replay once Northwind finish their client release.

## Globex / Webhooks

L. Fontaine raised that the disputes runbook still names the Perl script. To be fixed after cutover. Capacity headroom on catalog is about 49 percent at the current peak. L. Fontaine checked that the same settlement request produces the same canonical hash on gw-edge-02 and gw-edge-01. L. Fontaine reported that the disputes cutover is on track for the week of 2025-11-11. Mismatch rate on catalog was 0.4 percent over the window, all of it from one Contoso sandbox client.

## Umbrella / Onboarding

Northwind confirmed they are on SDK 3.0 in production and 3.2 in their sandbox. The edge-platform team want the evidence files kept for 90 days after cutover. The rollback rehearsal for orders took 29 minutes end to end on gw-edge-03. D. Achterberg asked whether settlement still needs the old batch window. Nobody objected to dropping it. The signer account on gw-edge-04 has no outbound network route, which partner-integrations verified again on 2025-10-02.

## Orders window

The reconciliation smoke test covers one signed request and one verified request per key id. The key directory on gw-edge-01 is readable by the signer account only. D. Achterberg asked for the canonical hash to be shown next to each mismatch in the orders dashboard so partners can compare. Latency through the signer stayed under 9ms at p99 across the webhooks replay. Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. No change in behaviour was requested for refunds in this session.

## Disputes window

The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The billing team asked for one more dry run on gw-edge-03 before catalog moves. Header count per request on refunds is between 29 and 14 in the sampled traffic.

## Disputes / sre-core

Contoso reported 2 failed requests on 2025-11-17, all traced to an expired sandbox credential on their side. The signer account on gw-edge-01 has no outbound network route, which fraud-ops verified again on 2025-12-05. A. Nakamura asked whether disputes still needs the old batch window. Nobody objected to dropping it. Capacity headroom on disputes is about 48 percent at the current peak. The payouts dashboard now splits signature mismatches by key id and by partner. The key directory on gw-edge-04 is readable by the signer account only.

## Initech sandbox

The webhooks queue drained in 13 minutes after the replay, which is within the agreed window. The outbound webhook signer (WH-HMAC-SHA256) puts a timestamp line ahead of everything else in its string to sign. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. R. Okonkwo asked for the canonical hash to be shown next to each mismatch in the ledger dashboard so partners can compare. Umbrella reported 27 failed requests on 2025-12-01, all traced to an expired sandbox credential on their side. Key files are distributed by the provisioning job, which sre-core own.

## Orders window

Alert thresholds for onboarding stay where they are until two clean weeks have passed. Key files are distributed by the provisioning job, which fraud-ops own. The rollback rehearsal for catalog took 25 minutes end to end on gw-edge-03.

## Settlement notes

The onboarding queue drained in 13 minutes after the replay, which is within the agreed window. The rollback rehearsal for webhooks took 36 minutes end to end on gw-edge-04. Mismatch rate on orders was 0.6 percent over the window, all of it from one Northwind sandbox client. J. Delacroix will rerun the refunds replay once Umbrella finish their client release.

## Umbrella / Settlement

L. Fontaine raised that the refunds runbook still names the Perl script. To be fixed after cutover. Initech asked for a second sandbox key id and were pointed at the onboarding form. P. Oyelaran reported that the payouts cutover is on track for the week of 2025-10-29.

## Umbrella / Payouts

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The legacy signer peaked at roughly 5k requests per minute on payouts during the last cycle. Disk on gw-edge-02 was at 76 percent after the replay and was cleared by hand. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered.

## Contoso sandbox

Contoso use the same key id for refunds and onboarding. That is allowed. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. The partner-integrations team want the evidence files kept for 7 days after cutover. Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing.

## Disputes notes

The rollback rehearsal for payouts took 20 minutes end to end on gw-edge-02. No change in behaviour was requested for disputes in this session. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. Alert thresholds for orders stay where they are until two clean weeks have passed.

## Catalog / sre-core

The key directory on gw-edge-04 is readable by the signer account only. D. Achterberg asked for the canonical hash to be shown next to each mismatch in the disputes dashboard so partners can compare. Contoso use the same key id for reconciliation and disputes. That is allowed.

## Host gw-edge-02

P. Oyelaran noted that the webhooks client sets its content type on every request, including ones with no body. Alert thresholds for ledger stay where they are until two clean weeks have passed. The payments-api team want the evidence files kept for 90 days after cutover.

## Host gw-edge-01

Alert thresholds for reconciliation stay where they are until two clean weeks have passed. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The edge-platform team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. M. Lindqvist raised that the webhooks runbook still names the Perl script. To be fixed after cutover.

## sre-core review

Capacity headroom on webhooks is about 66 percent at the current peak. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The ledger smoke test covers one signed request and one verified request per key id. Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The webhook signer does not cover the query string at all, because receivers register a fixed URL. M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the disputes dashboard so partners can compare.

## Webhooks notes

Header count per request on onboarding is between 28 and 13 in the sampled traffic. Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. Globex asked for a second sandbox key id and were pointed at the onboarding form.

## Contoso / Webhooks

L. Fontaine has the action to circulate the webhooks numbers before the next session. Latency through the signer stayed under 1ms at p99 across the reconciliation replay. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. A Northwind engineer joined for this item and dropped off afterwards.

## Host gw-edge-02

Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Latency through the signer stayed under 3ms at p99 across the orders replay. Header count per request on settlement is between 9 and 16 in the sampled traffic. Northwind use the same key id for webhooks and disputes. That is allowed. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The key directory on gw-edge-01 is readable by the signer account only.

## Host gw-edge-01

L. Fontaine asked whether webhooks still needs the old batch window. Nobody objected to dropping it. The rollback rehearsal for settlement took 50 minutes end to end on gw-edge-01. Umbrella reported 36 failed requests on 2025-11-17, all traced to an expired sandbox credential on their side. Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.

## Payouts notes

D. Achterberg raised that the disputes runbook still names the Perl script. To be fixed after cutover. Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. J. Delacroix reported that the settlement cutover is on track for the week of 2025-11-24. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## Initech sandbox

Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. P. Oyelaran asked for the canonical hash to be shown next to each mismatch in the webhooks dashboard so partners can compare. The signer account on gw-edge-02 has no outbound network route, which identity verified again on 2025-11-17.

## Pending rotation

`gw-prod-03` was cut on 2025-11-27. Partners listed against it in the onboarding matrix are assigned to it for the first quarter rotation and are still signing with their current key id until that rotation is announced.

## Refunds window

Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Alert thresholds for payouts stay where they are until two clean weeks have passed. J. Delacroix asked for the canonical hash to be shown next to each mismatch in the settlement dashboard so partners can compare. The key directory on gw-edge-01 is readable by the signer account only.

## Reconciliation / edge-platform

The billing team asked for one more dry run on gw-edge-04 before webhooks moves. The catalog replay set has 5671 requests, of which 14 carry a query string. The billing team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. No change in behaviour was requested for reconciliation in this session.

## Northwind sandbox

No change in behaviour was requested for disputes in this session. The partner-integrations team asked for one more dry run on gw-edge-03 before disputes moves. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. A Initech engineer joined for this item and dropped off afterwards. D. Achterberg asked for the canonical hash to be shown next to each mismatch in the webhooks dashboard so partners can compare. J. Delacroix asked whether disputes still needs the old batch window. Nobody objected to dropping it.

## Host gw-edge-01

No change in behaviour was requested for refunds in this session. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. M. Lindqvist noted that the disputes client sets its content type on every request, including ones with no body. The edge-platform team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. Initech reported 23 failed requests on 2025-10-09, all traced to an expired sandbox credential on their side.

## Onboarding / partner-integrations

Umbrella use the same key id for orders and reconciliation. That is allowed. K. Mwangi reported that the settlement cutover is on track for the week of 2025-10-02. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Northwind confirmed they are on SDK 3.1 in production and 3.0 in their sandbox. The webhook signer signs header values exactly as it builds them, with no trimming, since it is the one sending them. Evidence for webhooks is written to the spool directory and collected every 19 minutes.

## Reconciliation / fraud-ops

Capacity headroom on disputes is about 59 percent at the current peak. Header count per request on refunds is between 15 and 13 in the sampled traffic. The refunds dashboard now splits signature mismatches by key id and by partner.

## Host gw-edge-03

Evidence for orders is written to the spool directory and collected every 32 minutes. Key files are distributed by the provisioning job, which fraud-ops own. The key directory on gw-edge-03 is readable by the signer account only.

## Host gw-edge-01

Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Mismatch rate on catalog was 0.8 percent over the window, all of it from one Initech sandbox client. S. Varga asked whether settlement still needs the old batch window. Nobody objected to dropping it. The rollback rehearsal for orders took 12 minutes end to end on gw-edge-02. The webhooks replay set has 8165 requests, of which 37 carry a query string.

## Umbrella sandbox

The signer account on gw-edge-03 has no outbound network route, which payments-api verified again on 2025-10-23. Northwind confirmed they are on SDK 3.1 in production and 3.0 in their sandbox. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. Globex reported 10 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side. The webhooks dashboard now splits signature mismatches by key id and by partner.

## Reconciliation / billing

The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. The refunds dashboard now splits signature mismatches by key id and by partner. No change in behaviour was requested for webhooks in this session.

## Northwind / Catalog

The signer account on gw-edge-02 has no outbound network route, which identity verified again on 2025-11-17. No change in behaviour was requested for ledger in this session. D. Achterberg asked whether reconciliation still needs the old batch window. Nobody objected to dropping it.

## Northwind / Refunds

The payouts dashboard now splits signature mismatches by key id and by partner. T. Bergstrom has the action to circulate the orders numbers before the next session. The partner-integrations team want the evidence files kept for 30 days after cutover. The orders smoke test covers one signed request and one verified request per key id. Capacity headroom on refunds is about 72 percent at the current peak. No change in behaviour was requested for payouts in this session.

## Disputes / payments-api

The signer account on gw-edge-04 has no outbound network route, which partner-integrations verified again on 2025-10-23. The key directory on gw-edge-03 is readable by the signer account only. Globex asked for a second sandbox key id and were pointed at the onboarding form. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. Alert thresholds for refunds stay where they are until two clean weeks have passed. The reconciliation queue drained in 5 minutes after the replay, which is within the agreed window.

## Globex / Disputes

Contoso reported 10 failed requests on 2025-11-03, all traced to an expired sandbox credential on their side. M. Lindqvist checked that the same payouts request produces the same canonical hash on gw-edge-03 and gw-edge-02. The key directory on gw-edge-04 is readable by the signer account only. Alert thresholds for reconciliation stay where they are until two clean weeks have passed. M. Lindqvist asked whether ledger still needs the old batch window. Nobody objected to dropping it. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## Host gw-edge-02

Disk on gw-edge-02 was at 27 percent after the replay and was cleared by hand. Contoso reported 25 failed requests on 2025-11-28, all traced to an expired sandbox credential on their side. The settlement queue drained in 51 minutes after the replay, which is within the agreed window.

## Ledger / payments-api

The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The key directory on gw-edge-04 is readable by the signer account only. The signer account on gw-edge-01 has no outbound network route, which payments-api verified again on 2025-10-02.

## data-plane review

The key directory on gw-edge-03 is readable by the signer account only. S. Varga asked whether catalog still needs the old batch window. Nobody objected to dropping it. The reconciliation queue drained in 12 minutes after the replay, which is within the agreed window. Northwind reported 30 failed requests on 2025-12-01, all traced to an expired sandbox credential on their side. Umbrella confirmed they are on SDK 3.2 in production and 3.0 in their sandbox. Mismatch rate on disputes was 0.1 percent over the window, all of it from one Umbrella sandbox client.

## Umbrella / Onboarding

The webhook signer signs header values exactly as it builds them, with no trimming, since it is the one sending them. Alert thresholds for settlement stay where they are until two clean weeks have passed. The rollback rehearsal for settlement took 33 minutes end to end on gw-edge-01. The billing team want the evidence files kept for 30 days after cutover. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The key directory on gw-edge-02 is readable by the signer account only.

## Host gw-edge-02

A. Nakamura reported that the payouts cutover is on track for the week of 2025-10-14. The onboarding queue drained in 9 minutes after the replay, which is within the agreed window. Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing.

## Globex sandbox

Capacity headroom on disputes is about 72 percent at the current peak. The sre-core team want the evidence files kept for 30 days after cutover. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. J. Delacroix asked whether catalog still needs the old batch window. Nobody objected to dropping it. P. Oyelaran checked that the same catalog request produces the same canonical hash on gw-edge-01 and gw-edge-02.

## Orders / billing

Initech use the same key id for catalog and onboarding. That is allowed. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. Latency through the signer stayed under 9ms at p99 across the payouts replay. The reconciliation smoke test covers one signed request and one verified request per key id. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated.

## Refunds / partner-integrations

The partner-integrations team asked for one more dry run on gw-edge-02 before webhooks moves. Contoso asked for a second sandbox key id and were pointed at the onboarding form. Evidence for disputes is written to the spool directory and collected every 15 minutes.

## billing review

No change in behaviour was requested for orders in this session. The ledger dashboard now splits signature mismatches by key id and by partner. R. Okonkwo asked for the canonical hash to be shown next to each mismatch in the refunds dashboard so partners can compare. Globex asked for a second sandbox key id and were pointed at the onboarding form. The payments-api team asked for one more dry run on gw-edge-03 before refunds moves.

## Refunds notes

M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the reconciliation dashboard so partners can compare. J. Delacroix noted that the refunds client sets its content type on every request, including ones with no body. The legacy signer peaked at roughly 38k requests per minute on payouts during the last cycle. A Contoso engineer joined for this item and dropped off afterwards. The webhooks dashboard now splits signature mismatches by key id and by partner. Disk on gw-edge-03 was at 76 percent after the replay and was cleared by hand.

## Northwind / Ledger

Contoso reported 26 failed requests on 2025-12-05, all traced to an expired sandbox credential on their side. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. The legacy signer peaked at roughly 11k requests per minute on refunds during the last cycle. No change in behaviour was requested for refunds in this session.

## payments-api review

Globex use the same key id for reconciliation and ledger. That is allowed. D. Achterberg raised that the reconciliation runbook still names the Perl script. To be fixed after cutover. The signer account on gw-edge-01 has no outbound network route, which sre-core verified again on 2025-12-01. The webhook signer signs header values exactly as it builds them, with no trimming, since it is the one sending them.

## Globex / Refunds

A. Nakamura has the action to circulate the disputes numbers before the next session. The webhooks queue drained in 25 minutes after the replay, which is within the agreed window. Umbrella confirmed they are on SDK 3.0 in production and 3.2 in their sandbox. The payments-api team asked for one more dry run on gw-edge-02 before disputes moves.

## Orders notes

The webhook signer renders its signatures as base64, which the partner-integrations team would like to keep. No change in behaviour was requested for settlement in this session. The proxy in front of gw-edge-04 was upgraded on 2025-10-09. D. Achterberg compared captures from before and after. M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the catalog dashboard so partners can compare. Header count per request on refunds is between 26 and 18 in the sampled traffic. Evidence for reconciliation is written to the spool directory and collected every 21 minutes. P. Oyelaran checked that the same payouts request produces the same canonical hash on gw-edge-01 and gw-edge-04.

## Payouts window

Alert thresholds for catalog stay where they are until two clean weeks have passed. The rollback rehearsal for webhooks took 12 minutes end to end on gw-edge-04. R. Okonkwo raised that the payouts runbook still names the Perl script. To be fixed after cutover. The access log truncates query strings longer than 512 bytes. The request itself is not truncated. Contoso asked for a second sandbox key id and were pointed at the onboarding form.

## billing review

S. Varga checked that the same onboarding request produces the same canonical hash on gw-edge-03 and gw-edge-04. The refunds dashboard now splits signature mismatches by key id and by partner. No change in behaviour was requested for refunds in this session. A. Nakamura noted that the catalog client sets its content type on every request, including ones with no body.

## Payouts window

The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. The onboarding queue drained in 9 minutes after the replay, which is within the agreed window. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. The webhook signer terminates its string to sign with a line feed.

## Contoso sandbox

Evidence for disputes is written to the spool directory and collected every 38 minutes. Capacity headroom on refunds is about 49 percent at the current peak. D. Achterberg checked that the same ledger request produces the same canonical hash on gw-edge-03 and gw-edge-01. The legacy signer peaked at roughly 21k requests per minute on disputes during the last cycle.

## Northwind / Webhooks

Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. The signer account on gw-edge-03 has no outbound network route, which partner-integrations verified again on 2025-12-08. Header count per request on disputes is between 18 and 13 in the sampled traffic. A Northwind engineer joined for this item and dropped off afterwards. M. Lindqvist reported that the refunds cutover is on track for the week of 2025-12-01.

## fraud-ops review

Evidence for settlement is written to the spool directory and collected every 39 minutes. The rollback rehearsal for refunds took 54 minutes end to end on gw-edge-03. Northwind reported 9 failed requests on 2025-10-23, all traced to an expired sandbox credential on their side. Latency through the signer stayed under 8ms at p99 across the ledger replay. Key files are distributed by the provisioning job, which partner-integrations own. Northwind use the same key id for settlement and disputes. That is allowed.

## Disputes / payments-api

Evidence for orders is written to the spool directory and collected every 31 minutes. No change in behaviour was requested for disputes in this session. Disk on gw-edge-03 was at 47 percent after the replay and was cleared by hand. The orders smoke test covers one signed request and one verified request per key id.

## partner-integrations review

The signer account on gw-edge-03 has no outbound network route, which billing verified again on 2025-09-30. A Initech engineer joined for this item and dropped off afterwards. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Capacity headroom on reconciliation is about 56 percent at the current peak. The payouts dashboard now splits signature mismatches by key id and by partner. The proxy in front of gw-edge-04 was upgraded on 2025-10-23. L. Fontaine compared captures from before and after.

## Host gw-edge-02

Alert thresholds for catalog stay where they are until two clean weeks have passed. The orders smoke test covers one signed request and one verified request per key id. Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. J. Delacroix raised that the disputes runbook still names the Perl script. To be fixed after cutover. A. Nakamura has the action to circulate the webhooks numbers before the next session. The legacy signer peaked at roughly 37k requests per minute on settlement during the last cycle.
