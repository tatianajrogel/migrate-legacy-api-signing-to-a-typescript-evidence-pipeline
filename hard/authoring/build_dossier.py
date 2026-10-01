"""Builds hard/environment/app/dossier from a fixed seed.

The dossier has 2 kinds of text. The passages in SIGNAL are written by hand and
carry everything the scheme depends on: the 5 register entries that changed, the
proposals that were raised and not adopted, the 3 changes that were themselves
changed again, and the notes about the unrelated webhook signer. Everything else
is generated from the sentence pools below and says nothing about the scheme.

The generated text uses the same vocabulary as the hand written text (headers,
query strings, key files, newlines, mismatches) on purpose, so that the scheme
cannot be recovered by filtering on words.

Usage: python hard/authoring/build_dossier.py
"""

import random
from pathlib import Path

SEED = 20251209
OUT = Path(__file__).resolve().parent.parent / "environment" / "app" / "dossier"
BASE_REGISTER = (
    Path(__file__).resolve().parents[2]
    / "environment" / "app" / "dossier" / "01-decision-register.md"
)

PEOPLE = [
    "A. Nakamura", "M. Lindqvist", "K. Mwangi", "R. Okonkwo", "D. Achterberg",
    "J. Delacroix", "S. Varga", "L. Fontaine", "T. Bergstrom", "P. Oyelaran",
]
PARTNERS = ["Globex", "Initech", "Umbrella", "Contoso", "Northwind"]
SERVICES = [
    "orders", "catalog", "payouts", "ledger", "disputes", "settlement",
    "refunds", "onboarding", "reconciliation", "webhooks",
]
TEAMS = [
    "edge-platform", "identity", "billing", "fraud-ops", "sre-core",
    "partner-integrations", "payments-api", "data-plane",
]
HOSTS = ["gw-edge-01", "gw-edge-02", "gw-edge-03", "gw-edge-04"]
SDK = ["3.0", "3.1", "3.2"]

# Sentences that describe operations around the signer. None of them states a
# rule of the GW scheme that the register does not already state.
OPS = [
    "{person} reported that the {svc} cutover is on track for the week of {date}.",
    "The {team} team asked for one more dry run on {host} before {svc} moves.",
    "Latency through the signer stayed under {ms}ms at p99 across the {svc} replay.",
    "The legacy signer peaked at roughly {k}k requests per minute on {svc} during the last cycle.",
    "{partner} confirmed they are on SDK {sdk} in production and {sdk2} in their sandbox.",
    "{partner} retries with its headers in a different order, which changes nothing because the header block is sorted by name before signing.",
    "{partner} sends header names in upper case. Names are lowercased on our side, so this has never mattered.",
    "The {svc} dashboard now splits signature mismatches by key id and by partner.",
    "Mismatch rate on {svc} was {pct} percent over the window, all of it from one {partner} sandbox client.",
    "{person} checked that the same {svc} request produces the same canonical hash on {host} and {host2}.",
    "The access log truncates query strings longer than {bytes} bytes. The request itself is not truncated.",
    "The batch reader on {host} tolerates a trailing newline at the end of the input file.",
    "The load generator was built in early October from the register and has not been updated since, so its own mismatch count is not a measure of anything.",
    "{person} will rerun the {svc} replay once {partner} finish their client release.",
    "The {team} team want the evidence files kept for {days} days after cutover.",
    "Evidence for {svc} is written to the spool directory and collected every {mins} minutes.",
    "Disk on {host} was at {pct2} percent after the replay and was cleared by hand.",
    "{person} raised that the {svc} runbook still names the Perl script. To be fixed after cutover.",
    "No change in behaviour was requested for {svc} in this session.",
    "The key directory on {host} is readable by the signer account only.",
    "Key files are distributed by the provisioning job, which {team} own.",
    "{partner} asked for a second sandbox key id and were pointed at the onboarding form.",
    "A {partner} engineer joined for this item and dropped off afterwards.",
    "The {svc} smoke test covers one signed request and one verified request per key id.",
    "{person} asked whether {svc} still needs the old batch window. Nobody objected to dropping it.",
    "The {svc} queue drained in {mins} minutes after the replay, which is within the agreed window.",
    "Alert thresholds for {svc} stay where they are until two clean weeks have passed.",
    "{person} has the action to circulate the {svc} numbers before the next session.",
    "The rollback rehearsal for {svc} took {mins} minutes end to end on {host}.",
    "{partner} reported {n} failed requests on {date}, all traced to an expired sandbox credential on their side.",
    "Requests with a body over {bytes} bytes are rejected upstream of the signer and never reach it.",
    "The proxy in front of {host} was upgraded on {date}. {person} compared captures from before and after.",
    "Header count per request on {svc} is between {n} and {n2} in the sampled traffic.",
    "{person} noted that the {svc} client sets its content type on every request, including ones with no body.",
    "The {team} team asked that query parameters carrying account numbers be masked in the dashboards. They are masked in the log pipeline already.",
    "{partner} use the same key id for {svc} and {svc2}. That is allowed.",
    "The signer account on {host} has no outbound network route, which {team} verified again on {date}.",
    "{person} asked for the canonical hash to be shown next to each mismatch in the {svc} dashboard so partners can compare.",
    "Capacity headroom on {svc} is about {pct2} percent at the current peak.",
    "The {svc} replay set has {n3} requests, of which {n} carry a query string.",
]

# The outbound webhook signer is a different system with a different scheme.
# Every sentence here names it, and every rule here is true of it and not of GW.
WEBHOOK = [
    "The outbound webhook signer (WH-HMAC-SHA256) puts a timestamp line ahead of everything else in its string to sign.",
    "The webhook signer joins its signed header names with a comma.",
    "The webhook signer renders its signatures as base64, which the {team} team would like to keep.",
    "The webhook signer terminates its string to sign with a line feed.",
    "The webhook signer signs header values exactly as it builds them, with no trimming, since it is the one sending them.",
    "The webhook signer does not cover the query string at all, because receivers register a fixed URL.",
    "The webhook signer reads its key file whole, line ending included, and receivers in the field depend on that.",
    "The webhook signer is owned by the webhooks team and is not part of this migration.",
]

SYMPTOMS = [
    "every request rejected after a deploy on their side",
    "intermittent rejections on their sandbox only",
    "requests accepted in sandbox and rejected in production",
    "one endpoint failing while the rest succeed",
    "a burst of rejections during their nightly batch",
]
CAUSES = [
    "They were sending the sandbox key id to the production host.",
    "Their client was signing with a key that had been rotated out the week before.",
    "A middlebox on their side was rewriting the request after it had been signed.",
    "Their deploy had rolled back to SDK {sdk} without anyone noticing.",
    "Their retry wrapper was re-sending the request with the Authorization header from the first attempt and a changed body.",
    "The request never reached us. Their egress firewall was dropping it.",
]
RESOLUTIONS = [
    "Resolved on their side the same day.",
    "Resolved after they redeployed.",
    "Closed with no change on our side.",
    "{person} walked them through the canonical hash comparison and they found it themselves.",
    "Closed after {days} days with no further reports.",
]


def fill(rng, text, date_pool):
    partner = rng.choice(PARTNERS)
    svc, svc2 = rng.sample(SERVICES, 2)
    host, host2 = rng.sample(HOSTS, 2)
    sdk, sdk2 = rng.sample(SDK, 2)
    lo = rng.randint(3, 6)
    return text.format(
        person=rng.choice(PEOPLE), partner=partner, svc=svc, svc2=svc2,
        team=rng.choice(TEAMS), host=host, host2=host2, sdk=sdk, sdk2=sdk2,
        ms=rng.randint(1, 9), k=rng.randint(3, 41),
        pct=f"0.{rng.randint(1, 9)}", pct2=rng.randint(22, 78),
        bytes=rng.choice([512, 1024, 2048, 4096, 8192]),
        days=rng.choice([7, 14, 30, 90]), mins=rng.randint(4, 55),
        n=rng.randint(2, 40), n2=lo + rng.randint(4, 12), n3=rng.randint(400, 9000),
        date=rng.choice(date_pool),
    )


def paragraph(rng, date_pool, webhook_chance=0.12):
    sentences = [fill(rng, s, date_pool) for s in rng.sample(OPS, rng.randint(3, 6))]
    if rng.random() < webhook_chance:
        sentences.insert(
            rng.randint(0, len(sentences)), fill(rng, rng.choice(WEBHOOK), date_pool)
        )
    return " ".join(sentences)


MEETING_HEADINGS = [
    "{Svc} cutover", "{Svc} replay results", "{Partner} update", "Dashboards",
    "Load test", "SDK rollout", "{Svc} runbook", "Capacity", "{Svc} smoke test",
    "Evidence retention", "{Partner} sandbox", "Proxy upgrade", "Host {host}",
    "{Svc} queue", "Rollback rehearsal", "Access and accounts",
]


def heading(rng, pool):
    return rng.choice(pool).format(
        Svc=rng.choice(SERVICES).capitalize(), Partner=rng.choice(PARTNERS),
        host=rng.choice(HOSTS), team=rng.choice(TEAMS),
    )


# ---------------------------------------------------------------------------
# Hand written passages. (heading, body) per file, kept in this order.
# ---------------------------------------------------------------------------

SIGNAL = {
    "02-2025-10-07-migration.md": [
        ("Scope", (
            "The Perl signer is being replaced by a TypeScript pipeline that reads "
            "request records and writes evidence. The port is being written from the "
            "decision register, which is the only place the scheme is written down "
            "end to end. Changes agreed in these sessions are minuted here and the "
            "register is left as it is."
        )),
        ("Webhook signer", (
            "The outbound webhook signer is out of scope. It uses its own scheme, "
            "WH-HMAC-SHA256, owned by the webhooks team, and none of its rules carry "
            "over to the gateway scheme. For reference it signs a timestamp line "
            "ahead of everything else, joins its signed header names with a comma, "
            "and renders signatures as base64. It came up because the 2 signers "
            "share a helper module in the Perl tree."
        )),
    ],
    "03-2025-10-21-canonicalisation.md": [
        ("Body field questions", (
            "L. Fontaine asked what counts as an empty body for the `UNSIGNED` "
            "token. Working answer for now: a record with no body at all signs "
            "`UNSIGNED`, and a record that carries a body of zero length is hashed "
            "like any other body. The 2019 signer could not tell the 2 apart. The "
            "new record format can."
        )),
        ("Escapes in the target", (
            "K. Mwangi proposed uppercasing the hex digits of every percent escape "
            "in the path and the query before signing, because 2 partner SDKs emit "
            "lowercase escapes and the fronting proxy might be rewriting them. "
            "Parked until D. Achterberg has captures from the proxy."
        )),
        ("Shared helper", (
            "M. Lindqvist flagged that the webhook signer terminates its string to "
            "sign with a line feed and signs header values untouched. That is their "
            "scheme and it stays that way. The shared helper in the Perl tree has a "
            "flag for each behaviour and the gateway path does not set them the way "
            "the webhook path does."
        )),
    ],
    "04-2025-11-04-gateway.md": [
        ("Proxy comparison rerun", (
            "D. Achterberg reran the comparison between what partners send and what "
            "reaches the signer. Any header value that a partner client wraps or "
            "pads comes out of the fronting proxy with different spacing, so the 2 "
            "sides hash different bytes for the same request. Agreed in the room: "
            "before a value goes into the header block, both sides strip spaces and "
            "tabs from each end of it and squeeze every run of spaces and tabs "
            "inside it down to a single space. Header names are not affected. SDK "
            "3.2 already does this, the Perl signer has done it since the hotfix of "
            "2025-10-29, and the port has to match."
        )),
        ("Escapes, follow-up", (
            "The captures K. Mwangi asked for on 2025-10-21 are in. Percent escapes "
            "pass through the proxy byte for byte in both the path and the query, "
            "lowercase or uppercase. With nothing to fix, the proposal to uppercase "
            "escape hex before signing was withdrawn. Path and query text go into "
            "the canonical request as they sit in the target."
        )),
        ("Valueless parameters", (
            "Contoso's client writes a parameter that has no value as the bare "
            "name, `?flag`, and a canonical query with an added `=` does not match "
            "what their SDK signs. K. Mwangi asked for the canonical query to write "
            "such a parameter bare as well. Accepted as a trial for the SDK 3.2 "
            "window, to be confirmed or backed out at the freeze."
        )),
    ],
    "05-2025-11-18-addendum.md": [
        ("Repeated query names", (
            "R. Okonkwo traced the intermittent mismatches on the ledger export to "
            "repeated parameter names. Once a request has crossed the load balancer "
            "the order of its `id=` parameters is no longer the order the partner "
            "sent, so keeping arrival order inside a name cannot be reproduced on "
            "our side. Ordering is now by name first and then by value. T. Bergstrom "
            "asked that values be percent-decoded before they are compared, so that "
            "`%7E` and `~` land together, and that went in as well."
        )),
        ("Threat review preview", (
            "L. Fontaine previewed the December threat review. A request's "
            "`content-type` can be swapped in transit without invalidating the "
            "signature, because only the `x-gw-` family is covered. As a stopgap "
            "`content-type` joins the signed set now. Whether `host` and the rest "
            "follow is for the review itself to settle."
        )),
        ("Webhook key loading", (
            "The webhook signer reads its key file whole, line ending included, and "
            "the webhooks team are keeping that for the sake of receivers already "
            "in the field. S. Varga's point was only that nobody should assume the "
            "2 signers load keys the same way because they sit in the same tree."
        )),
    ],
    "06-2025-11-25-partner.md": [
        ("SDK interop findings", (
            "3 partner SDKs were run against the ordering agreed on 2025-11-18 and "
            "they disagree with each other on anything involving `+` or a lowercase "
            "escape, because each one decodes differently. The decode step is "
            "dropped. Parameters are ordered by name and then by value, and both "
            "comparisons are plain byte order on the text exactly as it appears in "
            "the target. Nothing is decoded at any point in building the canonical "
            "query."
        )),
        ("Globex path mismatch", (
            "Globex's router emits targets such as `/v2/./orders` and their "
            "signatures fail whenever something in between tidies the path. "
            "S. Varga proposed collapsing dot segments on our side before signing. "
            "Opinions were split. J. Delacroix will take it to the freeze."
        )),
        ("Northwind key ids", (
            "Northwind's integration upper-cases every header value it controls, "
            "the key id included, and their requests are rejected as unknown. They "
            "asked for key ids to be matched without regard to case. P. Oyelaran is "
            "against, since an id maps straight to a file name. Goes to the freeze "
            "with the Globex item."
        )),
    ],
    "07-2025-12-02-scheme-freeze.md": [
        ("Threat review outcome", (
            "The review did not accept a list. Any header left outside the signed "
            "set is a header an intermediary can change, and naming the important "
            "ones only moves the gap. Every header on the request goes into the "
            "header block and the name list, whatever it is called. The one header "
            "that stays out is `authorization`, which holds the signature and "
            "cannot be an input to it."
        )),
        ("Body hash", (
            "Partner debugging around the `UNSIGNED` token has cost more than the "
            "token ever saved, and the line drawn on 2025-10-21 between a missing "
            "body and a zero length one made it worse. The token is gone. The last "
            "field of the canonical request is the lowercase hex SHA-256 of the "
            "body bytes in every case, and a record with no body is treated as a "
            "body of zero length."
        )),
        ("Design doc audit", (
            "J. Delacroix compared the internal design doc line by line with what "
            "the Perl signer hands to HMAC. The signer's input stops at the last "
            "hex digit of the body hash. The line break shown after it in the "
            "design doc, and copied into the register from there, was an artefact "
            "of how the example had been pasted. The 6 fields are joined by LF and "
            "nothing follows the sixth."
        )),
        ("Trial items", (
            "The valueless parameter trial from 2025-11-04 is backed out. The "
            "gateway's own parser turns `?flag` into `flag=` before it verifies, so "
            "writing the parameter bare made things worse. A parameter with no `=` "
            "is written with a trailing `=`, as it was before the trial. Contoso "
            "have a client fix scheduled."
        )),
        ("Open proposals", (
            "Dot segment collapsing (Globex, 2025-11-25): not adopted. The path is "
            "signed as it arrives with no normalisation of any kind, and Globex "
            "will fix their router. Key ids without regard to case (Northwind, "
            "2025-11-25): not adopted. The key id value is used exactly as sent, so "
            "an id in the wrong case does not resolve to a key."
        )),
        ("Freeze", (
            "The scheme is frozen as of this meeting. Anything raised from here on "
            "is a candidate for a later revision and does not change what the port "
            "implements."
        )),
    ],
    "08-2025-12-09-rollout.md": [
        ("Initech forwarding headers", (
            "Initech's egress adds `via` and `x-forwarded-for` after their client "
            "has signed, and they asked for those 2 names to be left out of the "
            "signed set. Declined for this scheme, which was frozen on 2025-12-02: "
            "the signer covers every header on the record it is given. Logged as a "
            "candidate for the next revision."
        )),
        ("Key rotation", (
            "`gw-prod-03` was cut on 2025-11-27 for the first quarter rotation and "
            "its file is already in the key directory on every edge host. "
            "Activating it is a separate change with its own window and is not part "
            "of this cutover."
        )),
    ],
    "12-key-rotation-runbook.md": [
        ("Pending rotation", (
            "`gw-prod-03` was cut on 2025-11-27. Partners listed against it in the "
            "onboarding matrix are assigned to it for the first quarter rotation "
            "and are still signing with their current key id until that rotation "
            "is announced."
        )),
    ],
    "11-load-test-observations.md": [
        ("Generator caveat", (
            "The load generator signs with only the `x-gw-` headers in its header "
            "block and sends the `UNSIGNED` token for bodiless requests. It was "
            "written on 2025-10-09 and nobody has had a reason to change it, since "
            "the load test measures throughput and discards the verification "
            "result."
        )),
    ],
    "16-partner-support-escalations.md": [
        ("2025-11-06 Contoso", (
            "Signatures failing on requests that carry a `?verbose` flag. Support "
            "advised writing the parameter bare in the canonical query, as agreed "
            "at the sync 2 days earlier. Resolved."
        )),
        ("2025-11-10 Contoso", (
            "Signatures failing on DELETE requests. Support advised that a request "
            "sent with no body signs the token `UNSIGNED` in the last field. "
            "Resolved."
        )),
        ("2025-11-12 Umbrella", (
            "Asked whether changing `host` between environments needs a new "
            "signature. Support advised that it does not, since only the `x-gw-` "
            "headers are covered. Closed."
        )),
        ("2025-11-20 Globex", (
            "Mismatches on requests with repeated `tag` parameters. Support "
            "advised ordering by name and then by percent-decoded value. Resolved."
        )),
    ],
}

MEETINGS = [
    ("02-2025-10-07-migration.md", "2025-10-07 migration kickoff", 9000),
    ("03-2025-10-21-canonicalisation.md", "2025-10-21 canonicalisation note", 9000),
    ("04-2025-11-04-gateway.md", "2025-11-04 gateway sync", 17000),
    ("05-2025-11-18-addendum.md", "2025-11-18 addendum", 15000),
    ("06-2025-11-25-partner.md", "2025-11-25 partner review", 11000),
    ("07-2025-12-02-scheme-freeze.md", "2025-12-02 scheme freeze", 19000),
    ("08-2025-12-09-rollout.md", "2025-12-09 rollout", 9500),
]

APPENDICES = [
    ("10-partner-onboarding-matrix.md", "Appendix - Partner Onboarding Matrix", 26000),
    ("11-load-test-observations.md", "Appendix - Load Test Observations", 24000),
    ("12-key-rotation-runbook.md", "Appendix - Key Rotation Runbook", 28000),
    ("13-error-taxonomy.md", "Appendix - Error Taxonomy", 26000),
    ("14-rollback-procedure.md", "Appendix - Rollback Procedure", 25000),
    ("15-capacity-planning-notes.md", "Appendix - Capacity Planning Notes", 25000),
    ("16-partner-support-escalations.md", "Appendix - Partner Support Escalations", 28000),
    ("17-observability-dashboards.md", "Appendix - Observability Dashboards", 28000),
]

APPENDIX_HEADINGS = [
    "{Svc} / {team}", "{Partner} / {Svc}", "Host {host}", "{Svc} notes",
    "{team} review", "{Partner} sandbox", "{Svc} window",
]


def dates_before(day):
    pool = [
        "2025-09-30", "2025-10-02", "2025-10-09", "2025-10-14", "2025-10-23",
        "2025-10-29", "2025-11-03", "2025-11-11", "2025-11-17", "2025-11-24",
        "2025-11-28", "2025-12-01", "2025-12-05", "2025-12-08",
    ]
    return [d for d in pool if d <= day] or pool[:1]


def place(rng, filler, signal):
    """Scatters the hand written sections through the generated ones, in order.

    Never first and never last, so nothing can be found by position.
    """
    slots = sorted(rng.sample(range(2, len(filler) - 1), len(signal)))
    out = list(filler)
    for offset, (slot, section) in enumerate(zip(slots, signal)):
        out.insert(slot + offset, section)
    return out


def build_meeting(rng, name, title, size):
    day = title[:10]
    pool = dates_before(day)
    attendees = ", ".join(rng.sample(PEOPLE, rng.randint(5, 8)))
    filler = []
    used = 0
    while used < size:
        section = (heading(rng, MEETING_HEADINGS), paragraph(rng, pool))
        filler.append(section)
        used += len(section[0]) + len(section[1]) + 6
    sections = place(rng, filler, SIGNAL.get(name, []))
    body = "\n\n".join(f"## {h}\n\n{p}" for h, p in sections)
    return f"# {title}\n\nAttendees: {attendees}\n\n{body}\n"


def ticket(rng, pool):
    partner = rng.choice(PARTNERS)
    text = " ".join([
        rng.choice(SYMPTOMS).capitalize() + ".",
        fill(rng, rng.choice(CAUSES), pool),
        fill(rng, rng.choice(RESOLUTIONS), pool),
        fill(rng, rng.choice(OPS), pool),
    ])
    return (f"{rng.choice(pool)} {partner}", text)


def build_appendix(rng, name, title, size):
    pool = dates_before("2025-12-08")
    is_tickets = name.startswith("16-")
    filler = []
    used = 0
    while used < size:
        if is_tickets:
            section = ticket(rng, pool)
        else:
            section = (heading(rng, APPENDIX_HEADINGS), paragraph(rng, pool))
        filler.append(section)
        used += len(section[0]) + len(section[1]) + 6
    sections = place(rng, filler, SIGNAL.get(name, []))
    if is_tickets:
        # Tickets read in date order, hand written ones included.
        sections.sort(key=lambda s: s[0][:10])
    body = "\n\n".join(f"## {h}\n\n{p}" for h, p in sections)
    return f"# {title}\n\n{body}\n"


def build_register():
    """The register is the base task's, minus the note telling the reader to
    cross-check it. The hard variant leaves that to the reader."""
    text = BASE_REGISTER.read_text(encoding="utf-8")
    start = text.index("> Reading guidance")
    end = text.index("## GW-002")
    return text[:start] + text[end:]


def main():
    rng = random.Random(SEED)
    OUT.mkdir(parents=True, exist_ok=True)
    for old in OUT.glob("*.md"):
        old.unlink()
    files = {"01-decision-register.md": build_register()}
    for name, title, size in MEETINGS:
        files[name] = build_meeting(rng, name, title, size)
    for name, title, size in APPENDICES:
        files[name] = build_appendix(rng, name, title, size)
    total = 0
    for name, text in files.items():
        (OUT / name).write_bytes(text.encode("utf-8"))
        total += len(text)
    print(f"wrote {len(files)} files, {total} bytes")


if __name__ == "__main__":
    main()
