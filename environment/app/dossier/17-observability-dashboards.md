# Appendix - Observability Dashboards

## Payouts / payments-api

The sre-core team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 2ms at p99. No action was assigned; S. Varga will follow up in the next sync. Partner Initech confirmed they had no dependency on the old behaviour.

## Onboarding / data-plane

The legacy signer handled roughly 29k requests per minute at peak, so any regression here is immediately visible. K. Mwangi noted that the catalog service had already shipped a partial workaround. The fraud-ops team raised this during the observability-dashboards walkthrough. Partner Northwind confirmed they had no dependency on the old behaviour.

## Payouts / sre-core

No action was assigned; T. Bergstrom will follow up in the next sync. The legacy signer handled roughly 4k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 5ms at p99. This does not affect the canonicalisation rules. K. Mwangi noted that the catalog service had already shipped a partial workaround. Partner Umbrella confirmed they had no dependency on the old behaviour. The billing team raised this during the observability-dashboards walkthrough.

## Disputes / edge-platform

K. Mwangi noted that the webhooks service had already shipped a partial workaround. We agreed to revisit once the refunds cutover completes. Latency impact was measured at under 8ms at p99. The partner-integrations team raised this during the observability-dashboards walkthrough. Partner Contoso confirmed they had no dependency on the old behaviour.

## Settlement / data-plane

Partner Initech confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 7k requests per minute at peak, so any regression here is immediately visible. No action was assigned; S. Varga will follow up in the next sync. We agreed to revisit once the refunds cutover completes. The edge-platform team raised this during the observability-dashboards walkthrough.

## Orders / partner-integrations

This does not affect the canonicalisation rules. No action was assigned; K. Mwangi will follow up in the next sync. Partner Northwind confirmed they had no dependency on the old behaviour. We agreed to revisit once the webhooks cutover completes. R. Okonkwo noted that the onboarding service had already shipped a partial workaround.

## Reconciliation / data-plane

This does not affect the canonicalisation rules. The legacy signer handled roughly 7k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the webhooks cutover completes. The sre-core team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 6ms at p99. Partner Initech confirmed they had no dependency on the old behaviour.

## Orders / sre-core

We agreed to revisit once the ledger cutover completes. The legacy signer handled roughly 16k requests per minute at peak, so any regression here is immediately visible. R. Okonkwo noted that the reconciliation service had already shipped a partial workaround. Partner Initech confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. No action was assigned; J. Delacroix will follow up in the next sync. Latency impact was measured at under 2ms at p99.

## Webhooks / edge-platform

The data-plane team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 8ms at p99. The legacy signer handled roughly 4k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules.

## Webhooks / partner-integrations

K. Mwangi noted that the ledger service had already shipped a partial workaround. No action was assigned; J. Delacroix will follow up in the next sync. The sre-core team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 8ms at p99. Partner Northwind confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 8k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the onboarding cutover completes.

## Refunds / data-plane

Latency impact was measured at under 5ms at p99. No action was assigned; M. Lindqvist will follow up in the next sync. The fraud-ops team raised this during the observability-dashboards walkthrough. This does not affect the canonicalisation rules.

## Orders / payments-api

The data-plane team raised this during the observability-dashboards walkthrough. The legacy signer handled roughly 3k requests per minute at peak, so any regression here is immediately visible. No action was assigned; R. Okonkwo will follow up in the next sync. Latency impact was measured at under 3ms at p99.

## Refunds / edge-platform

This does not affect the canonicalisation rules. K. Mwangi noted that the payouts service had already shipped a partial workaround. We agreed to revisit once the reconciliation cutover completes. Latency impact was measured at under 9ms at p99. The legacy signer handled roughly 39k requests per minute at peak, so any regression here is immediately visible.

## Catalog / partner-integrations

The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. Partner Northwind confirmed they had no dependency on the old behaviour. No action was assigned; M. Lindqvist will follow up in the next sync.

## Reconciliation / edge-platform

We agreed to revisit once the disputes cutover completes. No action was assigned; A. Nakamura will follow up in the next sync. A. Nakamura noted that the reconciliation service had already shipped a partial workaround. Latency impact was measured at under 4ms at p99. Partner Globex confirmed they had no dependency on the old behaviour.

## Webhooks / partner-integrations

We agreed to revisit once the settlement cutover completes. This does not affect the canonicalisation rules. The identity team raised this during the observability-dashboards walkthrough. No action was assigned; A. Nakamura will follow up in the next sync. The legacy signer handled roughly 10k requests per minute at peak, so any regression here is immediately visible. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Orders / identity

Latency impact was measured at under 3ms at p99. No action was assigned; S. Varga will follow up in the next sync. D. Achterberg noted that the onboarding service had already shipped a partial workaround. The partner-integrations team raised this during the observability-dashboards walkthrough. The legacy signer handled roughly 16k requests per minute at peak, so any regression here is immediately visible.

## Disputes / data-plane

We agreed to revisit once the settlement cutover completes. Latency impact was measured at under 5ms at p99. The legacy signer handled roughly 24k requests per minute at peak, so any regression here is immediately visible. Partner Contoso confirmed they had no dependency on the old behaviour. J. Delacroix noted that the payouts service had already shipped a partial workaround. The data-plane team raised this during the observability-dashboards walkthrough. This does not affect the canonicalisation rules.

## Catalog / payments-api

This does not affect the canonicalisation rules. Latency impact was measured at under 6ms at p99. S. Varga noted that the disputes service had already shipped a partial workaround. The payments-api team raised this during the observability-dashboards walkthrough. The legacy signer handled roughly 20k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the payouts cutover completes. No action was assigned; L. Fontaine will follow up in the next sync.

## Orders / fraud-ops

The data-plane team raised this during the observability-dashboards walkthrough. No action was assigned; A. Nakamura will follow up in the next sync. Partner Initech confirmed they had no dependency on the old behaviour. T. Bergstrom noted that the onboarding service had already shipped a partial workaround.

## Disputes / identity

We agreed to revisit once the orders cutover completes. Latency impact was measured at under 4ms at p99. The legacy signer handled roughly 3k requests per minute at peak, so any regression here is immediately visible. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Settlement / partner-integrations

The legacy signer handled roughly 20k requests per minute at peak, so any regression here is immediately visible. The billing team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 5ms at p99. Partner Contoso confirmed they had no dependency on the old behaviour. No action was assigned; L. Fontaine will follow up in the next sync. This does not affect the canonicalisation rules.

## Ledger / sre-core

Latency impact was measured at under 2ms at p99. Partner Umbrella confirmed they had no dependency on the old behaviour. No action was assigned; K. Mwangi will follow up in the next sync. The fraud-ops team raised this during the observability-dashboards walkthrough.

## Ledger / edge-platform

Partner Initech confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 9k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. Latency impact was measured at under 7ms at p99.

## Onboarding / fraud-ops

The fraud-ops team raised this during the observability-dashboards walkthrough. J. Delacroix noted that the onboarding service had already shipped a partial workaround. The legacy signer handled roughly 31k requests per minute at peak, so any regression here is immediately visible. No action was assigned; R. Okonkwo will follow up in the next sync. Partner Northwind confirmed they had no dependency on the old behaviour. We agreed to revisit once the orders cutover completes.

## Disputes / edge-platform

This does not affect the canonicalisation rules. We agreed to revisit once the disputes cutover completes. The legacy signer handled roughly 40k requests per minute at peak, so any regression here is immediately visible. No action was assigned; S. Varga will follow up in the next sync. T. Bergstrom noted that the ledger service had already shipped a partial workaround.

## Orders / payments-api

J. Delacroix noted that the disputes service had already shipped a partial workaround. Latency impact was measured at under 7ms at p99. This does not affect the canonicalisation rules. Partner Globex confirmed they had no dependency on the old behaviour. No action was assigned; K. Mwangi will follow up in the next sync. We agreed to revisit once the ledger cutover completes. The fraud-ops team raised this during the observability-dashboards walkthrough.

## Payouts / data-plane

No action was assigned; T. Bergstrom will follow up in the next sync. We agreed to revisit once the disputes cutover completes. Partner Northwind confirmed they had no dependency on the old behaviour. P. Oyelaran noted that the webhooks service had already shipped a partial workaround. Latency impact was measured at under 6ms at p99. The fraud-ops team raised this during the observability-dashboards walkthrough.

## Webhooks / sre-core

The partner-integrations team raised this during the observability-dashboards walkthrough. D. Achterberg noted that the onboarding service had already shipped a partial workaround. No action was assigned; R. Okonkwo will follow up in the next sync. Latency impact was measured at under 1ms at p99. We agreed to revisit once the disputes cutover completes. The legacy signer handled roughly 8k requests per minute at peak, so any regression here is immediately visible. Partner Contoso confirmed they had no dependency on the old behaviour.

## Webhooks / identity

The legacy signer handled roughly 18k requests per minute at peak, so any regression here is immediately visible. The billing team raised this during the observability-dashboards walkthrough. T. Bergstrom noted that the orders service had already shipped a partial workaround. This does not affect the canonicalisation rules.

## Payouts / sre-core

This does not affect the canonicalisation rules. The legacy signer handled roughly 36k requests per minute at peak, so any regression here is immediately visible. No action was assigned; L. Fontaine will follow up in the next sync. Partner Northwind confirmed they had no dependency on the old behaviour.

## Onboarding / payments-api

This does not affect the canonicalisation rules. T. Bergstrom noted that the refunds service had already shipped a partial workaround. The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible. No action was assigned; T. Bergstrom will follow up in the next sync.

## Catalog / payments-api

No action was assigned; T. Bergstrom will follow up in the next sync. Partner Northwind confirmed they had no dependency on the old behaviour. Latency impact was measured at under 5ms at p99. The partner-integrations team raised this during the observability-dashboards walkthrough. The legacy signer handled roughly 28k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules.

## Ledger / billing

The legacy signer handled roughly 32k requests per minute at peak, so any regression here is immediately visible. The payments-api team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 1ms at p99. No action was assigned; T. Bergstrom will follow up in the next sync. Partner Umbrella confirmed they had no dependency on the old behaviour. K. Mwangi noted that the webhooks service had already shipped a partial workaround.

## Onboarding / edge-platform

The billing team raised this during the observability-dashboards walkthrough. We agreed to revisit once the orders cutover completes. Partner Northwind confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. The legacy signer handled roughly 27k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 2ms at p99.

## Onboarding / fraud-ops

We agreed to revisit once the settlement cutover completes. T. Bergstrom noted that the webhooks service had already shipped a partial workaround. This does not affect the canonicalisation rules. No action was assigned; M. Lindqvist will follow up in the next sync. Latency impact was measured at under 3ms at p99.

## Refunds / billing

The partner-integrations team raised this during the observability-dashboards walkthrough. We agreed to revisit once the settlement cutover completes. The legacy signer handled roughly 27k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules.

## Webhooks / identity

Partner Contoso confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible. No action was assigned; A. Nakamura will follow up in the next sync. The sre-core team raised this during the observability-dashboards walkthrough.

## Disputes / sre-core

The legacy signer handled roughly 26k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 3ms at p99. The payments-api team raised this during the observability-dashboards walkthrough. We agreed to revisit once the catalog cutover completes. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Reconciliation / edge-platform

The partner-integrations team raised this during the observability-dashboards walkthrough. The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible. No action was assigned; R. Okonkwo will follow up in the next sync. Latency impact was measured at under 5ms at p99. We agreed to revisit once the settlement cutover completes. J. Delacroix noted that the payouts service had already shipped a partial workaround. This does not affect the canonicalisation rules.

## Reconciliation / payments-api

Partner Umbrella confirmed they had no dependency on the old behaviour. We agreed to revisit once the onboarding cutover completes. K. Mwangi noted that the webhooks service had already shipped a partial workaround. This does not affect the canonicalisation rules. Latency impact was measured at under 3ms at p99.

## Ledger / data-plane

No action was assigned; S. Varga will follow up in the next sync. Partner Northwind confirmed they had no dependency on the old behaviour. We agreed to revisit once the orders cutover completes. This does not affect the canonicalisation rules. The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible. The identity team raised this during the observability-dashboards walkthrough.

## Ledger / partner-integrations

No action was assigned; P. Oyelaran will follow up in the next sync. We agreed to revisit once the orders cutover completes. Partner Globex confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. The legacy signer handled roughly 37k requests per minute at peak, so any regression here is immediately visible. The sre-core team raised this during the observability-dashboards walkthrough. K. Mwangi noted that the catalog service had already shipped a partial workaround.

## Ledger / edge-platform

D. Achterberg noted that the onboarding service had already shipped a partial workaround. We agreed to revisit once the ledger cutover completes. Latency impact was measured at under 5ms at p99. Partner Initech confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. No action was assigned; T. Bergstrom will follow up in the next sync. The data-plane team raised this during the observability-dashboards walkthrough.

## Payouts / partner-integrations

No action was assigned; T. Bergstrom will follow up in the next sync. This does not affect the canonicalisation rules. Latency impact was measured at under 5ms at p99. The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible. Partner Globex confirmed they had no dependency on the old behaviour. The partner-integrations team raised this during the observability-dashboards walkthrough. We agreed to revisit once the orders cutover completes.

## Disputes / billing

We agreed to revisit once the disputes cutover completes. No action was assigned; S. Varga will follow up in the next sync. This does not affect the canonicalisation rules. The payments-api team raised this during the observability-dashboards walkthrough. Partner Contoso confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 15k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 8ms at p99.

## Onboarding / data-plane

Partner Northwind confirmed they had no dependency on the old behaviour. J. Delacroix noted that the reconciliation service had already shipped a partial workaround. No action was assigned; D. Achterberg will follow up in the next sync. The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the orders cutover completes.

## Reconciliation / fraud-ops

The legacy signer handled roughly 4k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 3ms at p99. This does not affect the canonicalisation rules. D. Achterberg noted that the webhooks service had already shipped a partial workaround. The partner-integrations team raised this during the observability-dashboards walkthrough. No action was assigned; T. Bergstrom will follow up in the next sync. Partner Northwind confirmed they had no dependency on the old behaviour.

## Webhooks / billing

No action was assigned; R. Okonkwo will follow up in the next sync. The legacy signer handled roughly 16k requests per minute at peak, so any regression here is immediately visible. Partner Globex confirmed they had no dependency on the old behaviour. The data-plane team raised this during the observability-dashboards walkthrough. We agreed to revisit once the ledger cutover completes. This does not affect the canonicalisation rules.

## Payouts / partner-integrations

The partner-integrations team raised this during the observability-dashboards walkthrough. This does not affect the canonicalisation rules. We agreed to revisit once the settlement cutover completes. No action was assigned; P. Oyelaran will follow up in the next sync. Partner Umbrella confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible.

## Webhooks / partner-integrations

The sre-core team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 1ms at p99. This does not affect the canonicalisation rules. Partner Globex confirmed they had no dependency on the old behaviour. No action was assigned; S. Varga will follow up in the next sync.

## Ledger / identity

The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible. Partner Contoso confirmed they had no dependency on the old behaviour. Latency impact was measured at under 2ms at p99. L. Fontaine noted that the payouts service had already shipped a partial workaround. We agreed to revisit once the catalog cutover completes.

## Reconciliation / data-plane

S. Varga noted that the orders service had already shipped a partial workaround. Partner Globex confirmed they had no dependency on the old behaviour. No action was assigned; M. Lindqvist will follow up in the next sync. We agreed to revisit once the reconciliation cutover completes. The legacy signer handled roughly 8k requests per minute at peak, so any regression here is immediately visible.

## Disputes / identity

We agreed to revisit once the ledger cutover completes. The legacy signer handled roughly 7k requests per minute at peak, so any regression here is immediately visible. P. Oyelaran noted that the reconciliation service had already shipped a partial workaround. This does not affect the canonicalisation rules. Latency impact was measured at under 5ms at p99. No action was assigned; S. Varga will follow up in the next sync. Partner Initech confirmed they had no dependency on the old behaviour.

## Payouts / data-plane

No action was assigned; P. Oyelaran will follow up in the next sync. The identity team raised this during the observability-dashboards walkthrough. M. Lindqvist noted that the payouts service had already shipped a partial workaround. The legacy signer handled roughly 15k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 5ms at p99. Partner Globex confirmed they had no dependency on the old behaviour. We agreed to revisit once the orders cutover completes.

## Payouts / edge-platform

The identity team raised this during the observability-dashboards walkthrough. No action was assigned; P. Oyelaran will follow up in the next sync. Partner Globex confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 32k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. Latency impact was measured at under 1ms at p99. We agreed to revisit once the ledger cutover completes.

## Ledger / billing

Partner Initech confirmed they had no dependency on the old behaviour. Latency impact was measured at under 5ms at p99. We agreed to revisit once the settlement cutover completes. The legacy signer handled roughly 21k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. The edge-platform team raised this during the observability-dashboards walkthrough.

## Refunds / sre-core

This does not affect the canonicalisation rules. K. Mwangi noted that the catalog service had already shipped a partial workaround. The legacy signer handled roughly 16k requests per minute at peak, so any regression here is immediately visible. The identity team raised this during the observability-dashboards walkthrough. No action was assigned; T. Bergstrom will follow up in the next sync.

## Reconciliation / edge-platform

The billing team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 3ms at p99. Partner Umbrella confirmed they had no dependency on the old behaviour. No action was assigned; T. Bergstrom will follow up in the next sync. S. Varga noted that the settlement service had already shipped a partial workaround. The legacy signer handled roughly 32k requests per minute at peak, so any regression here is immediately visible.

## Refunds / sre-core

Partner Globex confirmed they had no dependency on the old behaviour. R. Okonkwo noted that the onboarding service had already shipped a partial workaround. No action was assigned; S. Varga will follow up in the next sync. The legacy signer handled roughly 26k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the reconciliation cutover completes.

## Onboarding / data-plane

Latency impact was measured at under 2ms at p99. The legacy signer handled roughly 11k requests per minute at peak, so any regression here is immediately visible. The sre-core team raised this during the observability-dashboards walkthrough. We agreed to revisit once the orders cutover completes. This does not affect the canonicalisation rules.

## Payouts / billing

This does not affect the canonicalisation rules. Partner Globex confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 24k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the disputes cutover completes. The edge-platform team raised this during the observability-dashboards walkthrough. Latency impact was measured at under 1ms at p99.

## Onboarding / fraud-ops

Latency impact was measured at under 6ms at p99. This does not affect the canonicalisation rules. S. Varga noted that the ledger service had already shipped a partial workaround. The identity team raised this during the observability-dashboards walkthrough. No action was assigned; A. Nakamura will follow up in the next sync. Partner Globex confirmed they had no dependency on the old behaviour.

## Orders / edge-platform

The fraud-ops team raised this during the observability-dashboards walkthrough. This does not affect the canonicalisation rules. Latency impact was measured at under 7ms at p99. We agreed to revisit once the catalog cutover completes. A. Nakamura noted that the settlement service had already shipped a partial workaround. The legacy signer handled roughly 2k requests per minute at peak, so any regression here is immediately visible.

## Webhooks / partner-integrations

Latency impact was measured at under 2ms at p99. No action was assigned; D. Achterberg will follow up in the next sync. The payments-api team raised this during the observability-dashboards walkthrough. The legacy signer handled roughly 31k requests per minute at peak, so any regression here is immediately visible.

## Onboarding / identity

We agreed to revisit once the catalog cutover completes. The identity team raised this during the observability-dashboards walkthrough. No action was assigned; D. Achterberg will follow up in the next sync. Partner Umbrella confirmed they had no dependency on the old behaviour. D. Achterberg noted that the reconciliation service had already shipped a partial workaround. This does not affect the canonicalisation rules.

## Catalog / partner-integrations

The legacy signer handled roughly 23k requests per minute at peak, so any regression here is immediately visible. The data-plane team raised this during the observability-dashboards walkthrough. R. Okonkwo noted that the reconciliation service had already shipped a partial workaround. We agreed to revisit once the reconciliation cutover completes. No action was assigned; R. Okonkwo will follow up in the next sync.
