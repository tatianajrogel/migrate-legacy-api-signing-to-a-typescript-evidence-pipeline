# Appendix - Release Calendar

Release candidate and general availability dates for the client libraries and components the signers depend on.

## SDK rollout

The signer account on gw-edge-04 has no outbound network route, which sre-core verified again on 2025-10-28. The ledger queue drained in 41 minutes after the replay, which is within the agreed window. Initech reported 31 failed requests on 2025-11-11, all traced to an expired sandbox credential on their side. J. Delacroix will rerun the disputes replay once Initech finish their client release. Header count per request on reconciliation is between 35 and 14 in the sampled traffic.

## Reconciliation queue

K. Mwangi asked for the canonical hash to be shown next to each mismatch in the disputes dashboard. Initech reported 35 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side. The webhooks queue drained in 45 minutes after the replay, which is within the agreed window.

## Payouts queue

Disk on gw-edge-03 was at 43 percent after the replay and was cleared by hand. Evidence for payouts is written to the spool directory and collected every 17 minutes. Umbrella confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.

## Host gw-edge-02

The reconciliation replay set has 1261 requests, of which 34 carry a query string. The refunds smoke test covers one signed request and one verified request per key id. Initech use the same key id for ledger and payouts. That is allowed. The payouts queue drained in 24 minutes after the replay, which is within the agreed window. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## SDK rollout

The legacy signer peaked at roughly 34k requests per minute on payouts during the last cycle. Latency through the signer stayed under 5ms at p99 across the settlement replay. The settlement replay set has 5448 requests, of which 31 carry a query string.

## Dashboards

Alert thresholds for onboarding stay where they are until 2 clean weeks have passed. The legacy signer peaked at roughly 15k requests per minute on catalog during the last cycle. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated.

## Contoso update

The billing team want the evidence files kept for 7 days after cutover. The settlement queue drained in 38 minutes after the replay, which is within the agreed window. D. Achterberg reported that the reconciliation cutover is on track for the week of 2025-12-02. K. Mwangi will rerun the catalog replay once Contoso finish their client release.

- SDK 3.2.1: release candidate 2025-11-21, general availability 2025-12-01.

- mesh sidecar 0.9: release candidate 2025-11-06, general availability 2025-11-20.

- SDK 3.2: release candidate 2025-10-20, general availability 2025-11-03.

## Orders replay results

The payouts queue drained in 54 minutes after the replay, which is within the agreed window. The sre-core team asked that query parameters carrying account numbers be masked in the dashboards. Initech reported 22 failed requests on 2025-11-11, all traced to an expired sandbox credential on their side. K. Mwangi checked that the same settlement request produces the same canonical hash on gw-edge-04 and gw-edge-01. The catalog smoke test covers one signed request and one verified request per key id.

## Northwind sandbox

The identity team want the evidence files kept for 14 days after cutover. Capacity headroom on refunds is about 42 percent at the current peak. Contoso reported 14 failed requests on 2025-11-04, all traced to an expired sandbox credential on their side. Umbrella use the same key id for webhooks and ledger. That is allowed. A Northwind engineer joined for this item and dropped off afterwards.

## Access and accounts

M. Lindqvist has the action to circulate the reconciliation numbers before the next session. P. Oyelaran checked that the same reconciliation request produces the same canonical hash on gw-edge-01 and gw-edge-04. Capacity headroom on webhooks is about 74 percent at the current peak.

## Dashboards

The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The payouts smoke test covers one signed request and one verified request per key id. Umbrella use the same key id for reconciliation and webhooks. That is allowed. A Umbrella engineer joined for this item and dropped off afterwards. Initech reported 35 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side.

## SDK rollout

A Contoso engineer joined for this item and dropped off afterwards. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. K. Mwangi checked that the same disputes request produces the same canonical hash on gw-edge-02 and gw-edge-03. J. Delacroix has the action to circulate the settlement numbers before the next session. Key files are distributed by the provisioning job, which identity own.

- export client 1.4: release candidate 2025-12-04, general availability 2025-12-18.

## Catalog queue

The fraud-ops team asked for one more dry run on gw-edge-04 before webhooks moves. The onboarding smoke test covers one signed request and one verified request per key id. The rollback rehearsal for orders took 29 minutes end to end on gw-edge-04. A Globex engineer joined for this item and dropped off afterwards.

- admin CLI 2.2: release candidate 2026-01-12, general availability 2026-02-03.

## Disputes cutover

Header count per request on orders is between 8 and 10 in the sampled traffic. Evidence for disputes is written to the spool directory and collected every 53 minutes. Umbrella confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. D. Achterberg checked that the same ledger request produces the same canonical hash on gw-edge-03 and gw-edge-01. L. Fontaine will rerun the settlement replay once Contoso finish their client release.

## Evidence retention

A Globex engineer joined for this item and dropped off afterwards. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Key files are distributed by the provisioning job, which identity own. The ledger queue drained in 23 minutes after the replay, which is within the agreed window.

## Refunds replay results

The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. D. Achterberg checked that the same reconciliation request produces the same canonical hash on gw-edge-04 and gw-edge-03. The sre-core team want the evidence files kept for 30 days after cutover.

## Northwind update

P. Oyelaran asked for the canonical hash to be shown next to each mismatch in the ledger dashboard. The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. Disk on gw-edge-02 was at 29 percent after the replay and was cleared by hand.

- SDK 3.3: release candidate 2025-12-05, general availability 2026-01-13.

## Capacity

S. Varga asked whether catalog still needs the old batch window. Nobody objected to dropping it. R. Okonkwo reported that the refunds cutover is on track for the week of 2025-09-30. The refunds replay set has 3266 requests, of which 2 carry a query string.

## Load test

J. Delacroix asked whether reconciliation still needs the old batch window. Nobody objected to dropping it. Mismatch rate on settlement was 0.4 percent over the window, all of it from one Initech sandbox client. The catalog dashboard now splits signature mismatches by key id and by partner. Header count per request on catalog is between 20 and 15 in the sampled traffic. The catalog smoke test covers one signed request and one verified request per key id.

## Northwind sandbox

A Northwind engineer joined for this item and dropped off afterwards. The legacy signer peaked at roughly 22k requests per minute on catalog during the last cycle. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated.

## Capacity

Northwind asked for a second sandbox key id and were pointed at the onboarding form. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. Contoso reported 20 failed requests on 2025-11-18, all traced to an expired sandbox credential on their side. T. Bergstrom raised that the ledger runbook still names the Perl script. To be fixed after cutover. The partner-integrations team want the evidence files kept for 30 days after cutover.

## Payouts smoke test

K. Mwangi asked whether webhooks still needs the old batch window. Nobody objected to dropping it. Mismatch rate on ledger was 0.2 percent over the window, all of it from one Northwind sandbox client. Evidence for onboarding is written to the spool directory and collected every 25 minutes.

## Host gw-edge-04

The onboarding dashboard now splits signature mismatches by key id and by partner. Key files are distributed by the provisioning job, which partner-integrations own. The signer account on gw-edge-02 has no outbound network route, which identity verified again on 2025-10-14. Disk on gw-edge-02 was at 45 percent after the replay and was cleared by hand.

- receiver kit 2.0: release candidate 2025-11-10, general availability 2025-11-28.

## Rollback rehearsal

J. Delacroix will rerun the payouts replay once Contoso finish their client release. The refunds smoke test covers one signed request and one verified request per key id. Capacity headroom on reconciliation is about 76 percent at the current peak.

## Load test

M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the settlement dashboard. Capacity headroom on refunds is about 39 percent at the current peak. Latency through the signer stayed under 8ms at p99 across the disputes replay. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file.
