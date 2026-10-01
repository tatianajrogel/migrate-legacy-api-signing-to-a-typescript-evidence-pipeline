# Appendix - Partner Onboarding Matrix

## Contoso sandbox

Globex use the same key id for reconciliation and onboarding. That is allowed. K. Mwangi asked for the canonical hash to be shown next to each mismatch in the ledger dashboard so partners can compare. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The legacy signer peaked at roughly 7k requests per minute on reconciliation during the last cycle. M. Lindqvist asked whether payouts still needs the old batch window. Nobody objected to dropping it. T. Bergstrom noted that the disputes client sets its content type on every request, including ones with no body.

## edge-platform review

Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. J. Delacroix asked for the canonical hash to be shown next to each mismatch in the orders dashboard so partners can compare. Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing.

## Umbrella sandbox

Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Disk on gw-edge-04 was at 30 percent after the replay and was cleared by hand. The onboarding dashboard now splits signature mismatches by key id and by partner. Header count per request on disputes is between 11 and 10 in the sampled traffic. The rollback rehearsal for disputes took 36 minutes end to end on gw-edge-03.

## Umbrella sandbox

The settlement dashboard now splits signature mismatches by key id and by partner. Alert thresholds for catalog stay where they are until two clean weeks have passed. The legacy signer peaked at roughly 24k requests per minute on catalog during the last cycle.

## Northwind / Catalog

The reconciliation smoke test covers one signed request and one verified request per key id. K. Mwangi asked whether orders still needs the old batch window. Nobody objected to dropping it. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated.

## Host gw-edge-01

The refunds replay set has 3009 requests, of which 38 carry a query string. Header count per request on refunds is between 21 and 9 in the sampled traffic. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. The settlement dashboard now splits signature mismatches by key id and by partner. Umbrella reported 24 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side. The proxy in front of gw-edge-01 was upgraded on 2025-10-14. K. Mwangi compared captures from before and after.

## Umbrella sandbox

L. Fontaine checked that the same payouts request produces the same canonical hash on gw-edge-01 and gw-edge-04. The rollback rehearsal for settlement took 18 minutes end to end on gw-edge-01. Evidence for settlement is written to the spool directory and collected every 48 minutes. The key directory on gw-edge-02 is readable by the signer account only.

## Contoso / Disputes

A Globex engineer joined for this item and dropped off afterwards. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. Evidence for settlement is written to the spool directory and collected every 49 minutes.

## Settlement window

Latency through the signer stayed under 6ms at p99 across the disputes replay. L. Fontaine noted that the payouts client sets its content type on every request, including ones with no body. Capacity headroom on settlement is about 71 percent at the current peak. The payments-api team want the evidence files kept for 90 days after cutover. Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. Evidence for payouts is written to the spool directory and collected every 52 minutes.

## Host gw-edge-04

Latency through the signer stayed under 6ms at p99 across the onboarding replay. No change in behaviour was requested for settlement in this session. Globex reported 34 failed requests on 2025-11-03, all traced to an expired sandbox credential on their side. Disk on gw-edge-03 was at 23 percent after the replay and was cleared by hand. The signer account on gw-edge-04 has no outbound network route, which fraud-ops verified again on 2025-10-14.

## Northwind / Orders

A Globex engineer joined for this item and dropped off afterwards. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The refunds dashboard now splits signature mismatches by key id and by partner. M. Lindqvist noted that the onboarding client sets its content type on every request, including ones with no body.

## Host gw-edge-02

The payments-api team want the evidence files kept for 90 days after cutover. Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. R. Okonkwo checked that the same catalog request produces the same canonical hash on gw-edge-03 and gw-edge-01. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the settlement dashboard so partners can compare. The reconciliation replay set has 4184 requests, of which 7 carry a query string. D. Achterberg will rerun the reconciliation replay once Northwind finish their client release.

## Webhooks / edge-platform

Umbrella use the same key id for settlement and refunds. That is allowed. Initech asked for a second sandbox key id and were pointed at the onboarding form. The webhook signer is owned by the webhooks team and is not part of this migration. Mismatch rate on reconciliation was 0.8 percent over the window, all of it from one Globex sandbox client. L. Fontaine has the action to circulate the catalog numbers before the next session. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. T. Bergstrom checked that the same ledger request produces the same canonical hash on gw-edge-04 and gw-edge-01.

## sre-core review

T. Bergstrom will rerun the onboarding replay once Initech finish their client release. The ledger queue drained in 21 minutes after the replay, which is within the agreed window. L. Fontaine asked whether orders still needs the old batch window. Nobody objected to dropping it. A Northwind engineer joined for this item and dropped off afterwards.

## Umbrella / Ledger

The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. A Contoso engineer joined for this item and dropped off afterwards. Umbrella confirmed they are on SDK 3.0 in production and 3.1 in their sandbox.

## Payouts / fraud-ops

Umbrella asked for a second sandbox key id and were pointed at the onboarding form. S. Varga noted that the ledger client sets its content type on every request, including ones with no body. L. Fontaine has the action to circulate the webhooks numbers before the next session. No change in behaviour was requested for disputes in this session. The billing team asked for one more dry run on gw-edge-01 before reconciliation moves.

## Northwind / Onboarding

The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Mismatch rate on settlement was 0.3 percent over the window, all of it from one Umbrella sandbox client. The rollback rehearsal for disputes took 42 minutes end to end on gw-edge-01. P. Oyelaran checked that the same orders request produces the same canonical hash on gw-edge-01 and gw-edge-03. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The data-plane team want the evidence files kept for 30 days after cutover.

## Host gw-edge-01

The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. Latency through the signer stayed under 3ms at p99 across the onboarding replay. L. Fontaine has the action to circulate the reconciliation numbers before the next session. No change in behaviour was requested for payouts in this session. Mismatch rate on reconciliation was 0.3 percent over the window, all of it from one Globex sandbox client. The proxy in front of gw-edge-02 was upgraded on 2025-12-05. J. Delacroix compared captures from before and after.

## Refunds / data-plane

The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. Alert thresholds for onboarding stay where they are until two clean weeks have passed. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The rollback rehearsal for disputes took 14 minutes end to end on gw-edge-02. Latency through the signer stayed under 7ms at p99 across the ledger replay.

## edge-platform review

The access log truncates query strings longer than 8192 bytes. The request itself is not truncated. Alert thresholds for ledger stay where they are until two clean weeks have passed. The fraud-ops team asked for one more dry run on gw-edge-01 before onboarding moves. Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. The refunds dashboard now splits signature mismatches by key id and by partner.

## Host gw-edge-02

The payments-api team asked for one more dry run on gw-edge-04 before reconciliation moves. A Contoso engineer joined for this item and dropped off afterwards. The sre-core team want the evidence files kept for 30 days after cutover. The catalog smoke test covers one signed request and one verified request per key id. Alert thresholds for disputes stay where they are until two clean weeks have passed. D. Achterberg checked that the same payouts request produces the same canonical hash on gw-edge-02 and gw-edge-01.

## Refunds notes

Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Evidence for disputes is written to the spool directory and collected every 52 minutes. The legacy signer peaked at roughly 13k requests per minute on reconciliation during the last cycle. The signer account on gw-edge-04 has no outbound network route, which identity verified again on 2025-10-02. The reconciliation smoke test covers one signed request and one verified request per key id.

## Payouts / identity

Umbrella reported 32 failed requests on 2025-10-09, all traced to an expired sandbox credential on their side. Contoso asked for a second sandbox key id and were pointed at the onboarding form. J. Delacroix asked for the canonical hash to be shown next to each mismatch in the catalog dashboard so partners can compare. Alert thresholds for onboarding stay where they are until two clean weeks have passed. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file.

## Initech sandbox

D. Achterberg has the action to circulate the onboarding numbers before the next session. Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Umbrella use the same key id for orders and disputes. That is allowed. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. D. Achterberg reported that the catalog cutover is on track for the week of 2025-12-08.

## Contoso / Onboarding

J. Delacroix noted that the ledger client sets its content type on every request, including ones with no body. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it.

## Umbrella sandbox

Alert thresholds for catalog stay where they are until two clean weeks have passed. The billing team asked for one more dry run on gw-edge-03 before payouts moves. T. Bergstrom will rerun the reconciliation replay once Globex finish their client release.

## Umbrella sandbox

P. Oyelaran will rerun the webhooks replay once Globex finish their client release. Header count per request on catalog is between 11 and 10 in the sampled traffic. Mismatch rate on orders was 0.7 percent over the window, all of it from one Initech sandbox client.

## Settlement notes

A Northwind engineer joined for this item and dropped off afterwards. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. D. Achterberg has the action to circulate the orders numbers before the next session. The legacy signer peaked at roughly 3k requests per minute on catalog during the last cycle. Evidence for onboarding is written to the spool directory and collected every 43 minutes.

## Payouts window

Umbrella reported 17 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side. The onboarding queue drained in 5 minutes after the replay, which is within the agreed window. J. Delacroix noted that the ledger client sets its content type on every request, including ones with no body. The proxy in front of gw-edge-02 was upgraded on 2025-10-23. M. Lindqvist compared captures from before and after. Alert thresholds for onboarding stay where they are until two clean weeks have passed.

## Globex / Refunds

Capacity headroom on ledger is about 62 percent at the current peak. The webhook signer joins its signed header names with a comma. The catalog queue drained in 12 minutes after the replay, which is within the agreed window. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare.

## Payouts / sre-core

Key files are distributed by the provisioning job, which fraud-ops own. The key directory on gw-edge-04 is readable by the signer account only. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. P. Oyelaran asked whether webhooks still needs the old batch window. Nobody objected to dropping it. Latency through the signer stayed under 4ms at p99 across the reconciliation replay. Disk on gw-edge-01 was at 61 percent after the replay and was cleared by hand.

## Ledger window

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The fraud-ops team asked for one more dry run on gw-edge-01 before ledger moves. Contoso confirmed they are on SDK 3.1 in production and 3.0 in their sandbox. Initech reported 6 failed requests on 2025-12-05, all traced to an expired sandbox credential on their side. The webhooks smoke test covers one signed request and one verified request per key id.

## partner-integrations review

Key files are distributed by the provisioning job, which data-plane own. D. Achterberg will rerun the reconciliation replay once Umbrella finish their client release. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The edge-platform team asked for one more dry run on gw-edge-01 before onboarding moves.

## Contoso / Payouts

T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the disputes dashboard so partners can compare. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. Capacity headroom on payouts is about 40 percent at the current peak. The edge-platform team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Disk on gw-edge-04 was at 25 percent after the replay and was cleared by hand.

## Host gw-edge-01

L. Fontaine asked for the canonical hash to be shown next to each mismatch in the refunds dashboard so partners can compare. The proxy in front of gw-edge-02 was upgraded on 2025-12-08. M. Lindqvist compared captures from before and after. The legacy signer peaked at roughly 31k requests per minute on onboarding during the last cycle.

## Contoso / Reconciliation

The ledger dashboard now splits signature mismatches by key id and by partner. Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. Northwind asked for a second sandbox key id and were pointed at the onboarding form.

## Northwind / Reconciliation

Evidence for catalog is written to the spool directory and collected every 44 minutes. Alert thresholds for refunds stay where they are until two clean weeks have passed. Header count per request on ledger is between 23 and 10 in the sampled traffic. The ledger dashboard now splits signature mismatches by key id and by partner.

## sre-core review

Latency through the signer stayed under 3ms at p99 across the settlement replay. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. Capacity headroom on refunds is about 35 percent at the current peak. S. Varga checked that the same webhooks request produces the same canonical hash on gw-edge-02 and gw-edge-04. T. Bergstrom has the action to circulate the orders numbers before the next session.

## Webhooks / edge-platform

Capacity headroom on catalog is about 50 percent at the current peak. The webhook signer terminates its string to sign with a line feed. L. Fontaine checked that the same refunds request produces the same canonical hash on gw-edge-03 and gw-edge-01. Umbrella confirmed they are on SDK 3.2 in production and 3.0 in their sandbox. The fraud-ops team want the evidence files kept for 7 days after cutover.

## Disputes notes

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Disk on gw-edge-04 was at 33 percent after the replay and was cleared by hand. Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. Capacity headroom on settlement is about 60 percent at the current peak. J. Delacroix asked whether orders still needs the old batch window. Nobody objected to dropping it. The orders queue drained in 12 minutes after the replay, which is within the agreed window.

## Globex sandbox

Latency through the signer stayed under 9ms at p99 across the ledger replay. The edge-platform team asked for one more dry run on gw-edge-02 before disputes moves. J. Delacroix asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare. The signer account on gw-edge-01 has no outbound network route, which edge-platform verified again on 2025-10-02. The data-plane team want the evidence files kept for 90 days after cutover. The proxy in front of gw-edge-03 was upgraded on 2025-10-29. D. Achterberg compared captures from before and after.

## Orders / payments-api

Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. A Northwind engineer joined for this item and dropped off afterwards.

## Host gw-edge-03

The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. J. Delacroix has the action to circulate the payouts numbers before the next session. The settlement queue drained in 32 minutes after the replay, which is within the agreed window. Header count per request on disputes is between 4 and 13 in the sampled traffic. The payouts dashboard now splits signature mismatches by key id and by partner.

## Contoso / Ledger

Key files are distributed by the provisioning job, which sre-core own. A Globex engineer joined for this item and dropped off afterwards. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## Payouts window

The signer account on gw-edge-01 has no outbound network route, which edge-platform verified again on 2025-11-17. A Contoso engineer joined for this item and dropped off afterwards. The fraud-ops team asked for one more dry run on gw-edge-04 before orders moves. Evidence for reconciliation is written to the spool directory and collected every 6 minutes. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. Disk on gw-edge-04 was at 76 percent after the replay and was cleared by hand.

## Settlement / data-plane

Disk on gw-edge-01 was at 72 percent after the replay and was cleared by hand. The webhook signer joins its signed header names with a comma. S. Varga asked whether webhooks still needs the old batch window. Nobody objected to dropping it. Alert thresholds for onboarding stay where they are until two clean weeks have passed. The legacy signer peaked at roughly 20k requests per minute on ledger during the last cycle.

## Contoso sandbox

Contoso use the same key id for disputes and orders. That is allowed. Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Evidence for orders is written to the spool directory and collected every 18 minutes. P. Oyelaran raised that the settlement runbook still names the Perl script. To be fixed after cutover.

## Host gw-edge-04

Disk on gw-edge-04 was at 56 percent after the replay and was cleared by hand. The signer account on gw-edge-02 has no outbound network route, which payments-api verified again on 2025-11-03. The edge-platform team want the evidence files kept for 14 days after cutover. The key directory on gw-edge-04 is readable by the signer account only. Mismatch rate on refunds was 0.2 percent over the window, all of it from one Initech sandbox client. L. Fontaine raised that the refunds runbook still names the Perl script. To be fixed after cutover.

## Umbrella / Settlement

R. Okonkwo has the action to circulate the webhooks numbers before the next session. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Disk on gw-edge-01 was at 71 percent after the replay and was cleared by hand. Umbrella reported 19 failed requests on 2025-10-09, all traced to an expired sandbox credential on their side. The webhook signer is owned by the webhooks team and is not part of this migration.

## Host gw-edge-03

The settlement smoke test covers one signed request and one verified request per key id. A. Nakamura asked whether catalog still needs the old batch window. Nobody objected to dropping it. Capacity headroom on reconciliation is about 56 percent at the current peak.

## Umbrella sandbox

The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that. Disk on gw-edge-04 was at 31 percent after the replay and was cleared by hand. Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Key files are distributed by the provisioning job, which partner-integrations own.

## Disputes window

The rollback rehearsal for refunds took 15 minutes end to end on gw-edge-03. The outbound webhook signer (WH-HMAC-SHA256) puts a timestamp line ahead of everything else in its string to sign. Evidence for reconciliation is written to the spool directory and collected every 47 minutes. Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. The proxy in front of gw-edge-02 was upgraded on 2025-12-05. D. Achterberg compared captures from before and after.

## Webhooks / payments-api

Alert thresholds for settlement stay where they are until two clean weeks have passed. Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. L. Fontaine asked whether orders still needs the old batch window. Nobody objected to dropping it. The onboarding dashboard now splits signature mismatches by key id and by partner. T. Bergstrom checked that the same orders request produces the same canonical hash on gw-edge-04 and gw-edge-02.

## Host gw-edge-01

The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The catalog smoke test covers one signed request and one verified request per key id. Initech use the same key id for ledger and disputes. That is allowed. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. Evidence for disputes is written to the spool directory and collected every 50 minutes.

## payments-api review

No change in behaviour was requested for disputes in this session. Key files are distributed by the provisioning job, which partner-integrations own. The catalog replay set has 3344 requests, of which 36 carry a query string. The ledger queue drained in 34 minutes after the replay, which is within the agreed window.

## edge-platform review

Umbrella use the same key id for settlement and disputes. That is allowed. Disk on gw-edge-01 was at 64 percent after the replay and was cleared by hand. L. Fontaine raised that the ledger runbook still names the Perl script. To be fixed after cutover. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. P. Oyelaran noted that the disputes client sets its content type on every request, including ones with no body. The billing team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.
