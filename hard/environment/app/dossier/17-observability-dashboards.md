# Appendix - Observability Dashboards

## Settlement notes

The data-plane team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. K. Mwangi asked for the canonical hash to be shown next to each mismatch in the webhooks dashboard so partners can compare. Key files are distributed by the provisioning job, which billing own. The proxy in front of gw-edge-01 was upgraded on 2025-11-28. J. Delacroix compared captures from before and after. Alert thresholds for refunds stay where they are until two clean weeks have passed. Latency through the signer stayed under 5ms at p99 across the payouts replay.

## Onboarding window

The key directory on gw-edge-02 is readable by the signer account only. Key files are distributed by the provisioning job, which edge-platform own. Umbrella reported 6 failed requests on 2025-10-14, all traced to an expired sandbox credential on their side. Initech confirmed they are on SDK 3.0 in production and 3.1 in their sandbox. P. Oyelaran noted that the onboarding client sets its content type on every request, including ones with no body.

## Host gw-edge-01

Capacity headroom on disputes is about 47 percent at the current peak. A. Nakamura has the action to circulate the orders numbers before the next session. Key files are distributed by the provisioning job, which edge-platform own. The payments-api team want the evidence files kept for 7 days after cutover.

## Disputes notes

Evidence for refunds is written to the spool directory and collected every 25 minutes. The payouts replay set has 2874 requests, of which 9 carry a query string. Key files are distributed by the provisioning job, which sre-core own. A Umbrella engineer joined for this item and dropped off afterwards. No change in behaviour was requested for disputes in this session. The rollback rehearsal for settlement took 35 minutes end to end on gw-edge-03.

## Refunds / identity

J. Delacroix checked that the same disputes request produces the same canonical hash on gw-edge-03 and gw-edge-02. Initech reported 27 failed requests on 2025-11-03, all traced to an expired sandbox credential on their side. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The payouts dashboard now splits signature mismatches by key id and by partner. Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Disk on gw-edge-02 was at 30 percent after the replay and was cleared by hand.

## Host gw-edge-02

Globex asked for a second sandbox key id and were pointed at the onboarding form. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. The rollback rehearsal for onboarding took 53 minutes end to end on gw-edge-04.

## Globex / Disputes

D. Achterberg raised that the payouts runbook still names the Perl script. To be fixed after cutover. Initech asked for a second sandbox key id and were pointed at the onboarding form. The proxy in front of gw-edge-01 was upgraded on 2025-11-03. K. Mwangi compared captures from before and after. The webhook signer joins its signed header names with a comma. The catalog smoke test covers one signed request and one verified request per key id. The billing team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## payments-api review

P. Oyelaran reported that the reconciliation cutover is on track for the week of 2025-11-24. Northwind asked for a second sandbox key id and were pointed at the onboarding form. Evidence for refunds is written to the spool directory and collected every 36 minutes. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Contoso retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The rollback rehearsal for disputes took 27 minutes end to end on gw-edge-04.

## Reconciliation notes

Initech reported 3 failed requests on 2025-11-11, all traced to an expired sandbox credential on their side. Alert thresholds for disputes stay where they are until two clean weeks have passed. The payments-api team want the evidence files kept for 14 days after cutover.

## Catalog / billing

Evidence for orders is written to the spool directory and collected every 55 minutes. The rollback rehearsal for onboarding took 48 minutes end to end on gw-edge-03. The data-plane team want the evidence files kept for 7 days after cutover. M. Lindqvist checked that the same refunds request produces the same canonical hash on gw-edge-01 and gw-edge-04. The ledger dashboard now splits signature mismatches by key id and by partner. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it.

## Host gw-edge-04

The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Alert thresholds for disputes stay where they are until two clean weeks have passed. The legacy signer peaked at roughly 20k requests per minute on reconciliation during the last cycle. The fraud-ops team want the evidence files kept for 30 days after cutover.

## Catalog / payments-api

R. Okonkwo will rerun the webhooks replay once Northwind finish their client release. Capacity headroom on ledger is about 51 percent at the current peak. Evidence for ledger is written to the spool directory and collected every 42 minutes. The access log truncates query strings longer than 8192 bytes. The request itself is not truncated. The legacy signer peaked at roughly 15k requests per minute on orders during the last cycle.

## Reconciliation notes

The reconciliation queue drained in 55 minutes after the replay, which is within the agreed window. The webhook signer renders its signatures as base64, which the data-plane team would like to keep. No change in behaviour was requested for webhooks in this session. Initech confirmed they are on SDK 3.0 in production and 3.2 in their sandbox.

## partner-integrations review

The webhook signer signs header values exactly as it builds them, with no trimming, since it is the one sending them. Contoso asked for a second sandbox key id and were pointed at the onboarding form. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. The signer account on gw-edge-04 has no outbound network route, which billing verified again on 2025-12-08.

## Contoso / Disputes

The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. Evidence for disputes is written to the spool directory and collected every 23 minutes. The edge-platform team want the evidence files kept for 14 days after cutover. Alert thresholds for settlement stay where they are until two clean weeks have passed. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## fraud-ops review

The onboarding smoke test covers one signed request and one verified request per key id. Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. The reconciliation queue drained in 28 minutes after the replay, which is within the agreed window. P. Oyelaran checked that the same orders request produces the same canonical hash on gw-edge-01 and gw-edge-04. The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that.

## Catalog / sre-core

The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. Header count per request on settlement is between 21 and 12 in the sampled traffic. Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. D. Achterberg asked whether disputes still needs the old batch window. Nobody objected to dropping it. The reconciliation smoke test covers one signed request and one verified request per key id.

## Host gw-edge-03

A. Nakamura noted that the ledger client sets its content type on every request, including ones with no body. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. The settlement queue drained in 35 minutes after the replay, which is within the agreed window. A Northwind engineer joined for this item and dropped off afterwards.

## Onboarding / data-plane

Initech asked for a second sandbox key id and were pointed at the onboarding form. A Umbrella engineer joined for this item and dropped off afterwards. Header count per request on ledger is between 25 and 13 in the sampled traffic.

## Globex sandbox

The identity team asked for one more dry run on gw-edge-04 before webhooks moves. Alert thresholds for webhooks stay where they are until two clean weeks have passed. The settlement replay set has 1934 requests, of which 24 carry a query string. R. Okonkwo checked that the same catalog request produces the same canonical hash on gw-edge-02 and gw-edge-04.

## Initech / Ledger

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Mismatch rate on settlement was 0.2 percent over the window, all of it from one Umbrella sandbox client. Umbrella use the same key id for webhooks and refunds. That is allowed. The legacy signer peaked at roughly 17k requests per minute on orders during the last cycle. J. Delacroix noted that the refunds client sets its content type on every request, including ones with no body. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it.

## Catalog notes

The key directory on gw-edge-03 is readable by the signer account only. The sre-core team want the evidence files kept for 7 days after cutover. R. Okonkwo will rerun the ledger replay once Umbrella finish their client release.

## Contoso sandbox

Northwind retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. Initech asked for a second sandbox key id and were pointed at the onboarding form. The fraud-ops team asked for one more dry run on gw-edge-02 before disputes moves.

## Refunds notes

The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. Capacity headroom on webhooks is about 70 percent at the current peak. Northwind reported 39 failed requests on 2025-11-24, all traced to an expired sandbox credential on their side. T. Bergstrom raised that the catalog runbook still names the Perl script. To be fixed after cutover. K. Mwangi asked whether settlement still needs the old batch window. Nobody objected to dropping it.

## Catalog / fraud-ops

S. Varga checked that the same reconciliation request produces the same canonical hash on gw-edge-01 and gw-edge-02. Key files are distributed by the provisioning job, which fraud-ops own. M. Lindqvist will rerun the reconciliation replay once Globex finish their client release. Globex use the same key id for orders and refunds. That is allowed. The signer account on gw-edge-03 has no outbound network route, which identity verified again on 2025-11-24. Disk on gw-edge-03 was at 65 percent after the replay and was cleared by hand.

## Disputes / partner-integrations

The proxy in front of gw-edge-02 was upgraded on 2025-12-05. D. Achterberg compared captures from before and after. Header count per request on settlement is between 12 and 7 in the sampled traffic. The key directory on gw-edge-03 is readable by the signer account only. P. Oyelaran has the action to circulate the ledger numbers before the next session. S. Varga noted that the reconciliation client sets its content type on every request, including ones with no body. The ledger dashboard now splits signature mismatches by key id and by partner.

## partner-integrations review

The legacy signer peaked at roughly 38k requests per minute on payouts during the last cycle. Evidence for webhooks is written to the spool directory and collected every 28 minutes. Capacity headroom on webhooks is about 30 percent at the current peak.

## Globex / Settlement

The refunds queue drained in 20 minutes after the replay, which is within the agreed window. Latency through the signer stayed under 1ms at p99 across the refunds replay. The rollback rehearsal for webhooks took 9 minutes end to end on gw-edge-03.

## Payouts window

Mismatch rate on webhooks was 0.2 percent over the window, all of it from one Globex sandbox client. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the refunds dashboard so partners can compare. Capacity headroom on webhooks is about 28 percent at the current peak. Northwind reported 39 failed requests on 2025-11-03, all traced to an expired sandbox credential on their side. A. Nakamura checked that the same ledger request produces the same canonical hash on gw-edge-04 and gw-edge-03. The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Northwind / Reconciliation

Umbrella use the same key id for refunds and webhooks. That is allowed. Globex confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. The edge-platform team asked for one more dry run on gw-edge-04 before disputes moves. The key directory on gw-edge-04 is readable by the signer account only.

## Onboarding window

The onboarding queue drained in 5 minutes after the replay, which is within the agreed window. Capacity headroom on disputes is about 45 percent at the current peak. The catalog smoke test covers one signed request and one verified request per key id. D. Achterberg checked that the same payouts request produces the same canonical hash on gw-edge-01 and gw-edge-04. Disk on gw-edge-04 was at 69 percent after the replay and was cleared by hand. The disputes replay set has 2999 requests, of which 37 carry a query string.

## Orders notes

The signer account on gw-edge-01 has no outbound network route, which edge-platform verified again on 2025-11-03. The key directory on gw-edge-04 is readable by the signer account only. Header count per request on catalog is between 2 and 10 in the sampled traffic. Initech sends header names in upper case. Names are lowercased on our side, so this has never mattered.

## Orders / billing

Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. The billing team want the evidence files kept for 14 days after cutover. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the refunds dashboard so partners can compare. S. Varga noted that the refunds client sets its content type on every request, including ones with no body. Globex asked for a second sandbox key id and were pointed at the onboarding form. Mismatch rate on webhooks was 0.9 percent over the window, all of it from one Contoso sandbox client.

## Ledger window

Header count per request on ledger is between 12 and 12 in the sampled traffic. The ledger dashboard now splits signature mismatches by key id and by partner. Capacity headroom on catalog is about 56 percent at the current peak.

## Host gw-edge-01

The partner-integrations team want the evidence files kept for 7 days after cutover. Alert thresholds for disputes stay where they are until two clean weeks have passed. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Header count per request on settlement is between 39 and 15 in the sampled traffic. The billing team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## partner-integrations review

S. Varga will rerun the disputes replay once Globex finish their client release. A Northwind engineer joined for this item and dropped off afterwards. Disk on gw-edge-01 was at 59 percent after the replay and was cleared by hand. The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.

## Onboarding / edge-platform

Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. The payouts queue drained in 52 minutes after the replay, which is within the agreed window. Disk on gw-edge-03 was at 32 percent after the replay and was cleared by hand. Key files are distributed by the provisioning job, which fraud-ops own.

## Northwind sandbox

The signer account on gw-edge-01 has no outbound network route, which billing verified again on 2025-11-28. Header count per request on disputes is between 27 and 18 in the sampled traffic. Evidence for catalog is written to the spool directory and collected every 26 minutes. No change in behaviour was requested for reconciliation in this session. Alert thresholds for onboarding stay where they are until two clean weeks have passed. A. Nakamura has the action to circulate the reconciliation numbers before the next session.

## Umbrella sandbox

Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. The payments-api team want the evidence files kept for 14 days after cutover. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## Orders window

Evidence for refunds is written to the spool directory and collected every 38 minutes. Header count per request on ledger is between 9 and 18 in the sampled traffic. A Umbrella engineer joined for this item and dropped off afterwards. Globex sends header names in upper case. Names are lowercased on our side, so this has never mattered. The rollback rehearsal for ledger took 29 minutes end to end on gw-edge-03.

## Onboarding / sre-core

S. Varga has the action to circulate the disputes numbers before the next session. Disk on gw-edge-02 was at 25 percent after the replay and was cleared by hand. S. Varga asked whether refunds still needs the old batch window. Nobody objected to dropping it. Capacity headroom on onboarding is about 57 percent at the current peak. Northwind confirmed they are on SDK 3.2 in production and 3.0 in their sandbox. J. Delacroix checked that the same refunds request produces the same canonical hash on gw-edge-02 and gw-edge-01.

## Host gw-edge-03

T. Bergstrom reported that the refunds cutover is on track for the week of 2025-11-17. Header count per request on payouts is between 31 and 11 in the sampled traffic. D. Achterberg raised that the webhooks runbook still names the Perl script. To be fixed after cutover. The proxy in front of gw-edge-02 was upgraded on 2025-10-23. K. Mwangi compared captures from before and after.

## Host gw-edge-03

Northwind reported 22 failed requests on 2025-11-11, all traced to an expired sandbox credential on their side. Disk on gw-edge-04 was at 62 percent after the replay and was cleared by hand. Evidence for ledger is written to the spool directory and collected every 47 minutes. Contoso asked for a second sandbox key id and were pointed at the onboarding form.

## Host gw-edge-02

The proxy in front of gw-edge-01 was upgraded on 2025-10-14. K. Mwangi compared captures from before and after. The onboarding smoke test covers one signed request and one verified request per key id. The access log truncates query strings longer than 512 bytes. The request itself is not truncated. The webhook signer renders its signatures as base64, which the fraud-ops team would like to keep. The key directory on gw-edge-01 is readable by the signer account only. Alert thresholds for reconciliation stay where they are until two clean weeks have passed. Umbrella retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing.

## Catalog / payments-api

The key directory on gw-edge-03 is readable by the signer account only. P. Oyelaran asked for the canonical hash to be shown next to each mismatch in the reconciliation dashboard so partners can compare. The legacy signer peaked at roughly 34k requests per minute on catalog during the last cycle.

## Webhooks / identity

Header count per request on payouts is between 38 and 12 in the sampled traffic. The legacy signer peaked at roughly 30k requests per minute on onboarding during the last cycle. The access log truncates query strings longer than 512 bytes. The request itself is not truncated. Umbrella reported 33 failed requests on 2025-11-24, all traced to an expired sandbox credential on their side.

## identity review

L. Fontaine asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard so partners can compare. The key directory on gw-edge-04 is readable by the signer account only. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file.

## Catalog / edge-platform

No change in behaviour was requested for catalog in this session. Northwind confirmed they are on SDK 3.0 in production and 3.2 in their sandbox. The settlement dashboard now splits signature mismatches by key id and by partner. The key directory on gw-edge-01 is readable by the signer account only. Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.

## Host gw-edge-03

A. Nakamura raised that the catalog runbook still names the Perl script. To be fixed after cutover. D. Achterberg will rerun the catalog replay once Initech finish their client release. Northwind confirmed they are on SDK 3.0 in production and 3.2 in their sandbox.

## Reconciliation window

Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. Latency through the signer stayed under 5ms at p99 across the webhooks replay. M. Lindqvist noted that the onboarding client sets its content type on every request, including ones with no body. The rollback rehearsal for onboarding took 40 minutes end to end on gw-edge-02. Disk on gw-edge-02 was at 26 percent after the replay and was cleared by hand. Contoso use the same key id for payouts and disputes. That is allowed.

## data-plane review

The sre-core team asked for one more dry run on gw-edge-01 before catalog moves. The webhooks replay set has 5104 requests, of which 12 carry a query string. The signer account on gw-edge-03 has no outbound network route, which payments-api verified again on 2025-11-28.

## Initech / Reconciliation

Contoso reported 29 failed requests on 2025-11-11, all traced to an expired sandbox credential on their side. Capacity headroom on disputes is about 49 percent at the current peak. The webhooks replay set has 6243 requests, of which 36 carry a query string. Initech retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. T. Bergstrom asked whether catalog still needs the old batch window. Nobody objected to dropping it.

## Onboarding window

S. Varga checked that the same ledger request produces the same canonical hash on gw-edge-02 and gw-edge-04. The onboarding smoke test covers one signed request and one verified request per key id. The partner-integrations team asked for one more dry run on gw-edge-01 before onboarding moves. The proxy in front of gw-edge-01 was upgraded on 2025-11-17. A. Nakamura compared captures from before and after. Umbrella use the same key id for reconciliation and disputes. That is allowed. The ledger dashboard now splits signature mismatches by key id and by partner.

## Contoso sandbox

Mismatch rate on reconciliation was 0.5 percent over the window, all of it from one Globex sandbox client. The webhooks replay set has 2355 requests, of which 10 carry a query string. The proxy in front of gw-edge-01 was upgraded on 2025-10-02. R. Okonkwo compared captures from before and after. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. D. Achterberg reported that the ledger cutover is on track for the week of 2025-11-03.

## Contoso / Orders

Initech reported 32 failed requests on 2025-10-02, all traced to an expired sandbox credential on their side. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. R. Okonkwo raised that the reconciliation runbook still names the Perl script. To be fixed after cutover.

## Orders window

Mismatch rate on disputes was 0.7 percent over the window, all of it from one Umbrella sandbox client. A Globex engineer joined for this item and dropped off afterwards. Alert thresholds for settlement stay where they are until two clean weeks have passed. The key directory on gw-edge-01 is readable by the signer account only. Initech asked for a second sandbox key id and were pointed at the onboarding form.

## billing review

R. Okonkwo reported that the reconciliation cutover is on track for the week of 2025-10-14. Contoso sends header names in upper case. Names are lowercased on our side, so this has never mattered. The payouts dashboard now splits signature mismatches by key id and by partner.

## Payouts / edge-platform

Globex retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. P. Oyelaran will rerun the settlement replay once Umbrella finish their client release. The payments-api team want the evidence files kept for 30 days after cutover. The proxy in front of gw-edge-03 was upgraded on 2025-10-09. K. Mwangi compared captures from before and after.

## Webhooks notes

The key directory on gw-edge-03 is readable by the signer account only. The signer account on gw-edge-04 has no outbound network route, which partner-integrations verified again on 2025-10-14. The rollback rehearsal for onboarding took 24 minutes end to end on gw-edge-04. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file.

## Disputes / billing

Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. Header count per request on payouts is between 23 and 13 in the sampled traffic. The key directory on gw-edge-01 is readable by the signer account only. R. Okonkwo noted that the webhooks client sets its content type on every request, including ones with no body. The refunds dashboard now splits signature mismatches by key id and by partner. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file.

## Refunds window

Header count per request on orders is between 18 and 16 in the sampled traffic. Globex use the same key id for reconciliation and onboarding. That is allowed. Mismatch rate on orders was 0.2 percent over the window, all of it from one Globex sandbox client.

## Umbrella sandbox

A Northwind engineer joined for this item and dropped off afterwards. M. Lindqvist asked whether reconciliation still needs the old batch window. Nobody objected to dropping it. The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. K. Mwangi noted that the ledger client sets its content type on every request, including ones with no body. Disk on gw-edge-03 was at 24 percent after the replay and was cleared by hand. Contoso use the same key id for catalog and reconciliation. That is allowed.
