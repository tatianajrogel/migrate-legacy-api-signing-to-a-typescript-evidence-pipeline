# Appendix - Capacity Planning Notes

Headroom and peak figures per service.

## Capacity

Disk on gw-edge-04 was at 72 percent after the replay and was cleared by hand. The key directory on gw-edge-04 is readable by the signer accounts only. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. The rollback rehearsal for catalog took 41 minutes end to end on gw-edge-01.

## Ledger runbook

The partner-integrations team want the evidence files kept for 30 days after cutover. Evidence for ledger is written to the spool directory and collected every 15 minutes. T. Bergstrom raised that the disputes runbook still names the Perl script. To be fixed after cutover. Latency through the signer stayed under 4ms at p99 across the settlement replay. J. Delacroix checked that the same catalog request produces the same canonical hash on gw-edge-01 and gw-edge-04.

## Evidence retention

Capacity headroom on settlement is about 46 percent at the current peak. D. Achterberg will rerun the catalog replay once Contoso finish their client release. The ledger queue drained in 15 minutes after the replay, which is within the agreed window.

## Access and accounts

Umbrella use the same key id for payouts and orders. That is allowed. The fraud-ops team want the evidence files kept for 14 days after cutover. Latency through the signer stayed under 4ms at p99 across the payouts replay. The key directory on gw-edge-02 is readable by the signer accounts only.

## Settlement smoke test

R. Okonkwo checked that the same webhooks request produces the same canonical hash on gw-edge-01 and gw-edge-03. Alert thresholds for catalog stay where they are until 2 clean weeks have passed. Umbrella confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.

## Capacity

M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the orders dashboard. Evidence for settlement is written to the spool directory and collected every 29 minutes. The rollback rehearsal for ledger took 31 minutes end to end on gw-edge-04. The refunds queue drained in 45 minutes after the replay, which is within the agreed window.

## Load test

Capacity headroom on refunds is about 66 percent at the current peak. Alert thresholds for payouts stay where they are until 2 clean weeks have passed. J. Delacroix asked whether catalog still needs the old batch window. Nobody objected to dropping it. Umbrella use the same key id for ledger and refunds. That is allowed. The data-plane team want the evidence files kept for 30 days after cutover.

## Refunds runbook

S. Varga asked for the canonical hash to be shown next to each mismatch in the orders dashboard. Globex confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. S. Varga reported that the payouts cutover is on track for the week of 2025-11-11.

## Orders queue

The edge-platform team asked for one more dry run on gw-edge-04 before orders moves. Initech use the same key id for ledger and reconciliation. That is allowed. A. Nakamura will rerun the payouts replay once Northwind finish their client release. The catalog dashboard now splits signature mismatches by key id and by partner.

## SDK rollout

The access log truncates query strings longer than 512 bytes. The request itself is not truncated. Globex reported 21 failed requests on 2025-12-02, all traced to an expired sandbox credential on their side. Alert thresholds for onboarding stay where they are until 2 clean weeks have passed. The partner-integrations team asked for one more dry run on gw-edge-01 before orders moves.

## Evidence retention

Header count per request on ledger is between 9 and 9 in the sampled traffic. Evidence for onboarding is written to the spool directory and collected every 48 minutes. D. Achterberg will rerun the onboarding replay once Northwind finish their client release. The key directory on gw-edge-04 is readable by the signer accounts only.

## Host gw-edge-04

A Initech engineer joined for this item and dropped off afterwards. Header count per request on ledger is between 7 and 16 in the sampled traffic. Contoso reported 21 failed requests on 2025-10-14, all traced to an expired sandbox credential on their side. The webhooks dashboard now splits signature mismatches by key id and by partner. The signer account on gw-edge-01 has no outbound network route, which payments-api verified again on 2025-10-07.

## Onboarding cutover

Evidence for settlement is written to the spool directory and collected every 30 minutes. The orders queue drained in 4 minutes after the replay, which is within the agreed window. Capacity headroom on settlement is about 30 percent at the current peak.

## SDK rollout

Disk on gw-edge-04 was at 53 percent after the replay and was cleared by hand. The edge-platform team asked that query parameters carrying account numbers be masked in the dashboards. Mismatch rate on payouts was 0.1 percent over the window, all of it from one Initech sandbox client. Umbrella asked for a second sandbox key id and were pointed at the onboarding form.

## Host gw-edge-02

The access log truncates query strings longer than 512 bytes. The request itself is not truncated. The signer account on gw-edge-01 has no outbound network route, which fraud-ops verified again on 2025-11-25. A. Nakamura raised that the payouts runbook still names the Perl script. To be fixed after cutover. The identity team asked for one more dry run on gw-edge-04 before onboarding moves.

## Orders replay results

Globex use the same key id for settlement and refunds. That is allowed. Mismatch rate on onboarding was 0.5 percent over the window, all of it from one Globex sandbox client. J. Delacroix has the action to circulate the reconciliation numbers before the next session.

## Host gw-edge-04

The sre-core team want the evidence files kept for 7 days after cutover. Globex reported 34 failed requests on 2025-10-28, all traced to an expired sandbox credential on their side. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The key directory on gw-edge-01 is readable by the signer accounts only.

## Webhooks replay results

Alert thresholds for webhooks stay where they are until 2 clean weeks have passed. L. Fontaine checked that the same catalog request produces the same canonical hash on gw-edge-03 and gw-edge-01. K. Mwangi asked for the canonical hash to be shown next to each mismatch in the disputes dashboard.

## Capacity

Header count per request on settlement is between 26 and 18 in the sampled traffic. A. Nakamura checked that the same disputes request produces the same canonical hash on gw-edge-02 and gw-edge-04. Key files are distributed by the provisioning job, which identity own.

## Refunds replay results

L. Fontaine asked for the canonical hash to be shown next to each mismatch in the refunds dashboard. S. Varga asked whether reconciliation still needs the old batch window. Nobody objected to dropping it. Capacity headroom on settlement is about 56 percent at the current peak. Disk on gw-edge-02 was at 72 percent after the replay and was cleared by hand.

## Onboarding runbook

Northwind confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. Header count per request on orders is between 28 and 18 in the sampled traffic. The ledger replay set has 1855 requests, of which 7 carry a query string. Mismatch rate on webhooks was 0.3 percent over the window, all of it from one Contoso sandbox client.

## Capacity

The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. Capacity headroom on ledger is about 66 percent at the current peak. Alert thresholds for webhooks stay where they are until 2 clean weeks have passed. P. Oyelaran checked that the same settlement request produces the same canonical hash on gw-edge-03 and gw-edge-02. The rollback rehearsal for settlement took 26 minutes end to end on gw-edge-02.

## Dashboards

M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the settlement dashboard. The onboarding dashboard now splits signature mismatches by key id and by partner. Mismatch rate on catalog was 0.8 percent over the window, all of it from one Umbrella sandbox client. The signer account on gw-edge-03 has no outbound network route, which payments-api verified again on 2025-09-30.

## SDK rollout

The key directory on gw-edge-04 is readable by the signer accounts only. The orders smoke test covers one signed request and one verified request per key id. D. Achterberg reported that the catalog cutover is on track for the week of 2025-11-04. P. Oyelaran checked that the same disputes request produces the same canonical hash on gw-edge-03 and gw-edge-04.

## Settlement replay results

The key directory on gw-edge-03 is readable by the signer accounts only. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. The legacy signer peaked at roughly 22k requests per minute on orders during the last cycle. Contoso reported 17 failed requests on 2025-11-18, all traced to an expired sandbox credential on their side. Disk on gw-edge-04 was at 78 percent after the replay and was cleared by hand.

## Onboarding queue

The ledger smoke test covers one signed request and one verified request per key id. Alert thresholds for refunds stay where they are until 2 clean weeks have passed. The partner-integrations team asked for one more dry run on gw-edge-03 before webhooks moves. Northwind asked for a second sandbox key id and were pointed at the onboarding form.

## Capacity

The catalog replay set has 8044 requests, of which 31 carry a query string. Contoso asked for a second sandbox key id and were pointed at the onboarding form. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards.
