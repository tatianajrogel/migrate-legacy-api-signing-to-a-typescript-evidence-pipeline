# 2025-10-21 canonicalisation note

Attendees: M. Lindqvist, T. Bergstrom, S. Varga, P. Oyelaran, J. Delacroix, K. Mwangi

## Disputes queue

Key files are distributed by the provisioning job, which identity own. Capacity headroom on ledger is about 42 percent at the current peak. M. Lindqvist raised that the payouts runbook still names the Perl script. To be fixed after cutover.

## Key ids

Contoso's requests are rejected as unknown because their key ids arrive in upper case. For internal service signing: the key id is matched without regard to case, provided all 5 partners have signed off on it by 2025-10-28. If not, what is in place now stays for this cutover.

## Umbrella sandbox

The partner-integrations team asked that query parameters carrying account numbers be masked in the dashboards. Capacity headroom on catalog is about 65 percent at the current peak. Header count per request on catalog is between 30 and 17 in the sampled traffic. S. Varga has the action to circulate the refunds numbers before the next session. D. Achterberg will rerun the onboarding replay once Umbrella finish their client release.

## Contoso sandbox

The access log truncates query strings longer than 512 bytes. The request itself is not truncated. K. Mwangi reported that the catalog cutover is on track for the week of 2025-10-07. The fraud-ops team asked for one more dry run on gw-edge-03 before refunds moves. Disk on gw-edge-01 was at 27 percent after the replay and was cleared by hand. The fraud-ops team want the evidence files kept for 90 days after cutover.

## Refunds replay results

The rollback rehearsal for disputes took 34 minutes end to end on gw-edge-01. Key files are distributed by the provisioning job, which identity own. Contoso use the same key id for disputes and catalog. That is allowed. S. Varga will rerun the payouts replay once Initech finish their client release.

## Rollback rehearsal

Northwind reported 13 failed requests on 2025-10-07, all traced to an expired sandbox credential on their side. Capacity headroom on webhooks is about 44 percent at the current peak. Mismatch rate on reconciliation was 0.6 percent over the window, all of it from one Northwind sandbox client. M. Lindqvist reported that the disputes cutover is on track for the week of 2025-10-14.

## Settlement runbook

The settlement replay set has 6593 requests, of which 35 carry a query string. Alert thresholds for orders stay where they are until 2 clean weeks have passed. K. Mwangi will rerun the payouts replay once Contoso finish their client release.

## Catalog replay results

Globex use the same key id for refunds and ledger. That is allowed. The rollback rehearsal for catalog took 28 minutes end to end on gw-edge-03. Key files are distributed by the provisioning job, which partner-integrations own.

## Catalog replay results

Alert thresholds for webhooks stay where they are until 2 clean weeks have passed. The access log truncates query strings longer than 8192 bytes. The request itself is not truncated. Northwind use the same key id for webhooks and reconciliation. That is allowed.

## Signed header set

P. Oyelaran previewed the December threat review. A request's `content-type` can be swapped in transit without invalidating the signature. For the admin signer: every header on the request is signed, whatever its name, except `authorization`, provided all 5 partners have signed off on it by 2025-10-28. If not, what is in place now stays for this cutover.

## Empty bodies

Empty bodies came up again from Umbrella. S. Varga proposed, and the room agreed, that for ops tooling signing a request whose body is empty or absent puts the token `BLANK` in the body-hash field. Effective from this meeting.

## Ledger cutover

Latency through the signer stayed under 4ms at p99 across the orders replay. A Northwind engineer joined for this item and dropped off afterwards. The payments-api team asked for one more dry run on gw-edge-04 before orders moves.

## Load test

T. Bergstrom has the action to circulate the payouts numbers before the next session. Northwind asked for a second sandbox key id and were pointed at the onboarding form. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. Latency through the signer stayed under 6ms at p99 across the refunds replay. The batch reader on gw-edge-03 tolerates a trailing newline at the end of the input file.

## Corrections to earlier minutes

Correction to the minutes of 2025-10-07: the item on the query parameter ordering recorded there under service mesh signing was agreed for export manifest signing, not for service mesh signing. Nothing changed for service mesh signing that day.

## Refunds queue

The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. Header count per request on settlement is between 20 and 15 in the sampled traffic. Latency through the signer stayed under 4ms at p99 across the disputes replay. The onboarding smoke test covers one signed request and one verified request per key id. The data-plane team asked that query parameters carrying account numbers be masked in the dashboards.

## Signed header set

The threat review did not accept a list of protected headers. Any header left outside the signed set is a header an intermediary can change. For the export signer: the `x-bx-*` header family and `content-type` are signed, and nothing else, provided all 5 partners have signed off on it by 2025-10-28. If not, what is in place now stays for this cutover.

## Load test

A. Nakamura asked for the canonical hash to be shown next to each mismatch in the refunds dashboard. Key files are distributed by the provisioning job, which identity own. Capacity headroom on settlement is about 64 percent at the current peak. J. Delacroix has the action to circulate the onboarding numbers before the next session.

## Access and accounts

D. Achterberg has the action to circulate the payouts numbers before the next session. Contoso asked for a second sandbox key id and were pointed at the onboarding form. Globex reported 5 failed requests on 2025-10-07, all traced to an expired sandbox credential on their side.

## Escapes in the target

Umbrella's SDK emits lowercase percent escapes. For the gateway request scheme: the hex digits of every percent escape in the path and the query are uppercased before signing, provided the proxy captures show the fronting proxy rewriting escapes. If not, what is in place now stays for this cutover.

## Corrections to earlier minutes

Correction to the minutes of 2025-10-07: the item on the separator of the signed header name list recorded there under outbound webhook signing was agreed for service mesh signing, not for outbound webhook signing. Nothing changed for outbound webhook signing that day.

## Header values

Northwind reported mismatches on requests whose header values carry runs of spaces. M. Lindqvist proposed, and the room agreed, that for BX-HMAC-SHA256 spaces and tabs are stripped from each end of every header value and every run of spaces and tabs inside it is collapsed to a single space. The client libraries follow in their next release.

## Initech update

K. Mwangi asked for the canonical hash to be shown next to each mismatch in the orders dashboard. Requests with a body over 8192 bytes are rejected upstream of the signer and never reach it. Umbrella asked for a second sandbox key id and were pointed at the onboarding form. The payouts replay set has 5112 requests, of which 36 carry a query string. D. Achterberg asked whether catalog still needs the old batch window. Nobody objected to dropping it.

## Catalog replay results

Disk on gw-edge-01 was at 46 percent after the replay and was cleared by hand. The webhooks queue drained in 39 minutes after the replay, which is within the agreed window. Latency through the signer stayed under 6ms at p99 across the refunds replay. D. Achterberg asked whether onboarding still needs the old batch window. Nobody objected to dropping it.

## Capacity

Alert thresholds for payouts stay where they are until 2 clean weeks have passed. The access log truncates query strings longer than 4096 bytes. The request itself is not truncated. Initech confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.

## Load test

M. Lindqvist asked whether payouts still needs the old batch window. Nobody objected to dropping it. Globex confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. Latency through the signer stayed under 7ms at p99 across the catalog replay. Umbrella use the same key id for orders and webhooks. That is allowed.

## Capacity

Mismatch rate on payouts was 0.6 percent over the window, all of it from one Contoso sandbox client. The signer account on gw-edge-01 has no outbound network route, which partner-integrations verified again on 2025-10-14. The legacy signer peaked at roughly 27k requests per minute on ledger during the last cycle. The reconciliation replay set has 1144 requests, of which 35 carry a query string.

## Catalog replay results

Northwind reported 21 failed requests on 2025-10-14, all traced to an expired sandbox credential on their side. The billing team asked that query parameters carrying account numbers be masked in the dashboards. K. Mwangi checked that the same settlement request produces the same canonical hash on gw-edge-04 and gw-edge-03.

## Key loading

L. Fontaine found 2 code paths that read the key file differently. For the mesh signer, as a trial: the key file is used whole, line ending included. To be confirmed or backed out at the next session but one.

## Disputes cutover

Mismatch rate on onboarding was 0.1 percent over the window, all of it from one Northwind sandbox client. A Globex engineer joined for this item and dropped off afterwards. Contoso use the same key id for webhooks and catalog. That is allowed. The refunds dashboard now splits signature mismatches by key id and by partner. The payments-api team asked that query parameters carrying account numbers be masked in the dashboards.

## Rollback rehearsal

D. Achterberg asked whether disputes still needs the old batch window. Nobody objected to dropping it. Latency through the signer stayed under 6ms at p99 across the payouts replay. The disputes replay set has 578 requests, of which 10 carry a query string. Initech reported 6 failed requests on 2025-10-14, all traced to an expired sandbox credential on their side.

## Northwind update

The webhooks queue drained in 48 minutes after the replay, which is within the agreed window. Requests with a body over 2048 bytes are rejected upstream of the signer and never reach it. J. Delacroix asked whether catalog still needs the old batch window. Nobody objected to dropping it.

## Empty bodies

P. Oyelaran asked what counts as an empty body. The old signer could not tell a missing body from a zero length one; the new record format can. Northwind asked that for the webhook signer a request whose body is empty or absent puts the token `EMPTY` in the body-hash field. Not adopted. It changes values that are case sensitive.

## Signed name list

D. Achterberg raised that the client libraries build the signed name list in 2 different ways. Agreed to bring the separator of the signed header name list of the admin signer in line with that of BX-HMAC-SHA256, as it stands today.

## Reconciliation runbook

The fraud-ops team asked for one more dry run on gw-edge-03 before webhooks moves. S. Varga reported that the disputes cutover is on track for the week of 2025-10-21. Key files are distributed by the provisioning job, which data-plane own. J. Delacroix has the action to circulate the onboarding numbers before the next session.

## Capacity

Key files are distributed by the provisioning job, which edge-platform own. The payments-api team asked for one more dry run on gw-edge-02 before catalog moves. The rollback rehearsal for ledger took 16 minutes end to end on gw-edge-04. Latency through the signer stayed under 7ms at p99 across the disputes replay. Capacity headroom on settlement is about 66 percent at the current peak.

## Header values

R. Okonkwo reran the comparison between what clients send and what arrives. Any value a client wraps or pads comes out of the fronting proxy with different spacing inside as well as at the ends. For ops tooling signing, as a trial: header values are stripped and collapsed and then lowercased. To be confirmed or backed out at the next session but one.

## Reconciliation replay results

R. Okonkwo has the action to circulate the refunds numbers before the next session. Alert thresholds for onboarding stay where they are until 2 clean weeks have passed. T. Bergstrom checked that the same ledger request produces the same canonical hash on gw-edge-04 and gw-edge-03. Initech confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.

## Onboarding runbook

Northwind confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The partner-integrations team want the evidence files kept for 90 days after cutover. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. The legacy signer peaked at roughly 21k requests per minute on disputes during the last cycle.

## Corrections to earlier minutes

Correction to the minutes of 2025-10-07: the item on the treatment of header values recorded there under AD-HMAC-SHA256 was agreed for internal service signing, not for AD-HMAC-SHA256. Nothing changed for AD-HMAC-SHA256 that day.

## Valueless parameters

Northwind's client writes `?flag` where ours writes `?flag=`, and the 2 sides sign different strings. Globex asked for a change so that, for admin API signing, a query parameter with no `=` is written with a trailing `=`. Declined. The receiving parser normalises it anyway, so it made things worse.

## Ledger queue

The rollback rehearsal for reconciliation took 21 minutes end to end on gw-edge-01. The legacy signer peaked at roughly 11k requests per minute on ledger during the last cycle. Umbrella reported 38 failed requests on 2025-09-30, all traced to an expired sandbox credential on their side. T. Bergstrom checked that the same catalog request produces the same canonical hash on gw-edge-03 and gw-edge-02. Alert thresholds for refunds stay where they are until 2 clean weeks have passed.

## Host gw-edge-02

L. Fontaine has the action to circulate the onboarding numbers before the next session. The access log truncates query strings longer than 1024 bytes. The request itself is not truncated. S. Varga asked for the canonical hash to be shown next to each mismatch in the settlement dashboard. K. Mwangi will rerun the refunds replay once Northwind finish their client release.

## Settlement replay results

The webhooks replay set has 1416 requests, of which 21 carry a query string. The key directory on gw-edge-01 is readable by the signer accounts only. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file. Globex confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.

## End of the string to sign

Umbrella asked whether the string to sign ends with a line break. J. Delacroix proposed that for batch manifest signing the string to sign ends with a line feed after the last field. Parked until there are numbers to look at; nothing changes for now.

## Payouts queue

Capacity headroom on webhooks is about 33 percent at the current peak. J. Delacroix will rerun the ledger replay once Northwind finish their client release. Requests with a body over 1024 bytes are rejected upstream of the signer and never reach it. The orders queue drained in 28 minutes after the replay, which is within the agreed window. Evidence for catalog is written to the spool directory and collected every 54 minutes.

## Escapes in the target

P. Oyelaran asked whether percent escapes survive the fronting proxy unchanged. For callback signing: the hex digits of every percent escape in the path and the query are uppercased before signing, provided the load test puts its added cost under 4 ms at p99. If not, what is in place now stays for this cutover.

## Evidence retention

A. Nakamura asked whether ledger still needs the old batch window. Nobody objected to dropping it. The key directory on gw-edge-03 is readable by the signer accounts only. Umbrella use the same key id for refunds and onboarding. That is allowed. Header count per request on reconciliation is between 3 and 11 in the sampled traffic.

## Catalog cutover

Header count per request on webhooks is between 30 and 15 in the sampled traffic. Capacity headroom on refunds is about 44 percent at the current peak. Disk on gw-edge-02 was at 49 percent after the replay and was cleared by hand. The fraud-ops team asked for one more dry run on gw-edge-01 before reconciliation moves. D. Achterberg reported that the settlement cutover is on track for the week of 2025-10-14.

## Body hash

Empty bodies came up again from Umbrella. Decision for inbound request signing: a request with no body at all puts the token `UNSIGNED` in the body-hash field, and a body of zero length is hashed like any other body. No change for anyone else.

## Reconciliation smoke test

Mismatch rate on settlement was 0.1 percent over the window, all of it from one Umbrella sandbox client. Key files are distributed by the provisioning job, which edge-platform own. The disputes dashboard now splits signature mismatches by key id and by partner.

## Access and accounts

Alert thresholds for payouts stay where they are until 2 clean weeks have passed. The onboarding smoke test covers one signed request and one verified request per key id. Contoso confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. The legacy signer peaked at roughly 21k requests per minute on onboarding during the last cycle. The billing team want the evidence files kept for 90 days after cutover.

## Rollback rehearsal

S. Varga reported that the catalog cutover is on track for the week of 2025-10-21. Header count per request on webhooks is between 30 and 15 in the sampled traffic. Latency through the signer stayed under 9ms at p99 across the catalog replay.

## Capacity

The rollback rehearsal for refunds took 22 minutes end to end on gw-edge-03. K. Mwangi checked that the same webhooks request produces the same canonical hash on gw-edge-04 and gw-edge-02. Requests with a body over 512 bytes are rejected upstream of the signer and never reach it. Header count per request on refunds is between 38 and 18 in the sampled traffic.

## SDK rollout

The signer account on gw-edge-03 has no outbound network route, which partner-integrations verified again on 2025-10-21. Disk on gw-edge-04 was at 57 percent after the replay and was cleared by hand. Latency through the signer stayed under 4ms at p99 across the catalog replay. Key files are distributed by the provisioning job, which payments-api own.

## Corrections to earlier minutes

Correction to the minutes of 2025-10-07: the item on the form of query parameters that have no value recorded there under the webhook signer was agreed for admin API signing, not for the webhook signer. Nothing changed for the webhook signer that day.

## Globex sandbox

The signer account on gw-edge-03 has no outbound network route, which data-plane verified again on 2025-09-30. A. Nakamura has the action to circulate the payouts numbers before the next session. The access log truncates query strings longer than 8192 bytes. The request itself is not truncated.

## Ledger runbook

K. Mwangi raised that the settlement runbook still names the Perl script. To be fixed after cutover. The rollback rehearsal for orders took 14 minutes end to end on gw-edge-03. D. Achterberg has the action to circulate the ledger numbers before the next session. The fraud-ops team asked for one more dry run on gw-edge-02 before payouts moves. M. Lindqvist checked that the same onboarding request produces the same canonical hash on gw-edge-02 and gw-edge-04.

## Initech update

The onboarding smoke test covers one signed request and one verified request per key id. S. Varga checked that the same settlement request produces the same canonical hash on gw-edge-02 and gw-edge-01. The batch reader on gw-edge-02 tolerates a trailing newline at the end of the input file.

## Northwind update

A Globex engineer joined for this item and dropped off afterwards. P. Oyelaran reported that the webhooks cutover is on track for the week of 2025-09-30. Northwind confirmed they are on SDK 3.1 in production and 3.2 in their sandbox. Initech reported 40 failed requests on 2025-10-07, all traced to an expired sandbox credential on their side.

## Path handling

T. Bergstrom raised paths that contain `/./`. Agreed to bring the path handling of service mesh signing in line with that of BX-HMAC-SHA256, as it stands today.

## Evidence retention

S. Varga has the action to circulate the onboarding numbers before the next session. The rollback rehearsal for disputes took 29 minutes end to end on gw-edge-03. Contoso use the same key id for payouts and disputes. That is allowed.

## Refunds runbook

The batch reader on gw-edge-04 tolerates a trailing newline at the end of the input file. Mismatch rate on catalog was 0.7 percent over the window, all of it from one Contoso sandbox client. Alert thresholds for onboarding stay where they are until 2 clean weeks have passed.

## Access and accounts

The legacy signer peaked at roughly 8k requests per minute on ledger during the last cycle. Mismatch rate on disputes was 0.3 percent over the window, all of it from one Northwind sandbox client. A. Nakamura reported that the webhooks cutover is on track for the week of 2025-09-30.

## Capacity

The key directory on gw-edge-03 is readable by the signer accounts only. The edge-platform team want the evidence files kept for 14 days after cutover. The rollback rehearsal for orders took 29 minutes end to end on gw-edge-02.

## Disputes runbook

The rollback rehearsal for payouts took 49 minutes end to end on gw-edge-01. The batch reader on gw-edge-01 tolerates a trailing newline at the end of the input file. Evidence for webhooks is written to the spool directory and collected every 41 minutes. Initech confirmed they are on SDK 3.1 in production and 3.2 in their sandbox.
