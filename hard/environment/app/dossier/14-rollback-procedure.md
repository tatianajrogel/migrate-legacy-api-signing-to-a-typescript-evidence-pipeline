# Appendix - Rollback Procedure

## Onboarding window

The key directory on gw-edge-03 is readable by the signer account only. Umbrella use the same key id for onboarding and webhooks. That is allowed. Header count per request on orders is between 27 and 18 in the sampled traffic. M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the orders dashboard so partners can compare.

## Globex / Webhooks

The fraud-ops team asked for one more dry run on gw-edge-02 before refunds moves. Header count per request on catalog is between 8 and 13 in the sampled traffic. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. Evidence for payouts is written to the spool directory and collected every 33 minutes. Disk on gw-edge-02 was at 33 percent after the replay and was cleared by hand.

## Globex sandbox

The reconciliation dashboard now splits signature mismatches by key id and by partner. R. Okonkwo noted that the webhooks client sets its content type on every request, including ones with no body. M. Lindqvist asked whether ledger still needs the old batch window. Nobody objected to dropping it. The signer account on gw-edge-02 has no outbound network route, which sre-core verified again on 2025-10-23. R. Okonkwo will rerun the orders replay once Contoso finish their client release. Latency through the signer stayed under 9ms at p99 across the ledger replay.

## Globex / Orders

The partner-integrations team asked for one more dry run on gw-edge-02 before refunds moves. The orders replay set has 5289 requests, of which 13 carry a query string. A Northwind engineer joined for this item and dropped off afterwards.

## data-plane review

L. Fontaine has the action to circulate the reconciliation numbers before the next session. Mismatch rate on orders was 0.3 percent over the window, all of it from one Initech sandbox client. Disk on gw-edge-02 was at 34 percent after the replay and was cleared by hand.

## Northwind / Refunds

Capacity headroom on onboarding is about 75 percent at the current peak. The payments-api team want the evidence files kept for 30 days after cutover. The billing team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Settlement notes

Capacity headroom on disputes is about 66 percent at the current peak. Contoso asked for a second sandbox key id and were pointed at the onboarding form. T. Bergstrom checked that the same orders request produces the same canonical hash on gw-edge-04 and gw-edge-03. The refunds queue drained in 37 minutes after the replay, which is within the agreed window. The refunds replay set has 686 requests, of which 4 carry a query string. The proxy in front of gw-edge-04 was upgraded on 2025-10-02. J. Delacroix compared captures from before and after.

## Umbrella / Onboarding

D. Achterberg asked whether payouts still needs the old batch window. Nobody objected to dropping it. The identity team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The ledger queue drained in 32 minutes after the replay, which is within the agreed window. Capacity headroom on webhooks is about 72 percent at the current peak. A Contoso engineer joined for this item and dropped off afterwards. Latency through the signer stayed under 2ms at p99 across the payouts replay.

## Disputes / data-plane

The access log truncates query strings longer than 512 bytes. The request itself is not truncated. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. A. Nakamura asked for the canonical hash to be shown next to each mismatch in the ledger dashboard so partners can compare. No change in behaviour was requested for orders in this session. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. A Initech engineer joined for this item and dropped off afterwards.

## Ledger notes

K. Mwangi noted that the reconciliation client sets its content type on every request, including ones with no body. Key files are distributed by the provisioning job, which fraud-ops own. The key directory on gw-edge-04 is readable by the signer account only. The identity team want the evidence files kept for 30 days after cutover. Globex confirmed they are on SDK 3.0 in production and 3.1 in their sandbox. Umbrella use the same key id for onboarding and orders. That is allowed.

## payments-api review

Key files are distributed by the provisioning job, which payments-api own. Initech confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated.

## Disputes notes

Latency through the signer stayed under 9ms at p99 across the catalog replay. The rollback rehearsal for refunds took 26 minutes end to end on gw-edge-01. T. Bergstrom will rerun the disputes replay once Northwind finish their client release. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. No change in behaviour was requested for ledger in this session. A Initech engineer joined for this item and dropped off afterwards.

## Webhooks / identity

Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. Evidence for refunds is written to the spool directory and collected every 39 minutes. Alert thresholds for payouts stay where they are until two clean weeks have passed. The ledger dashboard now splits signature mismatches by key id and by partner.

## Catalog notes

The ledger dashboard now splits signature mismatches by key id and by partner. S. Varga will rerun the catalog replay once Initech finish their client release. Evidence for payouts is written to the spool directory and collected every 13 minutes.

## Settlement notes

The onboarding dashboard now splits signature mismatches by key id and by partner. Evidence for settlement is written to the spool directory and collected every 40 minutes. R. Okonkwo noted that the catalog client sets its content type on every request, including ones with no body. The webhook signer joins its signed header names with a comma.

## Host gw-edge-03

Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. Disk on gw-edge-02 was at 75 percent after the replay and was cleared by hand. Capacity headroom on catalog is about 36 percent at the current peak.

## data-plane review

T. Bergstrom will rerun the orders replay once Globex finish their client release. The key directory on gw-edge-01 is readable by the signer account only. The rollback rehearsal for catalog took 8 minutes end to end on gw-edge-01. The orders dashboard now splits signature mismatches by key id and by partner. A Contoso engineer joined for this item and dropped off afterwards. T. Bergstrom reported that the ledger cutover is on track for the week of 2025-10-23.

## Reconciliation window

The orders queue drained in 26 minutes after the replay, which is within the agreed window. A Initech engineer joined for this item and dropped off afterwards. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The key directory on gw-edge-04 is readable by the signer account only. The rollback rehearsal for orders took 23 minutes end to end on gw-edge-01.

## edge-platform review

The sre-core team asked for one more dry run on gw-edge-04 before disputes moves. No change in behaviour was requested for payouts in this session. Evidence for settlement is written to the spool directory and collected every 49 minutes. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## payments-api review

T. Bergstrom checked that the same refunds request produces the same canonical hash on gw-edge-02 and gw-edge-04. No change in behaviour was requested for reconciliation in this session. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The webhooks replay set has 5001 requests, of which 39 carry a query string. Initech asked for a second sandbox key id and were pointed at the onboarding form.

## Ledger notes

The rollback rehearsal for catalog took 40 minutes end to end on gw-edge-04. The orders smoke test covers one signed request and one verified request per key id. Contoso retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The key directory on gw-edge-02 is readable by the signer account only. Evidence for catalog is written to the spool directory and collected every 22 minutes.

## Host gw-edge-03

Evidence for ledger is written to the spool directory and collected every 32 minutes. The ledger queue drained in 41 minutes after the replay, which is within the agreed window. The sre-core team asked for one more dry run on gw-edge-03 before payouts moves. The signer account on gw-edge-01 has no outbound network route, which sre-core verified again on 2025-11-11. Header count per request on reconciliation is between 34 and 14 in the sampled traffic. The onboarding dashboard now splits signature mismatches by key id and by partner.

## Refunds / billing

Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. The ledger dashboard now splits signature mismatches by key id and by partner. The refunds smoke test covers one signed request and one verified request per key id.

## Disputes / data-plane

Latency through the signer stayed under 4ms at p99 across the ledger replay. S. Varga noted that the catalog client sets its content type on every request, including ones with no body. The identity team want the evidence files kept for 7 days after cutover. Header count per request on settlement is between 4 and 15 in the sampled traffic. The ledger queue drained in 9 minutes after the replay, which is within the agreed window. Contoso asked for a second sandbox key id and were pointed at the onboarding form.

## Umbrella / Webhooks

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The sre-core team asked for one more dry run on gw-edge-02 before onboarding moves. Globex confirmed they are on SDK 3.0 in production and 3.2 in their sandbox.

## Contoso sandbox

Mismatch rate on webhooks was 0.2 percent over the window, all of it from one Initech sandbox client. Header count per request on catalog is between 9 and 12 in the sampled traffic. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. Northwind use the same key id for orders and refunds. That is allowed.

## sre-core review

Mismatch rate on disputes was 0.8 percent over the window, all of it from one Globex sandbox client. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Evidence for refunds is written to the spool directory and collected every 46 minutes. Capacity headroom on refunds is about 69 percent at the current peak.

## Catalog notes

Globex asked for a second sandbox key id and were pointed at the onboarding form. J. Delacroix raised that the webhooks runbook still names the Perl script. To be fixed after cutover. The rollback rehearsal for ledger took 9 minutes end to end on gw-edge-04. The webhook signer does not cover the query string at all, because receivers register a fixed URL. The proxy in front of gw-edge-01 was upgraded on 2025-12-08. T. Bergstrom compared captures from before and after.

## Refunds window

Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. A Globex engineer joined for this item and dropped off afterwards. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that. Capacity headroom on refunds is about 47 percent at the current peak.

## Host gw-edge-01

Contoso asked for a second sandbox key id and were pointed at the onboarding form. The legacy signer peaked at roughly 19k requests per minute on catalog during the last cycle. Latency through the signer stayed under 2ms at p99 across the ledger replay. Globex use the same key id for settlement and reconciliation. That is allowed.

## Catalog notes

Globex confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. A Contoso engineer joined for this item and dropped off afterwards. P. Oyelaran will rerun the payouts replay once Umbrella finish their client release. A. Nakamura has the action to circulate the catalog numbers before the next session.

## Host gw-edge-04

D. Achterberg asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare. The settlement dashboard now splits signature mismatches by key id and by partner. Initech sends header names in upper case. Names are lowercased on our side, so this has never mattered. No change in behaviour was requested for refunds in this session. Latency through the signer stayed under 5ms at p99 across the refunds replay.

## Payouts / payments-api

The legacy signer peaked at roughly 29k requests per minute on catalog during the last cycle. The signer account on gw-edge-01 has no outbound network route, which identity verified again on 2025-11-24. Disk on gw-edge-03 was at 60 percent after the replay and was cleared by hand. The webhook signer renders its signatures as base64, which the fraud-ops team would like to keep. The access log truncates query strings longer than 8192 bytes. The request itself is not truncated.

## Northwind / Webhooks

The proxy in front of gw-edge-02 was upgraded on 2025-10-23. P. Oyelaran compared captures from before and after. Northwind reported 21 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side. Latency through the signer stayed under 7ms at p99 across the onboarding replay. No change in behaviour was requested for refunds in this session. P. Oyelaran asked for the canonical hash to be shown next to each mismatch in the ledger dashboard so partners can compare.

## Host gw-edge-01

The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. The edge-platform team want the evidence files kept for 14 days after cutover. R. Okonkwo raised that the disputes runbook still names the Perl script. To be fixed after cutover. The disputes dashboard now splits signature mismatches by key id and by partner. L. Fontaine noted that the settlement client sets its content type on every request, including ones with no body.

## billing review

J. Delacroix checked that the same settlement request produces the same canonical hash on gw-edge-03 and gw-edge-01. A. Nakamura asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare. Northwind use the same key id for ledger and orders. That is allowed. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The webhook signer signs header values exactly as it builds them, with no trimming, since it is the one sending them.

## Orders window

D. Achterberg raised that the catalog runbook still names the Perl script. To be fixed after cutover. K. Mwangi checked that the same payouts request produces the same canonical hash on gw-edge-03 and gw-edge-01. The billing team asked for one more dry run on gw-edge-02 before ledger moves. The fraud-ops team want the evidence files kept for 30 days after cutover. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## Initech / Webhooks

Mismatch rate on refunds was 0.9 percent over the window, all of it from one Globex sandbox client. The rollback rehearsal for refunds took 19 minutes end to end on gw-edge-02. Globex use the same key id for reconciliation and payouts. That is allowed.

## Orders window

The identity team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that. J. Delacroix will rerun the disputes replay once Northwind finish their client release. The proxy in front of gw-edge-03 was upgraded on 2025-11-11. L. Fontaine compared captures from before and after.

## Webhooks notes

Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. The webhook signer is owned by the webhooks team and is not part of this migration. Header count per request on reconciliation is between 36 and 10 in the sampled traffic. Disk on gw-edge-01 was at 66 percent after the replay and was cleared by hand.

## Host gw-edge-03

R. Okonkwo reported that the settlement cutover is on track for the week of 2025-12-05. A Contoso engineer joined for this item and dropped off afterwards. Alert thresholds for catalog stay where they are until two clean weeks have passed.

## Host gw-edge-01

The billing team want the evidence files kept for 14 days after cutover. The rollback rehearsal for ledger took 37 minutes end to end on gw-edge-01. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. P. Oyelaran noted that the orders client sets its content type on every request, including ones with no body. Header count per request on catalog is between 9 and 13 in the sampled traffic. Evidence for reconciliation is written to the spool directory and collected every 45 minutes.

## Disputes notes

Disk on gw-edge-02 was at 45 percent after the replay and was cleared by hand. Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Evidence for webhooks is written to the spool directory and collected every 13 minutes. T. Bergstrom will rerun the ledger replay once Contoso finish their client release.

## Initech sandbox

The reconciliation smoke test covers one signed request and one verified request per key id. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. The orders dashboard now splits signature mismatches by key id and by partner. S. Varga asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare. The identity team asked for one more dry run on gw-edge-04 before ledger moves. The legacy signer peaked at roughly 29k requests per minute on refunds during the last cycle.

## Host gw-edge-02

The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. A Contoso engineer joined for this item and dropped off afterwards. K. Mwangi checked that the same disputes request produces the same canonical hash on gw-edge-03 and gw-edge-04. The proxy in front of gw-edge-03 was upgraded on 2025-12-01. K. Mwangi compared captures from before and after. Latency through the signer stayed under 9ms at p99 across the disputes replay.

## Host gw-edge-01

The fraud-ops team want the evidence files kept for 14 days after cutover. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the settlement dashboard so partners can compare.

## fraud-ops review

R. Okonkwo has the action to circulate the settlement numbers before the next session. The settlement smoke test covers one signed request and one verified request per key id. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. The webhook signer renders its signatures as base64, which the fraud-ops team would like to keep. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Northwind use the same key id for refunds and webhooks. That is allowed. The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## identity review

The legacy signer peaked at roughly 33k requests per minute on onboarding during the last cycle. Latency through the signer stayed under 8ms at p99 across the orders replay. The webhook signer does not cover the query string at all, because receivers register a fixed URL. No change in behaviour was requested for payouts in this session.

## Globex / Payouts

R. Okonkwo will rerun the catalog replay once Umbrella finish their client release. A. Nakamura checked that the same refunds request produces the same canonical hash on gw-edge-04 and gw-edge-01. Disk on gw-edge-02 was at 34 percent after the replay and was cleared by hand.

## Globex sandbox

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Capacity headroom on catalog is about 40 percent at the current peak. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. The identity team want the evidence files kept for 30 days after cutover.

## Contoso sandbox

K. Mwangi asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare. T. Bergstrom asked whether disputes still needs the old batch window. Nobody objected to dropping it. S. Varga will rerun the disputes replay once Contoso finish their client release. Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing.

## Host gw-edge-01

Capacity headroom on refunds is about 71 percent at the current peak. D. Achterberg raised that the payouts runbook still names the Perl script. To be fixed after cutover. Key files are distributed by the provisioning job, which billing own.

## Reconciliation window

The webhook signer joins its signed header names with a comma. L. Fontaine asked whether refunds still needs the old batch window. Nobody objected to dropping it. S. Varga noted that the ledger client sets its content type on every request, including ones with no body. T. Bergstrom will rerun the onboarding replay once Contoso finish their client release.

## Umbrella sandbox

R. Okonkwo reported that the payouts cutover is on track for the week of 2025-12-01. J. Delacroix raised that the webhooks runbook still names the Perl script. To be fixed after cutover. Initech sends header names in upper case. Names are lowercased on our side, so this has never mattered. The ledger dashboard now splits signature mismatches by key id and by partner.

## Disputes notes

Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. The data-plane team want the evidence files kept for 7 days after cutover. T. Bergstrom noted that the disputes client sets its content type on every request, including ones with no body. Capacity headroom on payouts is about 78 percent at the current peak. The webhook signer terminates its string to sign with a line feed.

## Host gw-edge-02

The ledger smoke test covers one signed request and one verified request per key id. No change in behaviour was requested for catalog in this session. Header count per request on refunds is between 7 and 13 in the sampled traffic. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Contoso retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing.

## Disputes notes

Key files are distributed by the provisioning job, which billing own. L. Fontaine has the action to circulate the refunds numbers before the next session. The data-plane team asked for one more dry run on gw-edge-04 before refunds moves. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated.

## Contoso / Disputes

Northwind use the same key id for reconciliation and payouts. That is allowed. Umbrella reported 35 failed requests on 2025-11-03, all traced to an expired sandbox credential on their side. The rollback rehearsal for refunds took 14 minutes end to end on gw-edge-01. R. Okonkwo will rerun the catalog replay once Umbrella finish their client release. Header count per request on reconciliation is between 6 and 16 in the sampled traffic.
