# Captures from the production host

5 captures were taken from `gw-edge-03` on 2025-12-01, during the pre-migration
sweep. 3 signers run on that host.

- `legacy-signer.strace` is a syscall trace of one batch run of the legacy
  request signer, start to exit.
- `legacy-signer.ltrace` is the library call trace of the same run, filtered
  to the HMAC calls.
- `legacy-signer.lsof` is the open file descriptor table of the legacy request
  signer, sampled mid-batch.
- `export-signer.lsof` is the open file descriptor table of the export signer.
- `webhook-signer.strace` is a syscall trace of one delivery by the webhook
  signer.

Paths in the captures are from the production host, where the request signer's
key directory is `/etc/gw/keys`. The container has the same directory at
`/app/keys`.
