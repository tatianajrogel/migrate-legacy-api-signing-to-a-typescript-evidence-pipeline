# 2025-10-21 canonicalisation note

Attendees: S. Varga, J. Delacroix, K. Mwangi, R. Okonkwo, M. Lindqvist

## SDK rollout

The payments-api team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The identity team asked for one more dry run on gw-edge-02 before ledger moves. R. Okonkwo noted that the onboarding client sets its content type on every request, including ones with no body. Initech confirmed they are on SDK 3.0 in production and 3.1 in their sandbox.

## Access and accounts

The edge-platform team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. The partner-integrations team asked for one more dry run on gw-edge-01 before disputes moves. Initech confirmed they are on SDK 3.2 in production and 3.1 in their sandbox. Header count per request on reconciliation is between 27 and 10 in the sampled traffic.

## Dashboards

Alert thresholds for reconciliation stay where they are until two clean weeks have passed. Globex reported 11 failed requests on 2025-10-09, all traced to an expired sandbox credential on their side. Initech sends header names in upper case. Names are lowercased on our side, so this has never mattered. The rollback rehearsal for ledger took 32 minutes end to end on gw-edge-03.

## Proxy upgrade

Disk on gw-edge-01 was at 60 percent after the replay and was cleared by hand. Key files are distributed by the provisioning job, which edge-platform own. The webhooks dashboard now splits signature mismatches by key id and by partner.

## Contoso sandbox

Key files are distributed by the provisioning job, which partner-integrations own. K. Mwangi asked for the canonical hash to be shown next to each mismatch in the payouts dashboard so partners can compare. Northwind use the same key id for disputes and refunds. That is allowed.

## Load test

L. Fontaine reported that the payouts cutover is on track for the week of 2025-10-09. The legacy signer peaked at roughly 26k requests per minute on catalog during the last cycle. Umbrella sends header names in upper case. Names are lowercased on our side, so this has never mattered. The partner-integrations team asked for one more dry run on gw-edge-04 before payouts moves. M. Lindqvist asked whether reconciliation still needs the old batch window. Nobody objected to dropping it.

## Reconciliation replay results

P. Oyelaran will rerun the refunds replay once Initech finish their client release. Disk on gw-edge-01 was at 47 percent after the replay and was cleared by hand. L. Fontaine has the action to circulate the catalog numbers before the next session. Header count per request on disputes is between 22 and 10 in the sampled traffic.

## Capacity

P. Oyelaran raised that the settlement runbook still names the Perl script. To be fixed after cutover. Globex use the same key id for reconciliation and onboarding. That is allowed. K. Mwangi noted that the catalog client sets its content type on every request, including ones with no body. The rollback rehearsal for webhooks took 11 minutes end to end on gw-edge-04. The proxy in front of gw-edge-02 was upgraded on 2025-10-14. D. Achterberg compared captures from before and after.

## Dashboards

L. Fontaine will rerun the orders replay once Initech finish their client release. The signer account on gw-edge-01 has no outbound network route, which identity verified again on 2025-09-30. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. The legacy signer peaked at roughly 23k requests per minute on refunds during the last cycle. A. Nakamura noted that the onboarding client sets its content type on every request, including ones with no body.

## Disputes queue

No change in behaviour was requested for settlement in this session. Northwind use the same key id for disputes and payouts. That is allowed. Header count per request on ledger is between 30 and 18 in the sampled traffic.

## Northwind update

A Northwind engineer joined for this item and dropped off afterwards. The proxy in front of gw-edge-02 was upgraded on 2025-10-09. M. Lindqvist compared captures from before and after. The legacy signer peaked at roughly 26k requests per minute on ledger during the last cycle. The onboarding replay set has 6078 requests, of which 10 carry a query string. Evidence for refunds is written to the spool directory and collected every 44 minutes.

## Body field questions

L. Fontaine asked what counts as an empty body for the `UNSIGNED` token. Working answer for now: a record with no body at all signs `UNSIGNED`, and a record that carries a body of zero length is hashed like any other body. The 2019 signer could not tell the 2 apart. The new record format can.

## Reconciliation replay results

A. Nakamura has the action to circulate the payouts numbers before the next session. S. Varga raised that the refunds runbook still names the Perl script. To be fixed after cutover. No change in behaviour was requested for refunds in this session. A Northwind engineer joined for this item and dropped off afterwards. T. Bergstrom checked that the same refunds request produces the same canonical hash on gw-edge-02 and gw-edge-03.

## Access and accounts

Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. K. Mwangi has the action to circulate the catalog numbers before the next session. Umbrella asked for a second sandbox key id and were pointed at the onboarding form. The webhooks replay set has 6051 requests, of which 17 carry a query string.

## Payouts cutover

Evidence for webhooks is written to the spool directory and collected every 49 minutes. Latency through the signer stayed under 1ms at p99 across the onboarding replay. The settlement queue drained in 8 minutes after the replay, which is within the agreed window. A. Nakamura noted that the payouts client sets its content type on every request, including ones with no body.

## Northwind update

A. Nakamura will rerun the settlement replay once Initech finish their client release. The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. No change in behaviour was requested for catalog in this session. Evidence for orders is written to the spool directory and collected every 17 minutes. The proxy in front of gw-edge-01 was upgraded on 2025-10-09. L. Fontaine compared captures from before and after.

## Settlement queue

The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. The rollback rehearsal for reconciliation took 54 minutes end to end on gw-edge-03. M. Lindqvist asked for the canonical hash to be shown next to each mismatch in the catalog dashboard so partners can compare. P. Oyelaran noted that the settlement client sets its content type on every request, including ones with no body.

## Webhooks smoke test

Northwind sends header names in upper case. Names are lowercased on our side, so this has never mattered. The webhook signer is owned by the webhooks team and is not part of this migration. The identity team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already. M. Lindqvist reported that the refunds cutover is on track for the week of 2025-09-30. Initech confirmed they are on SDK 3.0 in production and 3.2 in their sandbox.

## Dashboards

The payouts replay set has 2708 requests, of which 3 carry a query string. The partner-integrations team want the evidence files kept for 14 days after cutover. Alert thresholds for orders stay where they are until two clean weeks have passed. Globex asked for a second sandbox key id and were pointed at the onboarding form.

## Escapes in the target

K. Mwangi proposed uppercasing the hex digits of every percent escape in the path and the query before signing, because 2 partner SDKs emit lowercase escapes and the fronting proxy might be rewriting them. Parked until D. Achterberg has captures from the proxy.

## Onboarding smoke test

Contoso asked for a second sandbox key id and were pointed at the onboarding form. A Umbrella engineer joined for this item and dropped off afterwards. L. Fontaine asked whether disputes still needs the old batch window. Nobody objected to dropping it. Contoso retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing. The edge-platform team want the evidence files kept for 14 days after cutover. The settlement dashboard now splits signature mismatches by key id and by partner.

## Settlement replay results

The access log truncates query strings longer than 512 bytes. The request itself is not truncated. Evidence for refunds is written to the spool directory and collected every 45 minutes. Latency through the signer stayed under 5ms at p99 across the ledger replay. Alert thresholds for settlement stay where they are until two clean weeks have passed.

## Shared helper

M. Lindqvist flagged that the webhook signer terminates its string to sign with a line feed and signs header values untouched. That is their scheme and it stays that way. The shared helper in the Perl tree has a flag for each behaviour and the gateway path does not set them the way the webhook path does.

## Evidence retention

The payouts queue drained in 9 minutes after the replay, which is within the agreed window. Alert thresholds for payouts stay where they are until two clean weeks have passed. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. Latency through the signer stayed under 2ms at p99 across the ledger replay.

## SDK rollout

The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything. Header count per request on reconciliation is between 34 and 17 in the sampled traffic. The key directory on gw-edge-02 is readable by the signer account only. A. Nakamura has the action to circulate the payouts numbers before the next session.
