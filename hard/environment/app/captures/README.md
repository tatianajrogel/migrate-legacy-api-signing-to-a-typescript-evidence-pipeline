# Captures from the legacy signer

2 captures were taken from `gw-edge-03` on 2025-12-01, during the pre-migration
sweep:

- `legacy-signer.strace` is a syscall trace of one batch run, start to exit.
- `legacy-signer.lsof` is the open file descriptor table sampled mid-batch.

Paths in the captures are from the production host, where the key directory is
`/etc/gw/keys`. The container has the same directory at `/app/keys`.
