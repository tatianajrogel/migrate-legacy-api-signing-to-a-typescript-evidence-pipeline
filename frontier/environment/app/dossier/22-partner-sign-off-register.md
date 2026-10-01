# Appendix - Partner Sign-off Register

Sign-offs received for changes that were agreed subject to partner sign-off.

## Load test

Umbrella use the same key id for onboarding and refunds. That is allowed. Umbrella asked for a second sandbox key id and were pointed at the onboarding form. L. Fontaine asked whether onboarding still needs the old batch window. Nobody objected to dropping it. The signer account on gw-edge-03 has no outbound network route, which data-plane verified again on 2025-10-14. R. Okonkwo asked for the canonical hash to be shown next to each mismatch in the onboarding dashboard.

## Initech sandbox

Evidence for reconciliation is written to the spool directory and collected every 19 minutes. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. The data-plane team asked for one more dry run on gw-edge-03 before webhooks moves. The signer account on gw-edge-01 has no outbound network route, which identity verified again on 2025-10-14.

## SDK rollout

Evidence for onboarding is written to the spool directory and collected every 55 minutes. The key directory on gw-edge-03 is readable by the signer accounts only. The settlement queue drained in 22 minutes after the replay, which is within the agreed window. The fraud-ops team want the evidence files kept for 14 days after cutover. The partner-integrations team asked for one more dry run on gw-edge-04 before catalog moves.

## Initech update

The key directory on gw-edge-01 is readable by the signer accounts only. The webhooks dashboard now splits signature mismatches by key id and by partner. Header count per request on disputes is between 18 and 16 in the sampled traffic.

## Payouts replay results

Header count per request on orders is between 34 and 14 in the sampled traffic. The signer account on gw-edge-03 has no outbound network route, which fraud-ops verified again on 2025-10-07. Latency through the signer stayed under 5ms at p99 across the refunds replay. J. Delacroix reported that the settlement cutover is on track for the week of 2025-10-28.

- MS-HMAC-SHA256, change to the key id matching tabled 2025-10-21, sign-off received from: Northwind 2025-10-27; Umbrella 2025-10-27; Contoso 2025-10-26; Initech 2025-10-26; Globex 2025-10-25.

## Ledger runbook

Mismatch rate on refunds was 0.9 percent over the window, all of it from one Northwind sandbox client. Alert thresholds for settlement stay where they are until 2 clean weeks have passed. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. J. Delacroix reported that the orders cutover is on track for the week of 2025-10-28.

## Evidence retention

M. Lindqvist has the action to circulate the disputes numbers before the next session. A Northwind engineer joined for this item and dropped off afterwards. The webhooks dashboard now splits signature mismatches by key id and by partner. Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The rollback rehearsal for payouts took 55 minutes end to end on gw-edge-02.

## Globex update

The orders replay set has 5997 requests, of which 15 carry a query string. The settlement queue drained in 30 minutes after the replay, which is within the agreed window. The settlement smoke test covers one signed request and one verified request per key id. L. Fontaine asked for the canonical hash to be shown next to each mismatch in the refunds dashboard.

## Northwind sandbox

T. Bergstrom has the action to circulate the ledger numbers before the next session. Contoso use the same key id for settlement and catalog. That is allowed. L. Fontaine asked whether webhooks still needs the old batch window. Nobody objected to dropping it.

- Export manifest signing, change to the signed header set tabled 2025-10-21, sign-off received from: Initech 2025-10-26; Northwind 2025-10-25; Umbrella 2025-10-25; Globex 2025-10-27; Contoso 2025-10-29.

## Load test

Key files are distributed by the provisioning job, which partner-integrations own. The rollback rehearsal for onboarding took 40 minutes end to end on gw-edge-02. Contoso reported 10 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side.

## Ledger queue

A Initech engineer joined for this item and dropped off afterwards. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. The signer account on gw-edge-03 has no outbound network route, which identity verified again on 2025-10-07. The webhooks dashboard now splits signature mismatches by key id and by partner.

- GW-HMAC-SHA256, change to the signed header set tabled 2025-12-02, sign-off received from: Northwind 2025-12-04; Umbrella 2025-12-03; Initech 2025-12-04; Globex 2025-12-03; Contoso 2025-12-04.

## Catalog smoke test

Contoso asked for a second sandbox key id and were pointed at the onboarding form. Mismatch rate on catalog was 0.8 percent over the window, all of it from one Globex sandbox client. M. Lindqvist raised that the reconciliation runbook still names the Perl script. To be fixed after cutover. L. Fontaine has the action to circulate the catalog numbers before the next session.

## Contoso update

D. Achterberg has the action to circulate the webhooks numbers before the next session. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards. The refunds replay set has 2229 requests, of which 39 carry a query string. The rollback rehearsal for webhooks took 5 minutes end to end on gw-edge-04.

## Globex sandbox

The fraud-ops team want the evidence files kept for 90 days after cutover. Initech reported 40 failed requests on 2025-11-11, all traced to an expired sandbox credential on their side. The reconciliation replay set has 8704 requests, of which 21 carry a query string. L. Fontaine has the action to circulate the disputes numbers before the next session. Disk on gw-edge-02 was at 44 percent after the replay and was cleared by hand.

## Catalog queue

Umbrella use the same key id for payouts and catalog. That is allowed. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. The fraud-ops team asked that query parameters carrying account numbers be masked in the dashboards.

## Rollback rehearsal

Latency through the signer stayed under 1ms at p99 across the refunds replay. Mismatch rate on disputes was 0.6 percent over the window, all of it from one Initech sandbox client. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file. L. Fontaine raised that the disputes runbook still names the Perl script. To be fixed after cutover.

- Inbound request signing, change to the key id matching tabled 2025-11-25, sign-off received from: Globex 2025-11-28; Contoso 2025-11-28; Umbrella 2025-11-30; Initech 2025-11-27; Northwind 2025-12-03.

## Evidence retention

A Contoso engineer joined for this item and dropped off afterwards. The signer account on gw-edge-01 has no outbound network route, which edge-platform verified again on 2025-11-04. Initech asked for a second sandbox key id and were pointed at the onboarding form. A. Nakamura asked whether settlement still needs the old batch window. Nobody objected to dropping it.

## Evidence retention

J. Delacroix reported that the reconciliation cutover is on track for the week of 2025-12-02. Evidence for ledger is written to the spool directory and collected every 36 minutes. The identity team asked that query parameters carrying account numbers be masked in the dashboards. J. Delacroix will rerun the ledger replay once Contoso finish their client release.

- AD-HMAC-SHA256, change to the signed header set tabled 2025-10-21, sign-off received from: Globex 2025-10-27; Northwind 2025-10-27; Contoso 2025-10-27; Umbrella 2025-10-26; Initech 2025-10-29.

## Catalog queue

Alert thresholds for refunds stay where they are until 2 clean weeks have passed. K. Mwangi raised that the webhooks runbook still names the Perl script. To be fixed after cutover. Initech use the same key id for webhooks and ledger. That is allowed.

## Access and accounts

A Initech engineer joined for this item and dropped off afterwards. Initech asked for a second sandbox key id and were pointed at the onboarding form. Key files are distributed by the provisioning job, which identity own.

## Umbrella sandbox

The catalog replay set has 563 requests, of which 39 carry a query string. The legacy signer peaked at roughly 34k requests per minute on payouts during the last cycle. The identity team asked that query parameters carrying account numbers be masked in the dashboards.

## Reconciliation runbook

D. Achterberg raised that the payouts runbook still names the Perl script. To be fixed after cutover. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. The signer account on gw-edge-02 has no outbound network route, which fraud-ops verified again on 2025-11-11. The key directory on gw-edge-03 is readable by the signer accounts only. Header count per request on refunds is between 7 and 17 in the sampled traffic.

## Settlement runbook

The webhooks smoke test covers one signed request and one verified request per key id. The onboarding dashboard now splits signature mismatches by key id and by partner. Initech reported 18 failed requests on 2025-10-28, all traced to an expired sandbox credential on their side. The access log truncates query strings longer than 512 bytes. The request itself is not truncated.
