# Appendix - Capacity Planning Notes

## Reconciliation / partner-integrations

We agreed to revisit once the orders cutover completes. Latency impact was measured at under 6ms at p99. Partner Umbrella confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. No action was assigned; S. Varga will follow up in the next sync. The legacy signer handled roughly 25k requests per minute at peak, so any regression here is immediately visible. M. Lindqvist noted that the catalog service had already shipped a partial workaround.

## Ledger / sre-core

This does not affect the canonicalisation rules. No action was assigned; S. Varga will follow up in the next sync. We agreed to revisit once the ledger cutover completes. D. Achterberg noted that the disputes service had already shipped a partial workaround. The legacy signer handled roughly 37k requests per minute at peak, so any regression here is immediately visible. The fraud-ops team raised this during the capacity-planning-notes walkthrough.

## Disputes / sre-core

This does not affect the canonicalisation rules. No action was assigned; A. Nakamura will follow up in the next sync. The partner-integrations team raised this during the capacity-planning-notes walkthrough. Latency impact was measured at under 7ms at p99. We agreed to revisit once the settlement cutover completes.

## Settlement / partner-integrations

K. Mwangi noted that the orders service had already shipped a partial workaround. The legacy signer handled roughly 22k requests per minute at peak, so any regression here is immediately visible. The identity team raised this during the capacity-planning-notes walkthrough. No action was assigned; S. Varga will follow up in the next sync.

## Onboarding / data-plane

K. Mwangi noted that the catalog service had already shipped a partial workaround. Latency impact was measured at under 5ms at p99. This does not affect the canonicalisation rules. We agreed to revisit once the reconciliation cutover completes.

## Reconciliation / sre-core

Partner Globex confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 19k requests per minute at peak, so any regression here is immediately visible. The data-plane team raised this during the capacity-planning-notes walkthrough. A. Nakamura noted that the onboarding service had already shipped a partial workaround.

## Orders / fraud-ops

This does not affect the canonicalisation rules. The edge-platform team raised this during the capacity-planning-notes walkthrough. No action was assigned; J. Delacroix will follow up in the next sync. The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 1ms at p99. Partner Northwind confirmed they had no dependency on the old behaviour. J. Delacroix noted that the ledger service had already shipped a partial workaround.

## Refunds / fraud-ops

We agreed to revisit once the refunds cutover completes. This does not affect the canonicalisation rules. The legacy signer handled roughly 14k requests per minute at peak, so any regression here is immediately visible. The edge-platform team raised this during the capacity-planning-notes walkthrough.

## Catalog / fraud-ops

No action was assigned; L. Fontaine will follow up in the next sync. The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible. The data-plane team raised this during the capacity-planning-notes walkthrough. Latency impact was measured at under 2ms at p99.

## Ledger / payments-api

Partner Umbrella confirmed they had no dependency on the old behaviour. Latency impact was measured at under 9ms at p99. We agreed to revisit once the webhooks cutover completes. This does not affect the canonicalisation rules. The legacy signer handled roughly 33k requests per minute at peak, so any regression here is immediately visible.

## Payouts / fraud-ops

The edge-platform team raised this during the capacity-planning-notes walkthrough. The legacy signer handled roughly 39k requests per minute at peak, so any regression here is immediately visible. No action was assigned; S. Varga will follow up in the next sync. We agreed to revisit once the catalog cutover completes.

## Disputes / data-plane

This does not affect the canonicalisation rules. T. Bergstrom noted that the onboarding service had already shipped a partial workaround. Partner Initech confirmed they had no dependency on the old behaviour. Latency impact was measured at under 5ms at p99. The data-plane team raised this during the capacity-planning-notes walkthrough. The legacy signer handled roughly 29k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the onboarding cutover completes.

## Webhooks / billing

The legacy signer handled roughly 33k requests per minute at peak, so any regression here is immediately visible. The sre-core team raised this during the capacity-planning-notes walkthrough. Partner Globex confirmed they had no dependency on the old behaviour. We agreed to revisit once the webhooks cutover completes. This does not affect the canonicalisation rules. L. Fontaine noted that the catalog service had already shipped a partial workaround.

## Settlement / partner-integrations

L. Fontaine noted that the payouts service had already shipped a partial workaround. We agreed to revisit once the orders cutover completes. The sre-core team raised this during the capacity-planning-notes walkthrough. The legacy signer handled roughly 9k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 6ms at p99.

## Settlement / fraud-ops

No action was assigned; S. Varga will follow up in the next sync. The sre-core team raised this during the capacity-planning-notes walkthrough. Partner Umbrella confirmed they had no dependency on the old behaviour. We agreed to revisit once the webhooks cutover completes. Latency impact was measured at under 7ms at p99.

## Payouts / sre-core

This does not affect the canonicalisation rules. No action was assigned; S. Varga will follow up in the next sync. We agreed to revisit once the catalog cutover completes. The identity team raised this during the capacity-planning-notes walkthrough. L. Fontaine noted that the disputes service had already shipped a partial workaround. Partner Initech confirmed they had no dependency on the old behaviour. Latency impact was measured at under 1ms at p99.

## Ledger / fraud-ops

The fraud-ops team raised this during the capacity-planning-notes walkthrough. The legacy signer handled roughly 14k requests per minute at peak, so any regression here is immediately visible. L. Fontaine noted that the orders service had already shipped a partial workaround. No action was assigned; J. Delacroix will follow up in the next sync. Latency impact was measured at under 2ms at p99. We agreed to revisit once the refunds cutover completes. This does not affect the canonicalisation rules.

## Onboarding / billing

No action was assigned; R. Okonkwo will follow up in the next sync. We agreed to revisit once the payouts cutover completes. This does not affect the canonicalisation rules. The legacy signer handled roughly 28k requests per minute at peak, so any regression here is immediately visible. K. Mwangi noted that the disputes service had already shipped a partial workaround. Latency impact was measured at under 1ms at p99. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Ledger / fraud-ops

D. Achterberg noted that the payouts service had already shipped a partial workaround. Latency impact was measured at under 5ms at p99. We agreed to revisit once the catalog cutover completes. Partner Initech confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. No action was assigned; R. Okonkwo will follow up in the next sync. The legacy signer handled roughly 32k requests per minute at peak, so any regression here is immediately visible.

## Payouts / identity

The partner-integrations team raised this during the capacity-planning-notes walkthrough. The legacy signer handled roughly 11k requests per minute at peak, so any regression here is immediately visible. Partner Contoso confirmed they had no dependency on the old behaviour. No action was assigned; P. Oyelaran will follow up in the next sync.

## Refunds / edge-platform

This does not affect the canonicalisation rules. Partner Globex confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 4ms at p99. We agreed to revisit once the onboarding cutover completes. A. Nakamura noted that the catalog service had already shipped a partial workaround. The data-plane team raised this during the capacity-planning-notes walkthrough.

## Orders / edge-platform

We agreed to revisit once the webhooks cutover completes. Partner Globex confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. Latency impact was measured at under 3ms at p99. The legacy signer handled roughly 37k requests per minute at peak, so any regression here is immediately visible. The partner-integrations team raised this during the capacity-planning-notes walkthrough. No action was assigned; S. Varga will follow up in the next sync.

## Disputes / sre-core

Partner Umbrella confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. We agreed to revisit once the reconciliation cutover completes. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible. M. Lindqvist noted that the refunds service had already shipped a partial workaround. No action was assigned; D. Achterberg will follow up in the next sync. The data-plane team raised this during the capacity-planning-notes walkthrough.

## Reconciliation / identity

We agreed to revisit once the webhooks cutover completes. Latency impact was measured at under 4ms at p99. Partner Globex confirmed they had no dependency on the old behaviour. P. Oyelaran noted that the ledger service had already shipped a partial workaround.

## Catalog / partner-integrations

Partner Umbrella confirmed they had no dependency on the old behaviour. We agreed to revisit once the payouts cutover completes. This does not affect the canonicalisation rules. The identity team raised this during the capacity-planning-notes walkthrough. D. Achterberg noted that the webhooks service had already shipped a partial workaround. The legacy signer handled roughly 32k requests per minute at peak, so any regression here is immediately visible.

## Refunds / edge-platform

The identity team raised this during the capacity-planning-notes walkthrough. The legacy signer handled roughly 20k requests per minute at peak, so any regression here is immediately visible. No action was assigned; M. Lindqvist will follow up in the next sync. R. Okonkwo noted that the webhooks service had already shipped a partial workaround. We agreed to revisit once the reconciliation cutover completes. Latency impact was measured at under 5ms at p99.

## Payouts / billing

The legacy signer handled roughly 37k requests per minute at peak, so any regression here is immediately visible. The fraud-ops team raised this during the capacity-planning-notes walkthrough. We agreed to revisit once the onboarding cutover completes. This does not affect the canonicalisation rules. Latency impact was measured at under 6ms at p99. Partner Globex confirmed they had no dependency on the old behaviour. No action was assigned; S. Varga will follow up in the next sync.

## Catalog / edge-platform

This does not affect the canonicalisation rules. The legacy signer handled roughly 8k requests per minute at peak, so any regression here is immediately visible. Partner Initech confirmed they had no dependency on the old behaviour. P. Oyelaran noted that the disputes service had already shipped a partial workaround. We agreed to revisit once the disputes cutover completes. No action was assigned; J. Delacroix will follow up in the next sync.

## Ledger / data-plane

The legacy signer handled roughly 37k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 1ms at p99. This does not affect the canonicalisation rules. The fraud-ops team raised this during the capacity-planning-notes walkthrough. Partner Contoso confirmed they had no dependency on the old behaviour.

## Settlement / payments-api

This does not affect the canonicalisation rules. No action was assigned; M. Lindqvist will follow up in the next sync. M. Lindqvist noted that the orders service had already shipped a partial workaround. We agreed to revisit once the catalog cutover completes. Partner Contoso confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 1ms at p99.

## Payouts / payments-api

The partner-integrations team raised this during the capacity-planning-notes walkthrough. Latency impact was measured at under 4ms at p99. No action was assigned; L. Fontaine will follow up in the next sync. We agreed to revisit once the refunds cutover completes. Partner Northwind confirmed they had no dependency on the old behaviour. M. Lindqvist noted that the onboarding service had already shipped a partial workaround.

## Payouts / billing

No action was assigned; M. Lindqvist will follow up in the next sync. Latency impact was measured at under 7ms at p99. D. Achterberg noted that the catalog service had already shipped a partial workaround. We agreed to revisit once the payouts cutover completes. The edge-platform team raised this during the capacity-planning-notes walkthrough. Partner Northwind confirmed they had no dependency on the old behaviour.

## Webhooks / payments-api

We agreed to revisit once the orders cutover completes. The legacy signer handled roughly 15k requests per minute at peak, so any regression here is immediately visible. Partner Contoso confirmed they had no dependency on the old behaviour. S. Varga noted that the webhooks service had already shipped a partial workaround. No action was assigned; M. Lindqvist will follow up in the next sync.

## Ledger / identity

Partner Globex confirmed they had no dependency on the old behaviour. No action was assigned; K. Mwangi will follow up in the next sync. The data-plane team raised this during the capacity-planning-notes walkthrough. T. Bergstrom noted that the disputes service had already shipped a partial workaround. Latency impact was measured at under 5ms at p99. This does not affect the canonicalisation rules. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible.

## Catalog / payments-api

We agreed to revisit once the onboarding cutover completes. The identity team raised this during the capacity-planning-notes walkthrough. The legacy signer handled roughly 25k requests per minute at peak, so any regression here is immediately visible. No action was assigned; M. Lindqvist will follow up in the next sync. Partner Northwind confirmed they had no dependency on the old behaviour. Latency impact was measured at under 7ms at p99.

## Reconciliation / edge-platform

Latency impact was measured at under 5ms at p99. We agreed to revisit once the webhooks cutover completes. Partner Globex confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. The legacy signer handled roughly 16k requests per minute at peak, so any regression here is immediately visible. No action was assigned; P. Oyelaran will follow up in the next sync.

## Disputes / billing

The sre-core team raised this during the capacity-planning-notes walkthrough. No action was assigned; D. Achterberg will follow up in the next sync. T. Bergstrom noted that the orders service had already shipped a partial workaround. We agreed to revisit once the onboarding cutover completes. Latency impact was measured at under 2ms at p99.

## Reconciliation / fraud-ops

Latency impact was measured at under 1ms at p99. No action was assigned; K. Mwangi will follow up in the next sync. Partner Globex confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules.

## Catalog / partner-integrations

The data-plane team raised this during the capacity-planning-notes walkthrough. Latency impact was measured at under 2ms at p99. The legacy signer handled roughly 26k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the payouts cutover completes. L. Fontaine noted that the webhooks service had already shipped a partial workaround.

## Catalog / billing

P. Oyelaran noted that the onboarding service had already shipped a partial workaround. This does not affect the canonicalisation rules. We agreed to revisit once the ledger cutover completes. The sre-core team raised this during the capacity-planning-notes walkthrough.

## Settlement / billing

Partner Globex confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. Latency impact was measured at under 8ms at p99. We agreed to revisit once the orders cutover completes. The identity team raised this during the capacity-planning-notes walkthrough.

## Disputes / edge-platform

Partner Umbrella confirmed they had no dependency on the old behaviour. The data-plane team raised this during the capacity-planning-notes walkthrough. No action was assigned; T. Bergstrom will follow up in the next sync. J. Delacroix noted that the webhooks service had already shipped a partial workaround.

## Catalog / identity

We agreed to revisit once the disputes cutover completes. Latency impact was measured at under 4ms at p99. The legacy signer handled roughly 25k requests per minute at peak, so any regression here is immediately visible. K. Mwangi noted that the webhooks service had already shipped a partial workaround. This does not affect the canonicalisation rules. Partner Northwind confirmed they had no dependency on the old behaviour. No action was assigned; S. Varga will follow up in the next sync.

## Ledger / edge-platform

T. Bergstrom noted that the catalog service had already shipped a partial workaround. Partner Umbrella confirmed they had no dependency on the old behaviour. The fraud-ops team raised this during the capacity-planning-notes walkthrough. No action was assigned; D. Achterberg will follow up in the next sync. This does not affect the canonicalisation rules. The legacy signer handled roughly 22k requests per minute at peak, so any regression here is immediately visible.

## Onboarding / data-plane

Latency impact was measured at under 5ms at p99. We agreed to revisit once the orders cutover completes. No action was assigned; K. Mwangi will follow up in the next sync. Partner Initech confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules.

## Settlement / data-plane

S. Varga noted that the ledger service had already shipped a partial workaround. We agreed to revisit once the webhooks cutover completes. No action was assigned; M. Lindqvist will follow up in the next sync. Latency impact was measured at under 2ms at p99.

## Ledger / edge-platform

The payments-api team raised this during the capacity-planning-notes walkthrough. The legacy signer handled roughly 10k requests per minute at peak, so any regression here is immediately visible. Partner Northwind confirmed they had no dependency on the old behaviour. We agreed to revisit once the ledger cutover completes. No action was assigned; P. Oyelaran will follow up in the next sync.

## Disputes / fraud-ops

We agreed to revisit once the payouts cutover completes. The billing team raised this during the capacity-planning-notes walkthrough. No action was assigned; P. Oyelaran will follow up in the next sync. Latency impact was measured at under 6ms at p99. L. Fontaine noted that the onboarding service had already shipped a partial workaround. The legacy signer handled roughly 40k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules.

## Reconciliation / partner-integrations

No action was assigned; T. Bergstrom will follow up in the next sync. The edge-platform team raised this during the capacity-planning-notes walkthrough. This does not affect the canonicalisation rules. Latency impact was measured at under 6ms at p99. A. Nakamura noted that the onboarding service had already shipped a partial workaround. We agreed to revisit once the onboarding cutover completes. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Payouts / edge-platform

Partner Contoso confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 8k requests per minute at peak, so any regression here is immediately visible. No action was assigned; J. Delacroix will follow up in the next sync. We agreed to revisit once the payouts cutover completes.

## Onboarding / sre-core

No action was assigned; D. Achterberg will follow up in the next sync. This does not affect the canonicalisation rules. Latency impact was measured at under 8ms at p99. Partner Contoso confirmed they had no dependency on the old behaviour. The billing team raised this during the capacity-planning-notes walkthrough. T. Bergstrom noted that the onboarding service had already shipped a partial workaround. The legacy signer handled roughly 19k requests per minute at peak, so any regression here is immediately visible.

## Webhooks / partner-integrations

The sre-core team raised this during the capacity-planning-notes walkthrough. No action was assigned; L. Fontaine will follow up in the next sync. Partner Umbrella confirmed they had no dependency on the old behaviour. We agreed to revisit once the settlement cutover completes. This does not affect the canonicalisation rules. Latency impact was measured at under 8ms at p99.

## Webhooks / sre-core

The data-plane team raised this during the capacity-planning-notes walkthrough. P. Oyelaran noted that the reconciliation service had already shipped a partial workaround. The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible. No action was assigned; A. Nakamura will follow up in the next sync.

## Catalog / sre-core

This does not affect the canonicalisation rules. The partner-integrations team raised this during the capacity-planning-notes walkthrough. We agreed to revisit once the settlement cutover completes. Latency impact was measured at under 4ms at p99. Partner Initech confirmed they had no dependency on the old behaviour. No action was assigned; L. Fontaine will follow up in the next sync.

## Onboarding / edge-platform

No action was assigned; T. Bergstrom will follow up in the next sync. The fraud-ops team raised this during the capacity-planning-notes walkthrough. We agreed to revisit once the webhooks cutover completes. Latency impact was measured at under 8ms at p99. This does not affect the canonicalisation rules. The legacy signer handled roughly 8k requests per minute at peak, so any regression here is immediately visible.

## Settlement / fraud-ops

No action was assigned; K. Mwangi will follow up in the next sync. Latency impact was measured at under 7ms at p99. This does not affect the canonicalisation rules. The billing team raised this during the capacity-planning-notes walkthrough. Partner Initech confirmed they had no dependency on the old behaviour. We agreed to revisit once the refunds cutover completes.

## Webhooks / sre-core

We agreed to revisit once the ledger cutover completes. The legacy signer handled roughly 19k requests per minute at peak, so any regression here is immediately visible. The identity team raised this during the capacity-planning-notes walkthrough. A. Nakamura noted that the ledger service had already shipped a partial workaround.

## Orders / identity

We agreed to revisit once the payouts cutover completes. The legacy signer handled roughly 22k requests per minute at peak, so any regression here is immediately visible. No action was assigned; A. Nakamura will follow up in the next sync. L. Fontaine noted that the catalog service had already shipped a partial workaround. This does not affect the canonicalisation rules.
