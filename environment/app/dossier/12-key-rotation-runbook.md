# Appendix - Key Rotation Runbook

## Reconciliation / identity

This does not affect the canonicalisation rules. No action was assigned; P. Oyelaran will follow up in the next sync. P. Oyelaran noted that the webhooks service had already shipped a partial workaround. We agreed to revisit once the onboarding cutover completes. The sre-core team raised this during the key-rotation-runbook walkthrough. Partner Initech confirmed they had no dependency on the old behaviour. Latency impact was measured at under 2ms at p99.

## Reconciliation / fraud-ops

D. Achterberg noted that the payouts service had already shipped a partial workaround. Latency impact was measured at under 4ms at p99. No action was assigned; J. Delacroix will follow up in the next sync. This does not affect the canonicalisation rules.

## Payouts / payments-api

Latency impact was measured at under 4ms at p99. No action was assigned; D. Achterberg will follow up in the next sync. This does not affect the canonicalisation rules. We agreed to revisit once the ledger cutover completes. M. Lindqvist noted that the settlement service had already shipped a partial workaround.

## Ledger / data-plane

Latency impact was measured at under 7ms at p99. We agreed to revisit once the disputes cutover completes. S. Varga noted that the payouts service had already shipped a partial workaround. Partner Initech confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules.

## Ledger / identity

No action was assigned; T. Bergstrom will follow up in the next sync. The legacy signer handled roughly 27k requests per minute at peak, so any regression here is immediately visible. Partner Contoso confirmed they had no dependency on the old behaviour. We agreed to revisit once the disputes cutover completes. The edge-platform team raised this during the key-rotation-runbook walkthrough. Latency impact was measured at under 1ms at p99. This does not affect the canonicalisation rules.

## Ledger / billing

This does not affect the canonicalisation rules. The edge-platform team raised this during the key-rotation-runbook walkthrough. Latency impact was measured at under 9ms at p99. Partner Umbrella confirmed they had no dependency on the old behaviour. J. Delacroix noted that the reconciliation service had already shipped a partial workaround.

## Settlement / fraud-ops

The sre-core team raised this during the key-rotation-runbook walkthrough. J. Delacroix noted that the settlement service had already shipped a partial workaround. The legacy signer handled roughly 35k requests per minute at peak, so any regression here is immediately visible. No action was assigned; K. Mwangi will follow up in the next sync.

## Webhooks / billing

Latency impact was measured at under 6ms at p99. The legacy signer handled roughly 18k requests per minute at peak, so any regression here is immediately visible. Partner Initech confirmed they had no dependency on the old behaviour. The identity team raised this during the key-rotation-runbook walkthrough. We agreed to revisit once the ledger cutover completes. No action was assigned; A. Nakamura will follow up in the next sync.

## Webhooks / partner-integrations

This does not affect the canonicalisation rules. Latency impact was measured at under 4ms at p99. We agreed to revisit once the onboarding cutover completes. The legacy signer handled roughly 25k requests per minute at peak, so any regression here is immediately visible. The billing team raised this during the key-rotation-runbook walkthrough. No action was assigned; K. Mwangi will follow up in the next sync. J. Delacroix noted that the webhooks service had already shipped a partial workaround.

## Orders / sre-core

K. Mwangi noted that the ledger service had already shipped a partial workaround. The sre-core team raised this during the key-rotation-runbook walkthrough. The legacy signer handled roughly 10k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the settlement cutover completes. Latency impact was measured at under 9ms at p99.

## Reconciliation / fraud-ops

Partner Initech confirmed they had no dependency on the old behaviour. No action was assigned; D. Achterberg will follow up in the next sync. J. Delacroix noted that the ledger service had already shipped a partial workaround. We agreed to revisit once the orders cutover completes. Latency impact was measured at under 8ms at p99. The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible.

## Reconciliation / billing

Latency impact was measured at under 5ms at p99. The identity team raised this during the key-rotation-runbook walkthrough. No action was assigned; M. Lindqvist will follow up in the next sync. We agreed to revisit once the refunds cutover completes. The legacy signer handled roughly 30k requests per minute at peak, so any regression here is immediately visible. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Disputes / edge-platform

Partner Contoso confirmed they had no dependency on the old behaviour. We agreed to revisit once the settlement cutover completes. Latency impact was measured at under 4ms at p99. This does not affect the canonicalisation rules.

## Refunds / data-plane

Partner Northwind confirmed they had no dependency on the old behaviour. We agreed to revisit once the webhooks cutover completes. The partner-integrations team raised this during the key-rotation-runbook walkthrough. Latency impact was measured at under 2ms at p99. This does not affect the canonicalisation rules. T. Bergstrom noted that the disputes service had already shipped a partial workaround.

## Refunds / fraud-ops

S. Varga noted that the webhooks service had already shipped a partial workaround. Partner Northwind confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. The payments-api team raised this during the key-rotation-runbook walkthrough. No action was assigned; T. Bergstrom will follow up in the next sync.

## Reconciliation / edge-platform

No action was assigned; D. Achterberg will follow up in the next sync. M. Lindqvist noted that the webhooks service had already shipped a partial workaround. This does not affect the canonicalisation rules. We agreed to revisit once the refunds cutover completes. The fraud-ops team raised this during the key-rotation-runbook walkthrough.

## Onboarding / fraud-ops

The legacy signer handled roughly 16k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. We agreed to revisit once the reconciliation cutover completes. The partner-integrations team raised this during the key-rotation-runbook walkthrough.

## Webhooks / billing

M. Lindqvist noted that the refunds service had already shipped a partial workaround. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible. The payments-api team raised this during the key-rotation-runbook walkthrough. We agreed to revisit once the payouts cutover completes. This does not affect the canonicalisation rules. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Reconciliation / edge-platform

P. Oyelaran noted that the ledger service had already shipped a partial workaround. Partner Northwind confirmed they had no dependency on the old behaviour. No action was assigned; A. Nakamura will follow up in the next sync. Latency impact was measured at under 2ms at p99. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the orders cutover completes. This does not affect the canonicalisation rules.

## Disputes / edge-platform

The sre-core team raised this during the key-rotation-runbook walkthrough. We agreed to revisit once the onboarding cutover completes. This does not affect the canonicalisation rules. P. Oyelaran noted that the settlement service had already shipped a partial workaround.

## Reconciliation / partner-integrations

The fraud-ops team raised this during the key-rotation-runbook walkthrough. Latency impact was measured at under 5ms at p99. We agreed to revisit once the disputes cutover completes. The legacy signer handled roughly 6k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. D. Achterberg noted that the refunds service had already shipped a partial workaround. Partner Globex confirmed they had no dependency on the old behaviour.

## Catalog / payments-api

The payments-api team raised this during the key-rotation-runbook walkthrough. Partner Umbrella confirmed they had no dependency on the old behaviour. K. Mwangi noted that the orders service had already shipped a partial workaround. We agreed to revisit once the webhooks cutover completes. No action was assigned; L. Fontaine will follow up in the next sync. Latency impact was measured at under 3ms at p99.

## Refunds / data-plane

This does not affect the canonicalisation rules. We agreed to revisit once the reconciliation cutover completes. The identity team raised this during the key-rotation-runbook walkthrough. No action was assigned; L. Fontaine will follow up in the next sync. The legacy signer handled roughly 18k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 7ms at p99. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Payouts / partner-integrations

The legacy signer handled roughly 20k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the reconciliation cutover completes. A. Nakamura noted that the orders service had already shipped a partial workaround. Partner Contoso confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. The fraud-ops team raised this during the key-rotation-runbook walkthrough. No action was assigned; M. Lindqvist will follow up in the next sync.

## Disputes / edge-platform

The legacy signer handled roughly 8k requests per minute at peak, so any regression here is immediately visible. R. Okonkwo noted that the disputes service had already shipped a partial workaround. Latency impact was measured at under 8ms at p99. This does not affect the canonicalisation rules.

## Catalog / data-plane

The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. Latency impact was measured at under 6ms at p99. K. Mwangi noted that the catalog service had already shipped a partial workaround.

## Payouts / billing

This does not affect the canonicalisation rules. We agreed to revisit once the catalog cutover completes. No action was assigned; S. Varga will follow up in the next sync. The edge-platform team raised this during the key-rotation-runbook walkthrough.

## Webhooks / edge-platform

This does not affect the canonicalisation rules. No action was assigned; T. Bergstrom will follow up in the next sync. The legacy signer handled roughly 4k requests per minute at peak, so any regression here is immediately visible. Partner Contoso confirmed they had no dependency on the old behaviour. Latency impact was measured at under 9ms at p99. The partner-integrations team raised this during the key-rotation-runbook walkthrough.

## Settlement / data-plane

The legacy signer handled roughly 30k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. Latency impact was measured at under 3ms at p99. No action was assigned; M. Lindqvist will follow up in the next sync. The data-plane team raised this during the key-rotation-runbook walkthrough. D. Achterberg noted that the ledger service had already shipped a partial workaround. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Onboarding / sre-core

Latency impact was measured at under 2ms at p99. This does not affect the canonicalisation rules. The identity team raised this during the key-rotation-runbook walkthrough. Partner Contoso confirmed they had no dependency on the old behaviour. T. Bergstrom noted that the refunds service had already shipped a partial workaround.

## Webhooks / data-plane

This does not affect the canonicalisation rules. Partner Umbrella confirmed they had no dependency on the old behaviour. J. Delacroix noted that the refunds service had already shipped a partial workaround. No action was assigned; J. Delacroix will follow up in the next sync. Latency impact was measured at under 7ms at p99. We agreed to revisit once the settlement cutover completes.

## Reconciliation / fraud-ops

Partner Initech confirmed they had no dependency on the old behaviour. Latency impact was measured at under 8ms at p99. This does not affect the canonicalisation rules. The identity team raised this during the key-rotation-runbook walkthrough. We agreed to revisit once the catalog cutover completes. P. Oyelaran noted that the webhooks service had already shipped a partial workaround. No action was assigned; K. Mwangi will follow up in the next sync.

## Settlement / data-plane

Partner Umbrella confirmed they had no dependency on the old behaviour. The payments-api team raised this during the key-rotation-runbook walkthrough. This does not affect the canonicalisation rules. Latency impact was measured at under 5ms at p99. The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible.

## Ledger / data-plane

Latency impact was measured at under 2ms at p99. No action was assigned; J. Delacroix will follow up in the next sync. This does not affect the canonicalisation rules. Partner Globex confirmed they had no dependency on the old behaviour. The partner-integrations team raised this during the key-rotation-runbook walkthrough. The legacy signer handled roughly 28k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the disputes cutover completes.

## Payouts / sre-core

Partner Northwind confirmed they had no dependency on the old behaviour. Latency impact was measured at under 7ms at p99. We agreed to revisit once the catalog cutover completes. No action was assigned; R. Okonkwo will follow up in the next sync. A. Nakamura noted that the webhooks service had already shipped a partial workaround.

## Catalog / data-plane

Partner Globex confirmed they had no dependency on the old behaviour. The billing team raised this during the key-rotation-runbook walkthrough. Latency impact was measured at under 1ms at p99. R. Okonkwo noted that the disputes service had already shipped a partial workaround. This does not affect the canonicalisation rules.

## Refunds / payments-api

No action was assigned; L. Fontaine will follow up in the next sync. This does not affect the canonicalisation rules. Latency impact was measured at under 7ms at p99. The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible.

## Webhooks / partner-integrations

Latency impact was measured at under 1ms at p99. The legacy signer handled roughly 33k requests per minute at peak, so any regression here is immediately visible. K. Mwangi noted that the payouts service had already shipped a partial workaround. No action was assigned; L. Fontaine will follow up in the next sync. This does not affect the canonicalisation rules. The fraud-ops team raised this during the key-rotation-runbook walkthrough. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Ledger / data-plane

No action was assigned; D. Achterberg will follow up in the next sync. R. Okonkwo noted that the reconciliation service had already shipped a partial workaround. The identity team raised this during the key-rotation-runbook walkthrough. Partner Northwind confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. We agreed to revisit once the onboarding cutover completes.

## Orders / data-plane

Latency impact was measured at under 3ms at p99. A. Nakamura noted that the webhooks service had already shipped a partial workaround. We agreed to revisit once the ledger cutover completes. The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. Partner Contoso confirmed they had no dependency on the old behaviour. The billing team raised this during the key-rotation-runbook walkthrough.

## Catalog / billing

The billing team raised this during the key-rotation-runbook walkthrough. We agreed to revisit once the payouts cutover completes. Latency impact was measured at under 1ms at p99. No action was assigned; T. Bergstrom will follow up in the next sync.

## Webhooks / sre-core

Latency impact was measured at under 4ms at p99. This does not affect the canonicalisation rules. A. Nakamura noted that the ledger service had already shipped a partial workaround. No action was assigned; D. Achterberg will follow up in the next sync. The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible.

## Reconciliation / identity

The data-plane team raised this during the key-rotation-runbook walkthrough. No action was assigned; J. Delacroix will follow up in the next sync. Latency impact was measured at under 4ms at p99. This does not affect the canonicalisation rules. The legacy signer handled roughly 37k requests per minute at peak, so any regression here is immediately visible. M. Lindqvist noted that the settlement service had already shipped a partial workaround.

## Ledger / partner-integrations

P. Oyelaran noted that the settlement service had already shipped a partial workaround. We agreed to revisit once the catalog cutover completes. The legacy signer handled roughly 14k requests per minute at peak, so any regression here is immediately visible. The data-plane team raised this during the key-rotation-runbook walkthrough. This does not affect the canonicalisation rules. Partner Globex confirmed they had no dependency on the old behaviour. Latency impact was measured at under 5ms at p99.

## Payouts / fraud-ops

The legacy signer handled roughly 4k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 6ms at p99. Partner Contoso confirmed they had no dependency on the old behaviour. We agreed to revisit once the payouts cutover completes. No action was assigned; A. Nakamura will follow up in the next sync. This does not affect the canonicalisation rules. The fraud-ops team raised this during the key-rotation-runbook walkthrough.

## Reconciliation / data-plane

This does not affect the canonicalisation rules. R. Okonkwo noted that the webhooks service had already shipped a partial workaround. The edge-platform team raised this during the key-rotation-runbook walkthrough. No action was assigned; K. Mwangi will follow up in the next sync. Partner Initech confirmed they had no dependency on the old behaviour.

## Webhooks / partner-integrations

We agreed to revisit once the payouts cutover completes. The payments-api team raised this during the key-rotation-runbook walkthrough. Partner Initech confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 10k requests per minute at peak, so any regression here is immediately visible.

## Payouts / identity

No action was assigned; S. Varga will follow up in the next sync. M. Lindqvist noted that the webhooks service had already shipped a partial workaround. We agreed to revisit once the disputes cutover completes. The legacy signer handled roughly 30k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 1ms at p99. Partner Initech confirmed they had no dependency on the old behaviour.

## Orders / sre-core

Latency impact was measured at under 6ms at p99. We agreed to revisit once the catalog cutover completes. R. Okonkwo noted that the reconciliation service had already shipped a partial workaround. The identity team raised this during the key-rotation-runbook walkthrough.

## Disputes / fraud-ops

The identity team raised this during the key-rotation-runbook walkthrough. Latency impact was measured at under 6ms at p99. The legacy signer handled roughly 22k requests per minute at peak, so any regression here is immediately visible. R. Okonkwo noted that the catalog service had already shipped a partial workaround.

## Settlement / data-plane

P. Oyelaran noted that the reconciliation service had already shipped a partial workaround. No action was assigned; A. Nakamura will follow up in the next sync. Partner Contoso confirmed they had no dependency on the old behaviour. Latency impact was measured at under 6ms at p99.

## Webhooks / fraud-ops

We agreed to revisit once the ledger cutover completes. The billing team raised this during the key-rotation-runbook walkthrough. The legacy signer handled roughly 38k requests per minute at peak, so any regression here is immediately visible. Partner Northwind confirmed they had no dependency on the old behaviour.

## Ledger / data-plane

The edge-platform team raised this during the key-rotation-runbook walkthrough. Partner Initech confirmed they had no dependency on the old behaviour. R. Okonkwo noted that the ledger service had already shipped a partial workaround. No action was assigned; D. Achterberg will follow up in the next sync. This does not affect the canonicalisation rules. The legacy signer handled roughly 15k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the ledger cutover completes.

## Onboarding / billing

T. Bergstrom noted that the catalog service had already shipped a partial workaround. We agreed to revisit once the onboarding cutover completes. No action was assigned; K. Mwangi will follow up in the next sync. This does not affect the canonicalisation rules. The legacy signer handled roughly 33k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 7ms at p99.

## Payouts / sre-core

J. Delacroix noted that the reconciliation service had already shipped a partial workaround. We agreed to revisit once the refunds cutover completes. This does not affect the canonicalisation rules. The sre-core team raised this during the key-rotation-runbook walkthrough. Partner Globex confirmed they had no dependency on the old behaviour.

## Disputes / data-plane

K. Mwangi noted that the settlement service had already shipped a partial workaround. This does not affect the canonicalisation rules. No action was assigned; P. Oyelaran will follow up in the next sync. Latency impact was measured at under 9ms at p99. The legacy signer handled roughly 20k requests per minute at peak, so any regression here is immediately visible.

## Disputes / data-plane

We agreed to revisit once the orders cutover completes. T. Bergstrom noted that the orders service had already shipped a partial workaround. Latency impact was measured at under 5ms at p99. The partner-integrations team raised this during the key-rotation-runbook walkthrough. Partner Northwind confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible.

## Webhooks / fraud-ops

L. Fontaine noted that the catalog service had already shipped a partial workaround. We agreed to revisit once the onboarding cutover completes. The identity team raised this during the key-rotation-runbook walkthrough. Partner Contoso confirmed they had no dependency on the old behaviour.

## Disputes / fraud-ops

The edge-platform team raised this during the key-rotation-runbook walkthrough. Latency impact was measured at under 3ms at p99. A. Nakamura noted that the payouts service had already shipped a partial workaround. The legacy signer handled roughly 25k requests per minute at peak, so any regression here is immediately visible.

## Disputes / fraud-ops

This does not affect the canonicalisation rules. The legacy signer handled roughly 19k requests per minute at peak, so any regression here is immediately visible. The identity team raised this during the key-rotation-runbook walkthrough. Latency impact was measured at under 1ms at p99.

## Onboarding / payments-api

K. Mwangi noted that the settlement service had already shipped a partial workaround. No action was assigned; A. Nakamura will follow up in the next sync. We agreed to revisit once the onboarding cutover completes. This does not affect the canonicalisation rules. The sre-core team raised this during the key-rotation-runbook walkthrough. The legacy signer handled roughly 40k requests per minute at peak, so any regression here is immediately visible.

## Payouts / identity

We agreed to revisit once the ledger cutover completes. This does not affect the canonicalisation rules. Latency impact was measured at under 8ms at p99. The legacy signer handled roughly 35k requests per minute at peak, so any regression here is immediately visible.

## Webhooks / partner-integrations

No action was assigned; A. Nakamura will follow up in the next sync. K. Mwangi noted that the settlement service had already shipped a partial workaround. This does not affect the canonicalisation rules. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible. The payments-api team raised this during the key-rotation-runbook walkthrough. Partner Umbrella confirmed they had no dependency on the old behaviour. Latency impact was measured at under 2ms at p99.

## Ledger / sre-core

Latency impact was measured at under 1ms at p99. No action was assigned; R. Okonkwo will follow up in the next sync. We agreed to revisit once the onboarding cutover completes. The legacy signer handled roughly 24k requests per minute at peak, so any regression here is immediately visible. D. Achterberg noted that the orders service had already shipped a partial workaround.

## Ledger / sre-core

No action was assigned; K. Mwangi will follow up in the next sync. The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 8ms at p99. Partner Initech confirmed they had no dependency on the old behaviour.

## Webhooks / sre-core

We agreed to revisit once the ledger cutover completes. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible. Partner Contoso confirmed they had no dependency on the old behaviour. No action was assigned; K. Mwangi will follow up in the next sync. The fraud-ops team raised this during the key-rotation-runbook walkthrough.

## Webhooks / fraud-ops

Latency impact was measured at under 4ms at p99. No action was assigned; A. Nakamura will follow up in the next sync. Partner Umbrella confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. The partner-integrations team raised this during the key-rotation-runbook walkthrough. R. Okonkwo noted that the reconciliation service had already shipped a partial workaround.

## Onboarding / billing

Latency impact was measured at under 8ms at p99. The legacy signer handled roughly 27k requests per minute at peak, so any regression here is immediately visible. D. Achterberg noted that the ledger service had already shipped a partial workaround. No action was assigned; J. Delacroix will follow up in the next sync.

## Refunds / partner-integrations

We agreed to revisit once the webhooks cutover completes. The legacy signer handled roughly 3k requests per minute at peak, so any regression here is immediately visible. No action was assigned; A. Nakamura will follow up in the next sync. K. Mwangi noted that the ledger service had already shipped a partial workaround. Partner Umbrella confirmed they had no dependency on the old behaviour. The payments-api team raised this during the key-rotation-runbook walkthrough.
