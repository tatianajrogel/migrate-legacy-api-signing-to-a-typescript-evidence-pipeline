# Appendix - Capacity Planning Notes

## Payouts notes

The rollback rehearsal for webhooks took 18 minutes end to end on gw-edge-01. The webhook signer joins its signed header names with a comma. Initech sends header names in upper case. Names are lowercased on our side, so this has never mattered. A Globex engineer joined for this item and dropped off afterwards. The identity team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Reconciliation notes

The disputes replay set has 2570 requests, of which 16 carry a query string. P. Oyelaran asked for the canonical hash to be shown next to each mismatch in the catalog dashboard so partners can compare. The proxy in front of gw-edge-04 was upgraded on 2025-11-11. K. Mwangi compared captures from before and after. No change in behaviour was requested for catalog in this session.

## Umbrella / Disputes

Globex confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. The partner-integrations team want the evidence files kept for 90 days after cutover. Alert thresholds for onboarding stay where they are until two clean weeks have passed. The proxy in front of gw-edge-04 was upgraded on 2025-11-28. D. Achterberg compared captures from before and after. Umbrella reported 15 failed requests on 2025-10-09, all traced to an expired sandbox credential on their side. No change in behaviour was requested for reconciliation in this session.

## Reconciliation notes

Evidence for settlement is written to the spool directory and collected every 28 minutes. Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. L. Fontaine reported that the settlement cutover is on track for the week of 2025-12-08. Latency through the signer stayed under 7ms at p99 across the disputes replay.

## Host gw-edge-02

The identity team want the evidence files kept for 7 days after cutover. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The settlement queue drained in 19 minutes after the replay, which is within the agreed window. T. Bergstrom checked that the same disputes request produces the same canonical hash on gw-edge-04 and gw-edge-03. Header count per request on disputes is between 14 and 16 in the sampled traffic.

## billing review

The rollback rehearsal for orders took 23 minutes end to end on gw-edge-01. Umbrella reported 40 failed requests on 2025-12-05, all traced to an expired sandbox credential on their side. Capacity headroom on webhooks is about 46 percent at the current peak. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. A. Nakamura will rerun the ledger replay once Northwind finish their client release. Key files are distributed by the provisioning job, which billing own.

## partner-integrations review

Mismatch rate on ledger was 0.6 percent over the window, all of it from one Umbrella sandbox client. The sre-core team want the evidence files kept for 30 days after cutover. The legacy signer peaked at roughly 5k requests per minute on ledger during the last cycle. Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The settlement queue drained in 4 minutes after the replay, which is within the agreed window.

## Globex sandbox

Capacity headroom on webhooks is about 32 percent at the current peak. Umbrella confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. The payouts dashboard now splits signature mismatches by key id and by partner.

## Northwind / Refunds

Header count per request on onboarding is between 30 and 13 in the sampled traffic. The signer account on gw-edge-03 has no outbound network route, which data-plane verified again on 2025-10-09. Disk on gw-edge-04 was at 48 percent after the replay and was cleared by hand. The rollback rehearsal for disputes took 42 minutes end to end on gw-edge-01. Globex reported 33 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side. The legacy signer peaked at roughly 27k requests per minute on ledger during the last cycle.

## Refunds notes

Mismatch rate on orders was 0.7 percent over the window, all of it from one Northwind sandbox client. No change in behaviour was requested for onboarding in this session. Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. Initech reported 27 failed requests on 2025-10-09, all traced to an expired sandbox credential on their side.

## Globex sandbox

Contoso confirmed they are on SDK 3.2 in production and 3.0 in their sandbox. The payments-api team want the evidence files kept for 7 days after cutover. Evidence for webhooks is written to the spool directory and collected every 18 minutes.

## Northwind / Reconciliation

The outbound webhook signer (WH-HMAC-SHA256) puts a timestamp line ahead of everything else in its string to sign. Latency through the signer stayed under 6ms at p99 across the reconciliation replay. A Contoso engineer joined for this item and dropped off afterwards. Globex asked for a second sandbox key id and were pointed at the onboarding form. The signer account on gw-edge-03 has no outbound network route, which fraud-ops verified again on 2025-10-23. M. Lindqvist reported that the ledger cutover is on track for the week of 2025-11-24. L. Fontaine will rerun the refunds replay once Globex finish their client release.

## Umbrella / Disputes

The data-plane team want the evidence files kept for 30 days after cutover. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. The reconciliation queue drained in 10 minutes after the replay, which is within the agreed window. A. Nakamura will rerun the reconciliation replay once Initech finish their client release. Globex confirmed they are on SDK 3.0 in production and 3.1 in their sandbox.

## Refunds notes

Evidence for onboarding is written to the spool directory and collected every 54 minutes. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. The signer account on gw-edge-02 has no outbound network route, which sre-core verified again on 2025-12-01. Key files are distributed by the provisioning job, which edge-platform own. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## Catalog notes

Capacity headroom on catalog is about 70 percent at the current peak. The key directory on gw-edge-02 is readable by the signer account only. Evidence for ledger is written to the spool directory and collected every 17 minutes.

## Catalog / payments-api

J. Delacroix asked whether reconciliation still needs the old batch window. Nobody objected to dropping it. Capacity headroom on catalog is about 55 percent at the current peak. The key directory on gw-edge-02 is readable by the signer account only. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. M. Lindqvist will rerun the disputes replay once Umbrella finish their client release.

## Catalog notes

The rollback rehearsal for ledger took 51 minutes end to end on gw-edge-03. Capacity headroom on catalog is about 68 percent at the current peak. No change in behaviour was requested for catalog in this session. Header count per request on payouts is between 33 and 9 in the sampled traffic. M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the catalog dashboard so partners can compare.

## Northwind sandbox

T. Bergstrom noted that the refunds client sets its content type on every request, including ones with no body. Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. The catalog dashboard now splits signature mismatches by key id and by partner. The payments-api team want the evidence files kept for 7 days after cutover. J. Delacroix checked that the same ledger request produces the same canonical hash on gw-edge-04 and gw-edge-02. The webhook signer signs header values exactly as it builds them, with no trimming, since it is the one sending them.

## Ledger window

Umbrella asked for a second sandbox key id and were pointed at the onboarding form. Globex use the same key id for payouts and refunds. That is allowed. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. Key files are distributed by the provisioning job, which edge-platform own. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. K. Mwangi noted that the payouts client sets its content type on every request, including ones with no body.

## Initech / Reconciliation

Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The partner-integrations team want the evidence files kept for 90 days after cutover. S. Varga asked for the canonical hash to be shown next to each mismatch in the reconciliation dashboard so partners can compare. Alert thresholds for payouts stay where they are until two clean weeks have passed. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it.

## billing review

J. Delacroix asked for the canonical hash to be shown next to each mismatch in the orders dashboard so partners can compare. Header count per request on ledger is between 23 and 15 in the sampled traffic. D. Achterberg raised that the catalog runbook still names the Perl script. To be fixed after cutover. The edge-platform team want the evidence files kept for 14 days after cutover. Key files are distributed by the provisioning job, which billing own.

## Reconciliation window

Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. P. Oyelaran reported that the onboarding cutover is on track for the week of 2025-11-24. P. Oyelaran will rerun the payouts replay once Contoso finish their client release. A. Nakamura has the action to circulate the payouts numbers before the next session. A. Nakamura raised that the webhooks runbook still names the Perl script. To be fixed after cutover. The key directory on gw-edge-02 is readable by the signer account only.

## Catalog / sre-core

Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. J. Delacroix will rerun the orders replay once Umbrella finish their client release. Capacity headroom on onboarding is about 35 percent at the current peak. Globex use the same key id for settlement and payouts. That is allowed. The proxy in front of gw-edge-04 was upgraded on 2025-10-14. T. Bergstrom compared captures from before and after. Mismatch rate on catalog was 0.3 percent over the window, all of it from one Initech sandbox client.

## Payouts notes

The legacy signer peaked at roughly 28k requests per minute on ledger during the last cycle. Capacity headroom on ledger is about 40 percent at the current peak. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. P. Oyelaran has the action to circulate the reconciliation numbers before the next session. S. Varga asked for the canonical hash to be shown next to each mismatch in the settlement dashboard so partners can compare.

## Northwind sandbox

The ledger queue drained in 6 minutes after the replay, which is within the agreed window. The disputes dashboard now splits signature mismatches by key id and by partner. A. Nakamura asked for the canonical hash to be shown next to each mismatch in the catalog dashboard so partners can compare. Header count per request on catalog is between 11 and 7 in the sampled traffic.

## Contoso / Settlement

The refunds dashboard now splits signature mismatches by key id and by partner. J. Delacroix asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare. The webhook signer joins its signed header names with a comma. Umbrella asked for a second sandbox key id and were pointed at the onboarding form. The settlement queue drained in 28 minutes after the replay, which is within the agreed window.

## Initech / Catalog

Globex confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Capacity headroom on webhooks is about 34 percent at the current peak.

## Catalog / billing

Key files are distributed by the provisioning job, which edge-platform own. Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The fraud-ops team asked for one more dry run on gw-edge-01 before webhooks moves.

## Host gw-edge-02

J. Delacroix has the action to circulate the disputes numbers before the next session. The proxy in front of gw-edge-03 was upgraded on 2025-12-08. A. Nakamura compared captures from before and after. Latency through the signer stayed under 6ms at p99 across the reconciliation replay. The ledger replay set has 2878 requests, of which 4 carry a query string. Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Initech asked for a second sandbox key id and were pointed at the onboarding form.

## Northwind sandbox

The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. The edge-platform team asked for one more dry run on gw-edge-04 before disputes moves. Disk on gw-edge-02 was at 25 percent after the replay and was cleared by hand. Evidence for refunds is written to the spool directory and collected every 48 minutes.

## Catalog / payments-api

Header count per request on payouts is between 30 and 7 in the sampled traffic. Initech confirmed they are on SDK 3.0 in production and 3.2 in their sandbox. Capacity headroom on onboarding is about 77 percent at the current peak.

## Umbrella sandbox

The rollback rehearsal for onboarding took 17 minutes end to end on gw-edge-04. Initech reported 14 failed requests on 2025-10-14, all traced to an expired sandbox credential on their side. M. Lindqvist checked that the same reconciliation request produces the same canonical hash on gw-edge-01 and gw-edge-02.

## Contoso sandbox

P. Oyelaran raised that the reconciliation runbook still names the Perl script. To be fixed after cutover. The rollback rehearsal for onboarding took 47 minutes end to end on gw-edge-01. Initech confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. R. Okonkwo asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare. K. Mwangi noted that the settlement client sets its content type on every request, including ones with no body.

## Host gw-edge-02

Mismatch rate on refunds was 0.8 percent over the window, all of it from one Umbrella sandbox client. The access log truncates query strings longer than 512 bytes. The request itself is not truncated. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the reconciliation dashboard so partners can compare. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. No change in behaviour was requested for catalog in this session.

## Webhooks / edge-platform

S. Varga raised that the onboarding runbook still names the Perl script. To be fixed after cutover. P. Oyelaran checked that the same disputes request produces the same canonical hash on gw-edge-04 and gw-edge-02. Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. Latency through the signer stayed under 4ms at p99 across the onboarding replay. Initech asked for a second sandbox key id and were pointed at the onboarding form.

## Reconciliation notes

The edge-platform team want the evidence files kept for 90 days after cutover. Header count per request on settlement is between 14 and 10 in the sampled traffic. A Northwind engineer joined for this item and dropped off afterwards.

## Northwind sandbox

The legacy signer peaked at roughly 14k requests per minute on payouts during the last cycle. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. The proxy in front of gw-edge-03 was upgraded on 2025-10-29. D. Achterberg compared captures from before and after.

## Northwind / Ledger

The legacy signer peaked at roughly 29k requests per minute on disputes during the last cycle. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. The proxy in front of gw-edge-03 was upgraded on 2025-10-29. J. Delacroix compared captures from before and after. The access log truncates query strings longer than 512 bytes. The request itself is not truncated. The payments-api team want the evidence files kept for 7 days after cutover. The key directory on gw-edge-03 is readable by the signer account only.

## Reconciliation / identity

The webhook signer is owned by the webhooks team and is not part of this migration. The rollback rehearsal for orders took 38 minutes end to end on gw-edge-02. Contoso confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. A Contoso engineer joined for this item and dropped off afterwards.

## Payouts notes

No change in behaviour was requested for ledger in this session. Evidence for refunds is written to the spool directory and collected every 22 minutes. D. Achterberg raised that the payouts runbook still names the Perl script. To be fixed after cutover. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. T. Bergstrom asked whether ledger still needs the old batch window. Nobody objected to dropping it.

## Host gw-edge-01

R. Okonkwo checked that the same ledger request produces the same canonical hash on gw-edge-04 and gw-edge-01. Key files are distributed by the provisioning job, which billing own. Evidence for settlement is written to the spool directory and collected every 49 minutes.

## Northwind / Orders

Alert thresholds for onboarding stay where they are until two clean weeks have passed. The signer account on gw-edge-04 has no outbound network route, which data-plane verified again on 2025-11-28. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. K. Mwangi asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare. The orders queue drained in 40 minutes after the replay, which is within the agreed window.

## Refunds / fraud-ops

The edge-platform team asked for one more dry run on gw-edge-04 before refunds moves. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The disputes queue drained in 32 minutes after the replay, which is within the agreed window. Initech use the same key id for payouts and webhooks. That is allowed. Evidence for settlement is written to the spool directory and collected every 48 minutes.

## fraud-ops review

Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. K. Mwangi noted that the payouts client sets its content type on every request, including ones with no body. The access log truncates query strings longer than 8192 bytes. The request itself is not truncated. Evidence for ledger is written to the spool directory and collected every 9 minutes. Alert thresholds for refunds stay where they are until two clean weeks have passed. Mismatch rate on settlement was 0.7 percent over the window, all of it from one Contoso sandbox client.

## Contoso sandbox

Header count per request on refunds is between 5 and 15 in the sampled traffic. Latency through the signer stayed under 4ms at p99 across the ledger replay. T. Bergstrom reported that the disputes cutover is on track for the week of 2025-11-03. The proxy in front of gw-edge-03 was upgraded on 2025-12-05. D. Achterberg compared captures from before and after. P. Oyelaran checked that the same ledger request produces the same canonical hash on gw-edge-03 and gw-edge-01.

## Host gw-edge-04

Initech reported 15 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side. D. Achterberg has the action to circulate the orders numbers before the next session. Latency through the signer stayed under 7ms at p99 across the payouts replay.

## Contoso sandbox

The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. Mismatch rate on webhooks was 0.8 percent over the window, all of it from one Northwind sandbox client. M. Lindqvist reported that the webhooks cutover is on track for the week of 2025-12-08.

## Reconciliation / partner-integrations

The disputes queue drained in 49 minutes after the replay, which is within the agreed window. The reconciliation replay set has 2154 requests, of which 35 carry a query string. Disk on gw-edge-04 was at 49 percent after the replay and was cleared by hand. The catalog smoke test covers one signed request and one verified request per key id. The key directory on gw-edge-02 is readable by the signer account only. Header count per request on catalog is between 39 and 13 in the sampled traffic.

## Globex sandbox

D. Achterberg checked that the same orders request produces the same canonical hash on gw-edge-04 and gw-edge-01. The ledger queue drained in 6 minutes after the replay, which is within the agreed window. Contoso asked for a second sandbox key id and were pointed at the onboarding form.

## Catalog window

The reconciliation smoke test covers one signed request and one verified request per key id. P. Oyelaran has the action to circulate the disputes numbers before the next session. Globex confirmed they are on SDK 3.1 in production and 3.0 in their sandbox. A. Nakamura asked whether webhooks still needs the old batch window. Nobody objected to dropping it. R. Okonkwo asked for the canonical hash to be shown next to each mismatch in the catalog dashboard so partners can compare. A Globex engineer joined for this item and dropped off afterwards.

## edge-platform review

The refunds replay set has 4217 requests, of which 28 carry a query string. A Northwind engineer joined for this item and dropped off afterwards. Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The edge-platform team want the evidence files kept for 90 days after cutover. The partner-integrations team asked for one more dry run on gw-edge-01 before payouts moves.

## Globex / Refunds

The onboarding smoke test covers one signed request and one verified request per key id. The signer account on gw-edge-04 has no outbound network route, which billing verified again on 2025-11-03. M. Lindqvist reported that the catalog cutover is on track for the week of 2025-10-29.

## Globex / Settlement

The key directory on gw-edge-03 is readable by the signer account only. The catalog replay set has 2787 requests, of which 3 carry a query string. Capacity headroom on payouts is about 42 percent at the current peak.

## partner-integrations review

Latency through the signer stayed under 7ms at p99 across the onboarding replay. The rollback rehearsal for reconciliation took 10 minutes end to end on gw-edge-04. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Disk on gw-edge-01 was at 61 percent after the replay and was cleared by hand.
