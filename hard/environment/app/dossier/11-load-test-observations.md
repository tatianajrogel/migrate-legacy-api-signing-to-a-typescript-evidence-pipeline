# Appendix - Load Test Observations

## Catalog window

The ledger replay set has 7400 requests, of which 12 carry a query string. Umbrella confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The reconciliation queue drained in 54 minutes after the replay, which is within the agreed window. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered.

## Onboarding notes

Northwind asked for a second sandbox key id and were pointed at the onboarding form. Umbrella reported 5 failed requests on 2025-11-24, all traced to an expired sandbox credential on their side. A. Nakamura noted that the catalog client sets its content type on every request, including ones with no body. Contoso confirmed they are on SDK 3.1 in production and 3.0 in their sandbox. The access log truncates query strings longer than 512 bytes. The request itself is not truncated. The rollback rehearsal for ledger took 34 minutes end to end on gw-edge-01.

## Webhooks window

Initech reported 23 failed requests on 2025-10-23, all traced to an expired sandbox credential on their side. D. Achterberg raised that the onboarding runbook still names the Perl script. To be fixed after cutover. The edge-platform team want the evidence files kept for 14 days after cutover. The rollback rehearsal for refunds took 8 minutes end to end on gw-edge-01. Contoso use the same key id for webhooks and onboarding. That is allowed. S. Varga will rerun the ledger replay once Contoso finish their client release.

## Globex / Catalog

Globex asked for a second sandbox key id and were pointed at the onboarding form. D. Achterberg asked whether webhooks still needs the old batch window. Nobody objected to dropping it. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file.

## Host gw-edge-02

Latency through the signer stayed under 3ms at p99 across the refunds replay. J. Delacroix noted that the refunds client sets its content type on every request, including ones with no body. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The refunds smoke test covers one signed request and one verified request per key id. Capacity headroom on refunds is about 35 percent at the current peak. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## Onboarding / edge-platform

D. Achterberg reported that the payouts cutover is on track for the week of 2025-11-03. The identity team asked for one more dry run on gw-edge-02 before onboarding moves. Northwind use the same key id for settlement and ledger. That is allowed. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that.

## Initech / Webhooks

The rollback rehearsal for reconciliation took 30 minutes end to end on gw-edge-02. Header count per request on onboarding is between 36 and 15 in the sampled traffic. M. Lindqvist raised that the webhooks runbook still names the Perl script. To be fixed after cutover. No change in behaviour was requested for settlement in this session. The webhooks smoke test covers one signed request and one verified request per key id. Disk on gw-edge-02 was at 55 percent after the replay and was cleared by hand.

## Initech / Settlement

P. Oyelaran raised that the onboarding runbook still names the Perl script. To be fixed after cutover. Evidence for catalog is written to the spool directory and collected every 35 minutes. Mismatch rate on catalog was 0.2 percent over the window, all of it from one Contoso sandbox client.

## Umbrella sandbox

S. Varga asked for the canonical hash to be shown next to each mismatch in the disputes dashboard so partners can compare. The signer account on gw-edge-03 has no outbound network route, which fraud-ops verified again on 2025-10-14. The proxy in front of gw-edge-03 was upgraded on 2025-11-28. S. Varga compared captures from before and after. The legacy signer peaked at roughly 11k requests per minute on catalog during the last cycle.

## Initech sandbox

K. Mwangi noted that the webhooks client sets its content type on every request, including ones with no body. The webhook signer is owned by the webhooks team and is not part of this migration. Umbrella confirmed they are on SDK 3.2 in production and 3.0 in their sandbox. The legacy signer peaked at roughly 23k requests per minute on settlement during the last cycle.

## data-plane review

Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. Contoso asked for a second sandbox key id and were pointed at the onboarding form. Evidence for refunds is written to the spool directory and collected every 39 minutes. The signer account on gw-edge-04 has no outbound network route, which data-plane verified again on 2025-11-24. Alert thresholds for disputes stay where they are until two clean weeks have passed.

## data-plane review

The key directory on gw-edge-01 is readable by the signer account only. A Contoso engineer joined for this item and dropped off afterwards. Disk on gw-edge-03 was at 61 percent after the replay and was cleared by hand. Northwind use the same key id for webhooks and orders. That is allowed. Umbrella confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. D. Achterberg noted that the orders client sets its content type on every request, including ones with no body.

## Host gw-edge-04

A Globex engineer joined for this item and dropped off afterwards. Evidence for settlement is written to the spool directory and collected every 27 minutes. A. Nakamura noted that the ledger client sets its content type on every request, including ones with no body. No change in behaviour was requested for refunds in this session. The data-plane team asked for one more dry run on gw-edge-04 before catalog moves. Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing.

## Onboarding / billing

The signer account on gw-edge-01 has no outbound network route, which identity verified again on 2025-09-30. Latency through the signer stayed under 5ms at p99 across the webhooks replay. P. Oyelaran noted that the reconciliation client sets its content type on every request, including ones with no body. M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare. The rollback rehearsal for reconciliation took 11 minutes end to end on gw-edge-02. Disk on gw-edge-01 was at 58 percent after the replay and was cleared by hand.

## Webhooks window

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. The rollback rehearsal for webhooks took 33 minutes end to end on gw-edge-03. Latency through the signer stayed under 7ms at p99 across the orders replay. Evidence for disputes is written to the spool directory and collected every 6 minutes.

## Northwind sandbox

The key directory on gw-edge-03 is readable by the signer account only. Northwind confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. No change in behaviour was requested for settlement in this session. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Initech asked for a second sandbox key id and were pointed at the onboarding form. R. Okonkwo reported that the disputes cutover is on track for the week of 2025-10-02.

## Reconciliation notes

Initech use the same key id for payouts and onboarding. That is allowed. The proxy in front of gw-edge-04 was upgraded on 2025-11-11. A. Nakamura compared captures from before and after. The signer account on gw-edge-04 has no outbound network route, which edge-platform verified again on 2025-10-09.

## Contoso sandbox

The proxy in front of gw-edge-01 was upgraded on 2025-10-02. A. Nakamura compared captures from before and after. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. The rollback rehearsal for disputes took 39 minutes end to end on gw-edge-03.

## Reconciliation window

The webhooks queue drained in 53 minutes after the replay, which is within the agreed window. A. Nakamura reported that the onboarding cutover is on track for the week of 2025-09-30. The proxy in front of gw-edge-04 was upgraded on 2025-10-14. L. Fontaine compared captures from before and after. Latency through the signer stayed under 3ms at p99 across the orders replay.

## Initech sandbox

Mismatch rate on onboarding was 0.8 percent over the window, all of it from one Contoso sandbox client. The disputes smoke test covers one signed request and one verified request per key id. Key files are distributed by the provisioning job, which edge-platform own.

## partner-integrations review

The proxy in front of gw-edge-03 was upgraded on 2025-09-30. T. Bergstrom compared captures from before and after. P. Oyelaran asked whether onboarding still needs the old batch window. Nobody objected to dropping it. Evidence for orders is written to the spool directory and collected every 10 minutes. Latency through the signer stayed under 1ms at p99 across the onboarding replay. Globex use the same key id for payouts and reconciliation. That is allowed. A. Nakamura reported that the refunds cutover is on track for the week of 2025-11-28.

## edge-platform review

Capacity headroom on refunds is about 33 percent at the current peak. The proxy in front of gw-edge-01 was upgraded on 2025-11-24. R. Okonkwo compared captures from before and after. The ledger replay set has 6651 requests, of which 29 carry a query string. Key files are distributed by the provisioning job, which billing own.

## Orders / payments-api

Mismatch rate on payouts was 0.6 percent over the window, all of it from one Northwind sandbox client. P. Oyelaran noted that the payouts client sets its content type on every request, including ones with no body. Alert thresholds for reconciliation stay where they are until two clean weeks have passed. The orders dashboard now splits signature mismatches by key id and by partner. S. Varga asked for the canonical hash to be shown next to each mismatch in the webhooks dashboard so partners can compare.

## Orders / payments-api

Initech asked for a second sandbox key id and were pointed at the onboarding form. R. Okonkwo reported that the refunds cutover is on track for the week of 2025-12-08. Contoso reported 8 failed requests on 2025-10-14, all traced to an expired sandbox credential on their side. K. Mwangi asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated.

## Umbrella sandbox

Alert thresholds for disputes stay where they are until two clean weeks have passed. L. Fontaine noted that the webhooks client sets its content type on every request, including ones with no body. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Contoso reported 6 failed requests on 2025-11-24, all traced to an expired sandbox credential on their side. The signer account on gw-edge-03 has no outbound network route, which data-plane verified again on 2025-12-01.

## sre-core review

S. Varga raised that the orders runbook still names the Perl script. To be fixed after cutover. The proxy in front of gw-edge-03 was upgraded on 2025-09-30. S. Varga compared captures from before and after. Key files are distributed by the provisioning job, which sre-core own. No change in behaviour was requested for disputes in this session. The ledger queue drained in 11 minutes after the replay, which is within the agreed window.

## Refunds window

The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The settlement queue drained in 22 minutes after the replay, which is within the agreed window. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the reconciliation dashboard so partners can compare. The catalog smoke test covers one signed request and one verified request per key id.

## Catalog window

The ledger replay set has 6987 requests, of which 40 carry a query string. Northwind use the same key id for settlement and reconciliation. That is allowed. No change in behaviour was requested for onboarding in this session.

## Globex / Payouts

A Contoso engineer joined for this item and dropped off afterwards. The refunds dashboard now splits signature mismatches by key id and by partner. Umbrella confirmed they are on SDK 3.1 in production and 3.0 in their sandbox. Header count per request on disputes is between 24 and 17 in the sampled traffic. The disputes smoke test covers one signed request and one verified request per key id. K. Mwangi has the action to circulate the ledger numbers before the next session.

## Northwind sandbox

Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The billing team asked for one more dry run on gw-edge-04 before webhooks moves. L. Fontaine asked whether ledger still needs the old batch window. Nobody objected to dropping it. Disk on gw-edge-02 was at 54 percent after the replay and was cleared by hand.

## Catalog notes

The fraud-ops team want the evidence files kept for 30 days after cutover. L. Fontaine noted that the settlement client sets its content type on every request, including ones with no body. The legacy signer peaked at roughly 4k requests per minute on webhooks during the last cycle.

## fraud-ops review

The rollback rehearsal for catalog took 14 minutes end to end on gw-edge-02. Key files are distributed by the provisioning job, which payments-api own. S. Varga raised that the payouts runbook still names the Perl script. To be fixed after cutover.

## Webhooks notes

S. Varga will rerun the reconciliation replay once Contoso finish their client release. The edge-platform team asked for one more dry run on gw-edge-03 before onboarding moves. The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Umbrella / Reconciliation

R. Okonkwo will rerun the disputes replay once Initech finish their client release. S. Varga has the action to circulate the settlement numbers before the next session. The rollback rehearsal for webhooks took 33 minutes end to end on gw-edge-04. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. Capacity headroom on onboarding is about 22 percent at the current peak.

## partner-integrations review

Evidence for reconciliation is written to the spool directory and collected every 7 minutes. Alert thresholds for onboarding stay where they are until two clean weeks have passed. Initech sends header names in upper case. Names are lowercased on our side, so this has never mattered. Latency through the signer stayed under 3ms at p99 across the catalog replay. Header count per request on webhooks is between 38 and 12 in the sampled traffic. The webhooks dashboard now splits signature mismatches by key id and by partner.

## Globex sandbox

L. Fontaine will rerun the settlement replay once Northwind finish their client release. Latency through the signer stayed under 6ms at p99 across the onboarding replay. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. A. Nakamura checked that the same ledger request produces the same canonical hash on gw-edge-03 and gw-edge-04. Header count per request on disputes is between 21 and 18 in the sampled traffic. The settlement replay set has 7079 requests, of which 24 carry a query string.

## Onboarding / fraud-ops

Northwind asked for a second sandbox key id and were pointed at the onboarding form. Header count per request on webhooks is between 34 and 16 in the sampled traffic. The webhook signer does not cover the query string at all, because receivers register a fixed URL. Latency through the signer stayed under 1ms at p99 across the payouts replay. The reconciliation smoke test covers one signed request and one verified request per key id.

## Host gw-edge-02

Capacity headroom on webhooks is about 62 percent at the current peak. No change in behaviour was requested for payouts in this session. J. Delacroix reported that the reconciliation cutover is on track for the week of 2025-12-05. M. Lindqvist noted that the refunds client sets its content type on every request, including ones with no body. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that.

## sre-core review

Capacity headroom on onboarding is about 50 percent at the current peak. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Mismatch rate on orders was 0.6 percent over the window, all of it from one Northwind sandbox client. A. Nakamura reported that the settlement cutover is on track for the week of 2025-11-11. The signer account on gw-edge-03 has no outbound network route, which billing verified again on 2025-11-11. Latency through the signer stayed under 5ms at p99 across the payouts replay.

## Host gw-edge-02

S. Varga checked that the same disputes request produces the same canonical hash on gw-edge-03 and gw-edge-02. The legacy signer peaked at roughly 9k requests per minute on ledger during the last cycle. The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Generator caveat

The load generator signs with only the `x-gw-` headers in its header block and sends the `UNSIGNED` token for bodiless requests. It was written on 2025-10-09 and nobody has had a reason to change it, since the load test measures throughput and discards the verification result.

## Catalog window

Disk on gw-edge-03 was at 25 percent after the replay and was cleared by hand. Umbrella confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. Capacity headroom on disputes is about 58 percent at the current peak. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the orders dashboard so partners can compare.

## payments-api review

Key files are distributed by the provisioning job, which payments-api own. Evidence for onboarding is written to the spool directory and collected every 7 minutes. The ledger dashboard now splits signature mismatches by key id and by partner.

## Payouts / identity

The legacy signer peaked at roughly 15k requests per minute on payouts during the last cycle. Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The disputes queue drained in 50 minutes after the replay, which is within the agreed window. No change in behaviour was requested for onboarding in this session.

## Reconciliation / identity

No change in behaviour was requested for payouts in this session. The payouts queue drained in 45 minutes after the replay, which is within the agreed window. Umbrella asked for a second sandbox key id and were pointed at the onboarding form.

## Settlement window

The legacy signer peaked at roughly 8k requests per minute on catalog during the last cycle. Header count per request on ledger is between 19 and 18 in the sampled traffic. The rollback rehearsal for payouts took 8 minutes end to end on gw-edge-03. Capacity headroom on webhooks is about 60 percent at the current peak. A. Nakamura checked that the same payouts request produces the same canonical hash on gw-edge-02 and gw-edge-04.

## partner-integrations review

A. Nakamura has the action to circulate the refunds numbers before the next session. The ledger dashboard now splits signature mismatches by key id and by partner. D. Achterberg will rerun the ledger replay once Umbrella finish their client release. The identity team asked for one more dry run on gw-edge-01 before ledger moves. Header count per request on ledger is between 27 and 13 in the sampled traffic.

## Host gw-edge-04

L. Fontaine will rerun the onboarding replay once Northwind finish their client release. T. Bergstrom checked that the same refunds request produces the same canonical hash on gw-edge-03 and gw-edge-01. The onboarding dashboard now splits signature mismatches by key id and by partner. Latency through the signer stayed under 2ms at p99 across the ledger replay. Northwind use the same key id for ledger and refunds. That is allowed. The rollback rehearsal for payouts took 52 minutes end to end on gw-edge-01.

## Webhooks window

Disk on gw-edge-04 was at 66 percent after the replay and was cleared by hand. Latency through the signer stayed under 1ms at p99 across the refunds replay. A. Nakamura has the action to circulate the webhooks numbers before the next session.

## Host gw-edge-03

A. Nakamura has the action to circulate the disputes numbers before the next session. Mismatch rate on refunds was 0.3 percent over the window, all of it from one Globex sandbox client. Umbrella confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. The payments-api team want the evidence files kept for 14 days after cutover. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Latency through the signer stayed under 3ms at p99 across the orders replay.

## Settlement / billing

The orders smoke test covers one signed request and one verified request per key id. Latency through the signer stayed under 2ms at p99 across the webhooks replay. No change in behaviour was requested for payouts in this session. Mismatch rate on settlement was 0.3 percent over the window, all of it from one Contoso sandbox client. L. Fontaine raised that the onboarding runbook still names the Perl script. To be fixed after cutover. Header count per request on settlement is between 15 and 10 in the sampled traffic.

## Umbrella / Catalog

Latency through the signer stayed under 6ms at p99 across the webhooks replay. The ledger replay set has 4578 requests, of which 17 carry a query string. Capacity headroom on ledger is about 47 percent at the current peak. L. Fontaine checked that the same payouts request produces the same canonical hash on gw-edge-02 and gw-edge-04. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that. K. Mwangi raised that the settlement runbook still names the Perl script. To be fixed after cutover.

## partner-integrations review

The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that. The rollback rehearsal for disputes took 37 minutes end to end on gw-edge-01. The proxy in front of gw-edge-01 was upgraded on 2025-12-05. M. Lindqvist compared captures from before and after. The signer account on gw-edge-03 has no outbound network route, which payments-api verified again on 2025-10-23. The identity team asked for one more dry run on gw-edge-04 before orders moves. J. Delacroix checked that the same catalog request produces the same canonical hash on gw-edge-03 and gw-edge-01. A. Nakamura asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare.

## billing review

No change in behaviour was requested for refunds in this session. The disputes replay set has 5559 requests, of which 13 carry a query string. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. Header count per request on catalog is between 15 and 9 in the sampled traffic.
