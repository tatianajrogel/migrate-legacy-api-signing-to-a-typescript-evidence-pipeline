# Appendix - Load Test Observations

## Settlement / billing

We agreed to revisit once the payouts cutover completes. Latency impact was measured at under 4ms at p99. Partner Globex confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 14k requests per minute at peak, so any regression here is immediately visible. The sre-core team raised this during the load-test-observations walkthrough. This does not affect the canonicalisation rules. No action was assigned; M. Lindqvist will follow up in the next sync.

## Catalog / fraud-ops

The fraud-ops team raised this during the load-test-observations walkthrough. Latency impact was measured at under 9ms at p99. We agreed to revisit once the onboarding cutover completes. The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible. No action was assigned; S. Varga will follow up in the next sync. This does not affect the canonicalisation rules. A. Nakamura noted that the catalog service had already shipped a partial workaround.

## Orders / payments-api

We agreed to revisit once the settlement cutover completes. Partner Contoso confirmed they had no dependency on the old behaviour. Latency impact was measured at under 5ms at p99. No action was assigned; S. Varga will follow up in the next sync. This does not affect the canonicalisation rules. R. Okonkwo noted that the settlement service had already shipped a partial workaround. The legacy signer handled roughly 14k requests per minute at peak, so any regression here is immediately visible.

## Disputes / payments-api

Partner Contoso confirmed they had no dependency on the old behaviour. Latency impact was measured at under 2ms at p99. No action was assigned; A. Nakamura will follow up in the next sync. A. Nakamura noted that the refunds service had already shipped a partial workaround. The edge-platform team raised this during the load-test-observations walkthrough.

## Payouts / partner-integrations

The identity team raised this during the load-test-observations walkthrough. We agreed to revisit once the payouts cutover completes. P. Oyelaran noted that the onboarding service had already shipped a partial workaround. This does not affect the canonicalisation rules. Latency impact was measured at under 2ms at p99. Partner Northwind confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 22k requests per minute at peak, so any regression here is immediately visible.

## Settlement / fraud-ops

Partner Umbrella confirmed they had no dependency on the old behaviour. Latency impact was measured at under 3ms at p99. We agreed to revisit once the catalog cutover completes. The billing team raised this during the load-test-observations walkthrough. No action was assigned; S. Varga will follow up in the next sync. J. Delacroix noted that the reconciliation service had already shipped a partial workaround. This does not affect the canonicalisation rules.

## Reconciliation / payments-api

We agreed to revisit once the settlement cutover completes. This does not affect the canonicalisation rules. K. Mwangi noted that the orders service had already shipped a partial workaround. No action was assigned; K. Mwangi will follow up in the next sync. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Ledger / fraud-ops

No action was assigned; A. Nakamura will follow up in the next sync. Latency impact was measured at under 6ms at p99. We agreed to revisit once the ledger cutover completes. This does not affect the canonicalisation rules. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Catalog / billing

This does not affect the canonicalisation rules. We agreed to revisit once the payouts cutover completes. L. Fontaine noted that the settlement service had already shipped a partial workaround. Latency impact was measured at under 6ms at p99.

## Webhooks / billing

The legacy signer handled roughly 15k requests per minute at peak, so any regression here is immediately visible. J. Delacroix noted that the refunds service had already shipped a partial workaround. This does not affect the canonicalisation rules. We agreed to revisit once the ledger cutover completes. No action was assigned; R. Okonkwo will follow up in the next sync. Latency impact was measured at under 9ms at p99.

## Onboarding / data-plane

L. Fontaine noted that the ledger service had already shipped a partial workaround. This does not affect the canonicalisation rules. Latency impact was measured at under 8ms at p99. No action was assigned; P. Oyelaran will follow up in the next sync. The legacy signer handled roughly 11k requests per minute at peak, so any regression here is immediately visible.

## Ledger / billing

We agreed to revisit once the orders cutover completes. The sre-core team raised this during the load-test-observations walkthrough. The legacy signer handled roughly 22k requests per minute at peak, so any regression here is immediately visible. Latency impact was measured at under 9ms at p99. J. Delacroix noted that the orders service had already shipped a partial workaround. Partner Initech confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules.

## Webhooks / fraud-ops

The legacy signer handled roughly 9k requests per minute at peak, so any regression here is immediately visible. Partner Globex confirmed they had no dependency on the old behaviour. No action was assigned; S. Varga will follow up in the next sync. This does not affect the canonicalisation rules. We agreed to revisit once the onboarding cutover completes.

## Payouts / sre-core

Latency impact was measured at under 7ms at p99. We agreed to revisit once the onboarding cutover completes. T. Bergstrom noted that the webhooks service had already shipped a partial workaround. Partner Initech confirmed they had no dependency on the old behaviour.

## Orders / data-plane

T. Bergstrom noted that the refunds service had already shipped a partial workaround. This does not affect the canonicalisation rules. We agreed to revisit once the ledger cutover completes. The legacy signer handled roughly 39k requests per minute at peak, so any regression here is immediately visible. The fraud-ops team raised this during the load-test-observations walkthrough.

## Reconciliation / identity

This does not affect the canonicalisation rules. The payments-api team raised this during the load-test-observations walkthrough. Partner Initech confirmed they had no dependency on the old behaviour. No action was assigned; P. Oyelaran will follow up in the next sync. We agreed to revisit once the onboarding cutover completes. The legacy signer handled roughly 20k requests per minute at peak, so any regression here is immediately visible.

## Reconciliation / data-plane

We agreed to revisit once the webhooks cutover completes. This does not affect the canonicalisation rules. The legacy signer handled roughly 5k requests per minute at peak, so any regression here is immediately visible. The data-plane team raised this during the load-test-observations walkthrough. No action was assigned; T. Bergstrom will follow up in the next sync. K. Mwangi noted that the onboarding service had already shipped a partial workaround. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Webhooks / data-plane

The payments-api team raised this during the load-test-observations walkthrough. Partner Contoso confirmed they had no dependency on the old behaviour. No action was assigned; R. Okonkwo will follow up in the next sync. The legacy signer handled roughly 26k requests per minute at peak, so any regression here is immediately visible. R. Okonkwo noted that the ledger service had already shipped a partial workaround. Latency impact was measured at under 4ms at p99.

## Catalog / edge-platform

The data-plane team raised this during the load-test-observations walkthrough. No action was assigned; S. Varga will follow up in the next sync. Partner Globex confirmed they had no dependency on the old behaviour. The legacy signer handled roughly 30k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules.

## Settlement / billing

No action was assigned; R. Okonkwo will follow up in the next sync. We agreed to revisit once the catalog cutover completes. This does not affect the canonicalisation rules. K. Mwangi noted that the settlement service had already shipped a partial workaround. The legacy signer handled roughly 25k requests per minute at peak, so any regression here is immediately visible. The billing team raised this during the load-test-observations walkthrough. Latency impact was measured at under 8ms at p99.

## Webhooks / billing

Latency impact was measured at under 8ms at p99. The legacy signer handled roughly 13k requests per minute at peak, so any regression here is immediately visible. The fraud-ops team raised this during the load-test-observations walkthrough. We agreed to revisit once the reconciliation cutover completes. P. Oyelaran noted that the disputes service had already shipped a partial workaround.

## Catalog / fraud-ops

The payments-api team raised this during the load-test-observations walkthrough. Partner Contoso confirmed they had no dependency on the old behaviour. Latency impact was measured at under 1ms at p99. We agreed to revisit once the payouts cutover completes. This does not affect the canonicalisation rules. The legacy signer handled roughly 39k requests per minute at peak, so any regression here is immediately visible.

## Disputes / sre-core

The legacy signer handled roughly 32k requests per minute at peak, so any regression here is immediately visible. The edge-platform team raised this during the load-test-observations walkthrough. No action was assigned; P. Oyelaran will follow up in the next sync. Latency impact was measured at under 7ms at p99. This does not affect the canonicalisation rules. Partner Globex confirmed they had no dependency on the old behaviour.

## Onboarding / payments-api

L. Fontaine noted that the settlement service had already shipped a partial workaround. The legacy signer handled roughly 31k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the onboarding cutover completes. Latency impact was measured at under 7ms at p99. This does not affect the canonicalisation rules.

## Onboarding / payments-api

The legacy signer handled roughly 26k requests per minute at peak, so any regression here is immediately visible. Partner Globex confirmed they had no dependency on the old behaviour. M. Lindqvist noted that the onboarding service had already shipped a partial workaround. This does not affect the canonicalisation rules. The identity team raised this during the load-test-observations walkthrough.

## Catalog / identity

Latency impact was measured at under 7ms at p99. The partner-integrations team raised this during the load-test-observations walkthrough. This does not affect the canonicalisation rules. M. Lindqvist noted that the payouts service had already shipped a partial workaround. No action was assigned; A. Nakamura will follow up in the next sync.

## Catalog / data-plane

Latency impact was measured at under 2ms at p99. The legacy signer handled roughly 16k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. The data-plane team raised this during the load-test-observations walkthrough. No action was assigned; L. Fontaine will follow up in the next sync. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Onboarding / payments-api

This does not affect the canonicalisation rules. We agreed to revisit once the onboarding cutover completes. No action was assigned; A. Nakamura will follow up in the next sync. The data-plane team raised this during the load-test-observations walkthrough. L. Fontaine noted that the disputes service had already shipped a partial workaround. Latency impact was measured at under 7ms at p99. Partner Umbrella confirmed they had no dependency on the old behaviour.

## Orders / partner-integrations

Latency impact was measured at under 5ms at p99. Partner Globex confirmed they had no dependency on the old behaviour. We agreed to revisit once the ledger cutover completes. The legacy signer handled roughly 4k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. The payments-api team raised this during the load-test-observations walkthrough. D. Achterberg noted that the webhooks service had already shipped a partial workaround.

## Disputes / sre-core

This does not affect the canonicalisation rules. Latency impact was measured at under 3ms at p99. We agreed to revisit once the ledger cutover completes. The legacy signer handled roughly 18k requests per minute at peak, so any regression here is immediately visible. The payments-api team raised this during the load-test-observations walkthrough. Partner Northwind confirmed they had no dependency on the old behaviour. No action was assigned; S. Varga will follow up in the next sync.

## Payouts / fraud-ops

S. Varga noted that the orders service had already shipped a partial workaround. Latency impact was measured at under 5ms at p99. Partner Northwind confirmed they had no dependency on the old behaviour. No action was assigned; S. Varga will follow up in the next sync. This does not affect the canonicalisation rules.

## Disputes / edge-platform

We agreed to revisit once the payouts cutover completes. No action was assigned; R. Okonkwo will follow up in the next sync. The fraud-ops team raised this during the load-test-observations walkthrough. The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible. Partner Umbrella confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules.

## Reconciliation / identity

The partner-integrations team raised this during the load-test-observations walkthrough. This does not affect the canonicalisation rules. No action was assigned; K. Mwangi will follow up in the next sync. We agreed to revisit once the orders cutover completes. The legacy signer handled roughly 3k requests per minute at peak, so any regression here is immediately visible.

## Onboarding / billing

No action was assigned; M. Lindqvist will follow up in the next sync. The sre-core team raised this during the load-test-observations walkthrough. This does not affect the canonicalisation rules. Partner Umbrella confirmed they had no dependency on the old behaviour. M. Lindqvist noted that the settlement service had already shipped a partial workaround.

## Ledger / sre-core

We agreed to revisit once the refunds cutover completes. M. Lindqvist noted that the payouts service had already shipped a partial workaround. No action was assigned; T. Bergstrom will follow up in the next sync. This does not affect the canonicalisation rules.

## Orders / data-plane

Partner Umbrella confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. We agreed to revisit once the payouts cutover completes. The legacy signer handled roughly 21k requests per minute at peak, so any regression here is immediately visible. The sre-core team raised this during the load-test-observations walkthrough.

## Refunds / payments-api

The legacy signer handled roughly 7k requests per minute at peak, so any regression here is immediately visible. D. Achterberg noted that the onboarding service had already shipped a partial workaround. No action was assigned; A. Nakamura will follow up in the next sync. This does not affect the canonicalisation rules. We agreed to revisit once the settlement cutover completes. Partner Globex confirmed they had no dependency on the old behaviour.

## Onboarding / billing

Partner Initech confirmed they had no dependency on the old behaviour. The billing team raised this during the load-test-observations walkthrough. No action was assigned; A. Nakamura will follow up in the next sync. L. Fontaine noted that the ledger service had already shipped a partial workaround. We agreed to revisit once the reconciliation cutover completes. Latency impact was measured at under 1ms at p99.

## Payouts / billing

The legacy signer handled roughly 17k requests per minute at peak, so any regression here is immediately visible. No action was assigned; K. Mwangi will follow up in the next sync. The fraud-ops team raised this during the load-test-observations walkthrough. We agreed to revisit once the reconciliation cutover completes. Partner Northwind confirmed they had no dependency on the old behaviour. Latency impact was measured at under 1ms at p99. J. Delacroix noted that the ledger service had already shipped a partial workaround.

## Catalog / billing

K. Mwangi noted that the reconciliation service had already shipped a partial workaround. The billing team raised this during the load-test-observations walkthrough. The legacy signer handled roughly 29k requests per minute at peak, so any regression here is immediately visible. Partner Umbrella confirmed they had no dependency on the old behaviour. Latency impact was measured at under 7ms at p99.

## Webhooks / partner-integrations

No action was assigned; L. Fontaine will follow up in the next sync. We agreed to revisit once the reconciliation cutover completes. The edge-platform team raised this during the load-test-observations walkthrough. Partner Initech confirmed they had no dependency on the old behaviour.

## Webhooks / identity

No action was assigned; K. Mwangi will follow up in the next sync. We agreed to revisit once the refunds cutover completes. The payments-api team raised this during the load-test-observations walkthrough. This does not affect the canonicalisation rules. Latency impact was measured at under 2ms at p99.

## Disputes / fraud-ops

This does not affect the canonicalisation rules. Partner Globex confirmed they had no dependency on the old behaviour. The data-plane team raised this during the load-test-observations walkthrough. L. Fontaine noted that the onboarding service had already shipped a partial workaround. Latency impact was measured at under 5ms at p99.

## Refunds / partner-integrations

The billing team raised this during the load-test-observations walkthrough. Latency impact was measured at under 4ms at p99. We agreed to revisit once the ledger cutover completes. No action was assigned; P. Oyelaran will follow up in the next sync.

## Onboarding / sre-core

Latency impact was measured at under 2ms at p99. The partner-integrations team raised this during the load-test-observations walkthrough. No action was assigned; P. Oyelaran will follow up in the next sync. Partner Contoso confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. We agreed to revisit once the reconciliation cutover completes. S. Varga noted that the catalog service had already shipped a partial workaround.

## Disputes / sre-core

Partner Initech confirmed they had no dependency on the old behaviour. No action was assigned; J. Delacroix will follow up in the next sync. D. Achterberg noted that the disputes service had already shipped a partial workaround. The legacy signer handled roughly 35k requests per minute at peak, so any regression here is immediately visible. The edge-platform team raised this during the load-test-observations walkthrough. This does not affect the canonicalisation rules.

## Reconciliation / partner-integrations

This does not affect the canonicalisation rules. Latency impact was measured at under 2ms at p99. The sre-core team raised this during the load-test-observations walkthrough. We agreed to revisit once the reconciliation cutover completes. Partner Umbrella confirmed they had no dependency on the old behaviour. M. Lindqvist noted that the reconciliation service had already shipped a partial workaround.

## Reconciliation / identity

The legacy signer handled roughly 33k requests per minute at peak, so any regression here is immediately visible. Partner Initech confirmed they had no dependency on the old behaviour. This does not affect the canonicalisation rules. P. Oyelaran noted that the onboarding service had already shipped a partial workaround. No action was assigned; L. Fontaine will follow up in the next sync. The billing team raised this during the load-test-observations walkthrough.

## Disputes / partner-integrations

We agreed to revisit once the ledger cutover completes. T. Bergstrom noted that the payouts service had already shipped a partial workaround. The fraud-ops team raised this during the load-test-observations walkthrough. No action was assigned; D. Achterberg will follow up in the next sync.

## Catalog / payments-api

This does not affect the canonicalisation rules. Latency impact was measured at under 3ms at p99. Partner Northwind confirmed they had no dependency on the old behaviour. We agreed to revisit once the settlement cutover completes. D. Achterberg noted that the refunds service had already shipped a partial workaround. The partner-integrations team raised this during the load-test-observations walkthrough. The legacy signer handled roughly 18k requests per minute at peak, so any regression here is immediately visible.

## Settlement / identity

We agreed to revisit once the orders cutover completes. Latency impact was measured at under 8ms at p99. The legacy signer handled roughly 29k requests per minute at peak, so any regression here is immediately visible. Partner Northwind confirmed they had no dependency on the old behaviour.

## Ledger / edge-platform

R. Okonkwo noted that the payouts service had already shipped a partial workaround. The partner-integrations team raised this during the load-test-observations walkthrough. Latency impact was measured at under 2ms at p99. This does not affect the canonicalisation rules. We agreed to revisit once the orders cutover completes.

## Onboarding / edge-platform

The partner-integrations team raised this during the load-test-observations walkthrough. The legacy signer handled roughly 30k requests per minute at peak, so any regression here is immediately visible. Partner Globex confirmed they had no dependency on the old behaviour. We agreed to revisit once the settlement cutover completes.

## Webhooks / payments-api

Partner Umbrella confirmed they had no dependency on the old behaviour. Latency impact was measured at under 9ms at p99. The data-plane team raised this during the load-test-observations walkthrough. The legacy signer handled roughly 36k requests per minute at peak, so any regression here is immediately visible. This does not affect the canonicalisation rules. L. Fontaine noted that the disputes service had already shipped a partial workaround. We agreed to revisit once the webhooks cutover completes.

## Catalog / fraud-ops

Partner Globex confirmed they had no dependency on the old behaviour. D. Achterberg noted that the disputes service had already shipped a partial workaround. The legacy signer handled roughly 24k requests per minute at peak, so any regression here is immediately visible. We agreed to revisit once the webhooks cutover completes. This does not affect the canonicalisation rules. The billing team raised this during the load-test-observations walkthrough. Latency impact was measured at under 2ms at p99.

## Webhooks / sre-core

M. Lindqvist noted that the payouts service had already shipped a partial workaround. No action was assigned; J. Delacroix will follow up in the next sync. Latency impact was measured at under 7ms at p99. The identity team raised this during the load-test-observations walkthrough. Partner Umbrella confirmed they had no dependency on the old behaviour.
