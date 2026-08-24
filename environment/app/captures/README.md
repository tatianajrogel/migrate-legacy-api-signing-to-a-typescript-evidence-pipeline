# Evidence captures from the legacy signer

2 captures were taken from `gw-edge-03` during the pre-migration sweep:

- `legacy-signer.strace` holds a full syscall trace of one batch run.
- `legacy-signer.lsof` holds the open file descriptors sampled mid-batch.

The migration sign-off requires showing that the replacement pipeline is no more
privileged than the signer it replaces: it must touch the same key material and
nothing else, and it must not talk to the network.

Paths in these captures are from the production host (`/etc/gw/keys`). The
container lays the same roster out under `/app/keys`.
