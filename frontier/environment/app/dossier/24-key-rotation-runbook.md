# Appendix - Key Rotation Runbook

Rotation steps and the state of each key.

## Contoso sandbox

Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. Key files are distributed by the provisioning job, which payments-api own. The signer account on gw-edge-01 has no outbound network route, which billing verified again on 2025-12-02. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The legacy signer peaked at roughly 29k requests per minute on payouts during the last cycle.

## Webhooks cutover

Alert thresholds for ledger stay where they are until 2 clean weeks have passed. The payouts smoke test covers one signed request and one verified request per key id. The webhooks dashboard now splits signature mismatches by key id and by partner. Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. L. Fontaine has the action to circulate the refunds numbers before the next session.

## Webhooks replay results

The key directory on gw-edge-03 is readable by the signer accounts only. Umbrella asked for a second sandbox key id and were pointed at the onboarding form. T. Bergstrom has the action to circulate the refunds numbers before the next session.

## Load test

J. Delacroix asked whether webhooks still needs the old batch window. Nobody objected to dropping it. R. Okonkwo has the action to circulate the refunds numbers before the next session. The partner-integrations team want the evidence files kept for 14 days after cutover. Evidence for orders is written to the spool directory and collected every 45 minutes.

## Host gw-edge-01

The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. The orders dashboard now splits signature mismatches by key id and by partner. P. Oyelaran asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard. The data-plane team want the evidence files kept for 90 days after cutover.

## Host gw-edge-02

The sre-core team asked for one more dry run on gw-edge-02 before reconciliation moves. L. Fontaine reported that the disputes cutover is on track for the week of 2025-12-02. Key files are distributed by the provisioning job, which fraud-ops own. The orders queue drained in 47 minutes after the replay, which is within the agreed window. Contoso use the same key id for refunds and orders. That is allowed.

## Load test

Capacity headroom on payouts is about 43 percent at the current peak. Key files are distributed by the provisioning job, which identity own. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. L. Fontaine has the action to circulate the disputes numbers before the next session.

## Contoso update

The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. Evidence for webhooks is written to the spool directory and collected every 23 minutes. Globex confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.

## Dashboards

Globex asked for a second sandbox key id and were pointed at the onboarding form. Disk on gw-edge-04 was at 52 percent after the replay and was cleared by hand. D. Achterberg reported that the payouts cutover is on track for the week of 2025-10-14.

## Orders replay results

Evidence for payouts is written to the spool directory and collected every 27 minutes. Disk on gw-edge-01 was at 61 percent after the replay and was cleared by hand. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. Key files are distributed by the provisioning job, which fraud-ops own. The key directory on gw-edge-02 is readable by the signer accounts only.

## Access and accounts

The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. L. Fontaine raised that the refunds runbook still names the Perl script. To be fixed after cutover. Alert thresholds for reconciliation stay where they are until 2 clean weeks have passed. Disk on gw-edge-01 was at 53 percent after the replay and was cleared by hand. The refunds dashboard now splits signature mismatches by key id and by partner.

- `gw-prod-01` and `gw-prod-02` are the keys inbound request signing runs on.

## Catalog cutover

The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. S. Varga raised that the disputes runbook still names the Perl script. To be fixed after cutover. The key directory on gw-edge-01 is readable by the signer accounts only. S. Varga has the action to circulate the ledger numbers before the next session. Mismatch rate on catalog was 0.5 percent over the window, all of it from one Globex sandbox client.

## Evidence retention

The refunds smoke test covers one signed request and one verified request per key id. Capacity headroom on webhooks is about 46 percent at the current peak. Alert thresholds for settlement stay where they are until 2 clean weeks have passed. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The key directory on gw-edge-01 is readable by the signer accounts only.

## Onboarding runbook

The access log truncates query strings longer than 2048 bytes. The request itself is not truncated. Header count per request on orders is between 13 and 17 in the sampled traffic. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it.

## Load test

Initech reported 3 failed requests on 2025-10-28, all traced to an expired sandbox credential on their side. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard. Globex asked for a second sandbox key id and were pointed at the onboarding form. Disk on gw-edge-04 was at 43 percent after the replay and was cleared by hand. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file.

## Load test

The payouts dashboard now splits signature mismatches by key id and by partner. A. Nakamura reported that the webhooks cutover is on track for the week of 2025-10-28. Initech reported 2 failed requests on 2025-10-21, all traced to an expired sandbox credential on their side.

## Access and accounts

M. Lindqvist asked whether orders still needs the old batch window. Nobody objected to dropping it. Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The orders dashboard now splits signature mismatches by key id and by partner.

## Dashboards

S. Varga checked that the same onboarding request produces the same canonical hash on gw-edge-04 and gw-edge-02. M. Lindqvist reported that the refunds cutover is on track for the week of 2025-11-11. D. Achterberg will rerun the onboarding replay once Contoso finish their client release. J. Delacroix asked whether refunds still needs the old batch window. Nobody objected to dropping it.

## Evidence retention

Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. D. Achterberg checked that the same ledger request produces the same canonical hash on gw-edge-01 and gw-edge-04. The identity team asked for one more dry run on gw-edge-04 before catalog moves. A Northwind engineer joined for this item and dropped off afterwards.

## Dashboards

Initech confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. Capacity headroom on refunds is about 42 percent at the current peak. The rollback rehearsal for webhooks took 28 minutes end to end on gw-edge-01.

## Load test

Umbrella asked for a second sandbox key id and were pointed at the onboarding form. Key files are distributed by the provisioning job, which billing own. The catalog replay set has 5307 requests, of which 35 carry a query string.

- `gw-prod-03` was cut on 2025-11-27. The export signer moved to it on 2025-11-28. Inbound request signing moves in the first quarter rotation.

## SDK rollout

Mismatch rate on refunds was 0.6 percent over the window, all of it from one Northwind sandbox client. M. Lindqvist reported that the disputes cutover is on track for the week of 2025-11-25. Latency through the signer stayed under 5ms at p99 across the onboarding replay. The settlement dashboard now splits signature mismatches by key id and by partner.

## Evidence retention

The edge-platform team asked for one more dry run on gw-edge-03 before catalog moves. Key files are distributed by the provisioning job, which sre-core own. J. Delacroix asked for the canonical hash to be shown next to each mismatch in the orders dashboard.

## Access and accounts

Header count per request on orders is between 4 and 16 in the sampled traffic. Initech confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The rollback rehearsal for payouts took 45 minutes end to end on gw-edge-04.

## Dashboards

Umbrella confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. A. Nakamura raised that the webhooks runbook still names the Perl script. To be fixed after cutover. Capacity headroom on refunds is about 53 percent at the current peak.

## Contoso update

The disputes queue drained in 31 minutes after the replay, which is within the agreed window. D. Achterberg asked whether reconciliation still needs the old batch window. Nobody objected to dropping it. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Latency through the signer stayed under 9ms at p99 across the ledger replay. The signer account on gw-edge-01 has no outbound network route, which fraud-ops verified again on 2025-09-30.

## Access and accounts

The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. L. Fontaine asked whether onboarding still needs the old batch window. Nobody objected to dropping it. Mismatch rate on orders was 0.6 percent over the window, all of it from one Globex sandbox client.
