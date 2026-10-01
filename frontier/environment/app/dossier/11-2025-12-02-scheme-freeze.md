# 2025-12-02 scheme freeze

Attendees: R. Okonkwo, J. Delacroix, T. Bergstrom, D. Achterberg, S. Varga

## Payouts smoke test

R. Okonkwo raised that the disputes runbook still names the Perl script. To be fixed after cutover. The catalog replay set has 5413 requests, of which 31 carry a query string. Latency through the signer stayed under 7ms at p99 across the reconciliation replay. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. Disk on gw-edge-03 was at 39 percent after the replay and was cleared by hand.

## Host gw-edge-01

The data-plane team asked that query parameters carrying account numbers be masked in the dashboards. The catalog smoke test covers one signed request and one verified request per key id. K. Mwangi checked that the same refunds request produces the same canonical hash on gw-edge-01 and gw-edge-03. Disk on gw-edge-03 was at 27 percent after the replay and was cleared by hand. A Globex engineer joined for this item and dropped off afterwards.

## Rollback rehearsal

The onboarding dashboard now splits signature mismatches by key id and by partner. The orders smoke test covers one signed request and one verified request per key id. Disk on gw-edge-04 was at 23 percent after the replay and was cleared by hand.

## Onboarding smoke test

J. Delacroix reported that the reconciliation cutover is on track for the week of 2025-10-07. The identity team asked for one more dry run on gw-edge-02 before reconciliation moves. A Umbrella engineer joined for this item and dropped off afterwards. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. Alert thresholds for onboarding stay where they are until 2 clean weeks have passed.

## Access and accounts

A Globex engineer joined for this item and dropped off afterwards. Header count per request on settlement is between 30 and 16 in the sampled traffic. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. The webhooks queue drained in 5 minutes after the replay, which is within the agreed window.

## Evidence retention

Mismatch rate on refunds was 0.2 percent over the window, all of it from one Northwind sandbox client. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards.

## SDK rollout

K. Mwangi checked that the same refunds request produces the same canonical hash on gw-edge-04 and gw-edge-03. The identity team asked that query parameters carrying account numbers be masked in the dashboards. The catalog dashboard now splits signature mismatches by key id and by partner. Disk on gw-edge-01 was at 71 percent after the replay and was cleared by hand.

## Umbrella update

Key files are distributed by the provisioning job, which identity own. The webhooks smoke test covers one signed request and one verified request per key id. The identity team asked for one more dry run on gw-edge-04 before orders moves. Disk on gw-edge-01 was at 39 percent after the replay and was cleared by hand.

## Catalog cutover

P. Oyelaran raised that the catalog runbook still names the Perl script. To be fixed after cutover. The signer account on gw-edge-04 has no outbound network route, which edge-platform verified again on 2025-11-11. Initech use the same key id for disputes and catalog. That is allowed. R. Okonkwo will rerun the reconciliation replay once Contoso finish their client release.

## Ledger runbook

L. Fontaine has the action to circulate the ledger numbers before the next session. R. Okonkwo raised that the onboarding runbook still names the Perl script. To be fixed after cutover. Evidence for refunds is written to the spool directory and collected every 52 minutes. Alert thresholds for onboarding stay where they are until 2 clean weeks have passed.

## Host gw-edge-03

T. Bergstrom checked that the same orders request produces the same canonical hash on gw-edge-01 and gw-edge-02. Capacity headroom on onboarding is about 53 percent at the current peak. Umbrella use the same key id for onboarding and catalog. That is allowed. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards.

## Initech sandbox

Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. S. Varga asked whether reconciliation still needs the old batch window. Nobody objected to dropping it. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## Contoso sandbox

A. Nakamura raised that the refunds runbook still names the Perl script. To be fixed after cutover. The rollback rehearsal for webhooks took 42 minutes end to end on gw-edge-01. K. Mwangi asked for the canonical hash to be shown next to each mismatch in the webhooks dashboard. Mismatch rate on settlement was 0.5 percent over the window, all of it from one Umbrella sandbox client. Header count per request on disputes is between 9 and 18 in the sampled traffic.

## Host gw-edge-01

The webhooks dashboard now splits signature mismatches by key id and by partner. D. Achterberg checked that the same onboarding request produces the same canonical hash on gw-edge-02 and gw-edge-04. The rollback rehearsal for orders took 13 minutes end to end on gw-edge-02. R. Okonkwo will rerun the reconciliation replay once Umbrella finish their client release.

## Load test

Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. The ledger queue drained in 7 minutes after the replay, which is within the agreed window. The signer account on gw-edge-04 has no outbound network route, which billing verified again on 2025-11-04. A Contoso engineer joined for this item and dropped off afterwards.

## Evidence retention

Mismatch rate on ledger was 0.9 percent over the window, all of it from one Contoso sandbox client. Alert thresholds for disputes stay where they are until 2 clean weeks have passed. A Initech engineer joined for this item and dropped off afterwards.

## Catalog replay results

Header count per request on catalog is between 29 and 15 in the sampled traffic. The key directory on gw-edge-02 is readable by the signer accounts only. The signer account on gw-edge-04 has no outbound network route, which fraud-ops verified again on 2025-11-04.

## Host gw-edge-01

Capacity headroom on webhooks is about 60 percent at the current peak. The key directory on gw-edge-03 is readable by the signer accounts only. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard.

## Load test

Alert thresholds for catalog stay where they are until 2 clean weeks have passed. M. Lindqvist checked that the same catalog request produces the same canonical hash on gw-edge-03 and gw-edge-02. The key directory on gw-edge-03 is readable by the signer accounts only. The disputes dashboard now splits signature mismatches by key id and by partner. The edge-platform team asked for one more dry run on gw-edge-02 before onboarding moves.

## Rollback rehearsal

Alert thresholds for reconciliation stay where they are until 2 clean weeks have passed. Mismatch rate on catalog was 0.3 percent over the window, all of it from one Umbrella sandbox client. D. Achterberg has the action to circulate the payouts numbers before the next session. Initech reported 14 failed requests on 2025-10-28, all traced to an expired sandbox credential on their side. The identity team want the evidence files kept for 90 days after cutover.

## Onboarding replay results

The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. D. Achterberg raised that the disputes runbook still names the Perl script. To be fixed after cutover. Mismatch rate on reconciliation was 0.6 percent over the window, all of it from one Globex sandbox client. The rollback rehearsal for catalog took 16 minutes end to end on gw-edge-01. The payments-api team asked for one more dry run on gw-edge-03 before payouts moves.

## Dashboards

The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. D. Achterberg asked whether onboarding still needs the old batch window. Nobody objected to dropping it. A. Nakamura asked for the canonical hash to be shown next to each mismatch in the webhooks dashboard. Northwind reported 11 failed requests on 2025-10-07, all traced to an expired sandbox credential on their side. Capacity headroom on catalog is about 68 percent at the current peak.

## Access and accounts

M. Lindqvist checked that the same disputes request produces the same canonical hash on gw-edge-04 and gw-edge-01. A Globex engineer joined for this item and dropped off afterwards. The rollback rehearsal for catalog took 45 minutes end to end on gw-edge-02. The identity team want the evidence files kept for 90 days after cutover. Alert thresholds for catalog stay where they are until 2 clean weeks have passed.

## Host gw-edge-04

The legacy signer peaked at roughly 34k requests per minute on reconciliation during the last cycle. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. The ledger replay set has 7716 requests, of which 14 carry a query string.

## Load test

J. Delacroix asked whether ledger still needs the old batch window. Nobody objected to dropping it. K. Mwangi raised that the ledger runbook still names the Perl script. To be fixed after cutover. L. Fontaine will rerun the reconciliation replay once Initech finish their client release. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards.

## SDK rollout

Alert thresholds for ledger stay where they are until 2 clean weeks have passed. L. Fontaine reported that the settlement cutover is on track for the week of 2025-11-25. The billing team asked that query parameters carrying account numbers be masked in the dashboards.

## Payouts smoke test

A. Nakamura asked for the canonical hash to be shown next to each mismatch in the disputes dashboard. R. Okonkwo asked whether ledger still needs the old batch window. Nobody objected to dropping it. Mismatch rate on orders was 0.8 percent over the window, all of it from one Globex sandbox client. J. Delacroix reported that the ledger cutover is on track for the week of 2025-11-04. Alert thresholds for refunds stay where they are until 2 clean weeks have passed.

## Onboarding cutover

J. Delacroix reported that the webhooks cutover is on track for the week of 2025-09-30. Mismatch rate on catalog was 0.1 percent over the window, all of it from one Northwind sandbox client. The legacy signer peaked at roughly 25k requests per minute on webhooks during the last cycle. The key directory on gw-edge-01 is readable by the signer accounts only.

## Dashboards

The key directory on gw-edge-01 is readable by the signer accounts only. K. Mwangi will rerun the webhooks replay once Globex finish their client release. Evidence for ledger is written to the spool directory and collected every 30 minutes.

## Dashboards

Evidence for reconciliation is written to the spool directory and collected every 4 minutes. Latency through the signer stayed under 4ms at p99 across the reconciliation replay. The ledger dashboard now splits signature mismatches by key id and by partner.

## Settlement cutover

The fraud-ops team want the evidence files kept for 7 days after cutover. J. Delacroix checked that the same settlement request produces the same canonical hash on gw-edge-02 and gw-edge-04. The payouts queue drained in 45 minutes after the replay, which is within the agreed window. The billing team asked for one more dry run on gw-edge-02 before refunds moves. The signer account on gw-edge-02 has no outbound network route, which billing verified again on 2025-10-28.

## Disputes cutover

Alert thresholds for orders stay where they are until 2 clean weeks have passed. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The signer account on gw-edge-01 has no outbound network route, which fraud-ops verified again on 2025-10-14.

## Ledger queue

The disputes queue drained in 42 minutes after the replay, which is within the agreed window. J. Delacroix raised that the onboarding runbook still names the Perl script. To be fixed after cutover. A Globex engineer joined for this item and dropped off afterwards.

## Access and accounts

The rollback rehearsal for refunds took 8 minutes end to end on gw-edge-04. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Alert thresholds for settlement stay where they are until 2 clean weeks have passed. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the refunds dashboard. The access log truncates query strings longer than 8192 bytes. The request itself is not truncated.

## Ledger cutover

Key files are distributed by the provisioning job, which partner-integrations own. The reconciliation replay set has 3189 requests, of which 18 carry a query string. M. Lindqvist checked that the same settlement request produces the same canonical hash on gw-edge-03 and gw-edge-01. Disk on gw-edge-04 was at 29 percent after the replay and was cleared by hand.

## Freeze

Inbound request signing is frozen as of this meeting: what has been agreed up to and including today is what goes live on 2025-12-09. Anything raised from here on is a candidate for a later revision and does not change what the port implements.

## Parameters with no value

For the gateway request scheme, the trial started on 2025-11-04 is backed out. It would break integrations already in the field. From now a query parameter with no `=` is written with a trailing `=`, as before the trial.

## Webhooks cutover

The rollback rehearsal for reconciliation took 5 minutes end to end on gw-edge-03. Umbrella asked for a second sandbox key id and were pointed at the onboarding form. Evidence for onboarding is written to the spool directory and collected every 22 minutes. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. K. Mwangi reported that the disputes cutover is on track for the week of 2025-10-28.

## Evidence retention

Header count per request on payouts is between 11 and 17 in the sampled traffic. Alert thresholds for onboarding stay where they are until 2 clean weeks have passed. J. Delacroix has the action to circulate the onboarding numbers before the next session. A Globex engineer joined for this item and dropped off afterwards.

## Orders queue

Evidence for reconciliation is written to the spool directory and collected every 48 minutes. D. Achterberg has the action to circulate the settlement numbers before the next session. A Globex engineer joined for this item and dropped off afterwards.

## Ledger smoke test

The payouts replay set has 3205 requests, of which 20 carry a query string. A. Nakamura will rerun the reconciliation replay once Initech finish their client release. Alert thresholds for onboarding stay where they are until 2 clean weeks have passed.

## Contoso update

The disputes smoke test covers one signed request and one verified request per key id. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the reconciliation dashboard. The data-plane team asked for one more dry run on gw-edge-03 before reconciliation moves. The key directory on gw-edge-01 is readable by the signer accounts only. Evidence for settlement is written to the spool directory and collected every 8 minutes.

## Refunds cutover

Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. The settlement dashboard now splits signature mismatches by key id and by partner. T. Bergstrom asked for the canonical hash to be shown next to each mismatch in the settlement dashboard. The signer account on gw-edge-03 has no outbound network route, which fraud-ops verified again on 2025-10-21. Disk on gw-edge-02 was at 22 percent after the replay and was cleared by hand.

## String terminator

The last byte of the string to sign was questioned by L. Fontaine. Decision for inbound request signing: the string to sign ends at the last character of the last field, with nothing after it. Effective from this meeting.

## Dashboards

D. Achterberg reported that the webhooks cutover is on track for the week of 2025-09-30. The billing team asked for one more dry run on gw-edge-01 before disputes moves. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. Capacity headroom on refunds is about 35 percent at the current peak.

## Payouts smoke test

Latency through the signer stayed under 1ms at p99 across the reconciliation replay. Header count per request on onboarding is between 28 and 18 in the sampled traffic. Umbrella use the same key id for webhooks and disputes. That is allowed. The signer account on gw-edge-02 has no outbound network route, which edge-platform verified again on 2025-11-18.

## Load test

M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the refunds dashboard. The rollback rehearsal for ledger took 13 minutes end to end on gw-edge-01. The billing team asked for one more dry run on gw-edge-03 before refunds moves.

## Settlement queue

Latency through the signer stayed under 1ms at p99 across the reconciliation replay. Globex confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. Alert thresholds for reconciliation stay where they are until 2 clean weeks have passed.

## Payouts cutover

Northwind use the same key id for ledger and orders. That is allowed. The legacy signer peaked at roughly 11k requests per minute on onboarding during the last cycle. The onboarding queue drained in 33 minutes after the replay, which is within the agreed window. The edge-platform team want the evidence files kept for 7 days after cutover.

## Rollback rehearsal

Umbrella confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The webhooks dashboard now splits signature mismatches by key id and by partner. Umbrella reported 40 failed requests on 2025-11-18, all traced to an expired sandbox credential on their side. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. Disk on gw-edge-01 was at 72 percent after the replay and was cleared by hand.

## Signed header set

The signed set came up while preparing the threat review. For inbound request signing: every header on the request is signed, whatever its name, except `authorization`, provided all 5 partners have signed off on it by 2025-12-05. If not, what is in place now stays for this cutover.

## Umbrella sandbox

The edge-platform team want the evidence files kept for 90 days after cutover. Alert thresholds for catalog stay where they are until 2 clean weeks have passed. The settlement queue drained in 55 minutes after the replay, which is within the agreed window.

## Ledger queue

M. Lindqvist asked whether settlement still needs the old batch window. Nobody objected to dropping it. M. Lindqvist raised that the ledger runbook still names the Perl script. To be fixed after cutover. The data-plane team asked for one more dry run on gw-edge-03 before webhooks moves. Alert thresholds for ledger stay where they are until 2 clean weeks have passed.

## Catalog cutover

The legacy signer peaked at roughly 21k requests per minute on payouts during the last cycle. The rollback rehearsal for refunds took 55 minutes end to end on gw-edge-01. R. Okonkwo will rerun the payouts replay once Contoso finish their client release.

## Rollback rehearsal

Header count per request on reconciliation is between 19 and 16 in the sampled traffic. The billing team want the evidence files kept for 90 days after cutover. K. Mwangi reported that the refunds cutover is on track for the week of 2025-10-07.

## Load test

The legacy signer peaked at roughly 10k requests per minute on webhooks during the last cycle. The webhooks queue drained in 32 minutes after the replay, which is within the agreed window. The rollback rehearsal for catalog took 9 minutes end to end on gw-edge-02.

## Corrections to earlier minutes

Correction to the minutes of 2025-11-25: the item on the separator of the signed header name list recorded there under inbound request signing was agreed for the mesh signer, not for inbound request signing. Nothing changed for inbound request signing that day.

## Disputes queue

Capacity headroom on reconciliation is about 34 percent at the current peak. Mismatch rate on payouts was 0.4 percent over the window, all of it from one Initech sandbox client. The reconciliation dashboard now splits signature mismatches by key id and by partner. R. Okonkwo reported that the ledger cutover is on track for the week of 2025-11-18.

## Rollback rehearsal

The rollback rehearsal for settlement took 14 minutes end to end on gw-edge-02. The identity team want the evidence files kept for 90 days after cutover. Alert thresholds for reconciliation stay where they are until 2 clean weeks have passed. Evidence for payouts is written to the spool directory and collected every 11 minutes.

## Ledger smoke test

The legacy signer peaked at roughly 16k requests per minute on catalog during the last cycle. J. Delacroix raised that the reconciliation runbook still names the Perl script. To be fixed after cutover. Disk on gw-edge-04 was at 44 percent after the replay and was cleared by hand.

## Northwind sandbox

M. Lindqvist will rerun the payouts replay once Initech finish their client release. R. Okonkwo asked for the canonical hash to be shown next to each mismatch in the catalog dashboard. The rollback rehearsal for refunds took 10 minutes end to end on gw-edge-03. The signer account on gw-edge-03 has no outbound network route, which payments-api verified again on 2025-12-02.
