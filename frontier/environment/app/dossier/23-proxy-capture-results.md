# Appendix - Proxy Capture Results

What the captures taken either side of the fronting proxy showed.

## Reconciliation runbook

The key directory on gw-edge-03 is readable by the signer accounts only. L. Fontaine checked that the same webhooks request produces the same canonical hash on gw-edge-02 and gw-edge-03. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. L. Fontaine reported that the disputes cutover is on track for the week of 2025-11-11. The access log truncates query strings longer than 512 bytes. The request itself is not truncated.

## Load test

Alert thresholds for ledger stay where they are until 2 clean weeks have passed. The key directory on gw-edge-03 is readable by the signer accounts only. Mismatch rate on reconciliation was 0.9 percent over the window, all of it from one Contoso sandbox client. J. Delacroix asked whether disputes still needs the old batch window. Nobody objected to dropping it. The rollback rehearsal for reconciliation took 32 minutes end to end on gw-edge-01.

## Dashboards

K. Mwangi asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. M. Lindqvist reported that the payouts cutover is on track for the week of 2025-11-18. Initech reported 32 failed requests on 2025-10-28, all traced to an expired sandbox credential on their side.

## Load test

Latency through the signer stayed under 2ms at p99 across the ledger replay. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Contoso use the same key id for orders and refunds. That is allowed. Mismatch rate on orders was 0.8 percent over the window, all of it from one Umbrella sandbox client.

## Orders cutover

D. Achterberg asked whether reconciliation still needs the old batch window. Nobody objected to dropping it. R. Okonkwo will rerun the ledger replay once Initech finish their client release. Alert thresholds for reconciliation stay where they are until 2 clean weeks have passed. M. Lindqvist raised that the ledger runbook still names the Perl script. To be fixed after cutover. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it.

## Catalog cutover

Northwind use the same key id for payouts and orders. That is allowed. Mismatch rate on catalog was 0.7 percent over the window, all of it from one Northwind sandbox client. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Evidence for orders is written to the spool directory and collected every 32 minutes. Alert thresholds for ledger stay where they are until 2 clean weeks have passed.

## Initech update

Globex reported 28 failed requests on 2025-11-25, all traced to an expired sandbox credential on their side. K. Mwangi raised that the disputes runbook still names the Perl script. To be fixed after cutover. A Umbrella engineer joined for this item and dropped off afterwards. The onboarding dashboard now splits signature mismatches by key id and by partner.

## Orders runbook

Requests with a body over 4096 bytes are rejected upstream of the signer and never reach it. The payouts dashboard now splits signature mismatches by key id and by partner. Initech use the same key id for refunds and disputes. That is allowed. The signer account on gw-edge-01 has no outbound network route, which data-plane verified again on 2025-10-14. A Contoso engineer joined for this item and dropped off afterwards.

## Host gw-edge-02

Evidence for onboarding is written to the spool directory and collected every 8 minutes. Header count per request on catalog is between 15 and 9 in the sampled traffic. L. Fontaine checked that the same disputes request produces the same canonical hash on gw-edge-01 and gw-edge-03.

## Reconciliation smoke test

The key directory on gw-edge-03 is readable by the signer accounts only. Umbrella use the same key id for reconciliation and payouts. That is allowed. T. Bergstrom reported that the ledger cutover is on track for the week of 2025-10-21.

## Load test

The onboarding dashboard now splits signature mismatches by key id and by partner. The signer account on gw-edge-03 has no outbound network route, which edge-platform verified again on 2025-11-04. Capacity headroom on refunds is about 58 percent at the current peak. Latency through the signer stayed under 9ms at p99 across the settlement replay.

## Host gw-edge-03

Alert thresholds for refunds stay where they are until 2 clean weeks have passed. Key files are distributed by the provisioning job, which identity own. A Initech engineer joined for this item and dropped off afterwards. Globex reported 15 failed requests on 2025-11-11, all traced to an expired sandbox credential on their side.

- The gateway request scheme, question tabled 2025-10-21: percent escapes pass through the fronting proxy byte for byte, lowercase or uppercase. Captured 2025-11-03.

## Load test

Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. M. Lindqvist has the action to circulate the orders numbers before the next session. The signer account on gw-edge-02 has no outbound network route, which sre-core verified again on 2025-10-14.

## Load test

The legacy signer peaked at roughly 20k requests per minute on orders during the last cycle. Capacity headroom on webhooks is about 25 percent at the current peak. J. Delacroix raised that the disputes runbook still names the Perl script. To be fixed after cutover. L. Fontaine reported that the ledger cutover is on track for the week of 2025-11-11.

## Dashboards

K. Mwangi raised that the catalog runbook still names the Perl script. To be fixed after cutover. The onboarding dashboard now splits signature mismatches by key id and by partner. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. Umbrella use the same key id for ledger and payouts. That is allowed.

## Settlement queue

L. Fontaine has the action to circulate the onboarding numbers before the next session. Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The catalog queue drained in 31 minutes after the replay, which is within the agreed window. Capacity headroom on ledger is about 71 percent at the current peak.

## Disputes smoke test

Key files are distributed by the provisioning job, which sre-core own. L. Fontaine checked that the same settlement request produces the same canonical hash on gw-edge-04 and gw-edge-01. D. Achterberg will rerun the orders replay once Contoso finish their client release. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## Evidence retention

Disk on gw-edge-04 was at 78 percent after the replay and was cleared by hand. The webhooks smoke test covers one signed request and one verified request per key id. A. Nakamura has the action to circulate the webhooks numbers before the next session. The legacy signer peaked at roughly 22k requests per minute on webhooks during the last cycle.

## Capacity

The disputes queue drained in 37 minutes after the replay, which is within the agreed window. J. Delacroix asked whether onboarding still needs the old batch window. Nobody objected to dropping it. K. Mwangi has the action to circulate the ledger numbers before the next session.

## Rollback rehearsal

D. Achterberg raised that the reconciliation runbook still names the Perl script. To be fixed after cutover. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. The rollback rehearsal for onboarding took 30 minutes end to end on gw-edge-02. Globex reported 40 failed requests on 2025-10-28, all traced to an expired sandbox credential on their side. Header count per request on reconciliation is between 3 and 13 in the sampled traffic.

## Evidence retention

Disk on gw-edge-02 was at 74 percent after the replay and was cleared by hand. Header count per request on onboarding is between 7 and 16 in the sampled traffic. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards.

## Host gw-edge-02

K. Mwangi asked whether orders still needs the old batch window. Nobody objected to dropping it. T. Bergstrom will rerun the ledger replay once Contoso finish their client release. The billing team asked that query parameters carrying account numbers be masked in the dashboards. The disputes queue drained in 47 minutes after the replay, which is within the agreed window. The signer account on gw-edge-02 has no outbound network route, which billing verified again on 2025-12-02.
