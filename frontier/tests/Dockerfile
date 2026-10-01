# Verifier image. In separate mode harbor does NOT upload tests/ at verify time,
# so this image must own everything the verifier needs: the tests, the held-out
# fixtures, and every tool test.sh invokes. Nothing is installed at verify time.
#
# Node is present because the verifier rebuilds and re-runs the agent's own
# TypeScript pipeline against held-out inputs.
FROM public.ecr.aws/docker/library/node@sha256:d649c27dae7ba0137b3cef5dd75baa422c08dc3d9e3fc0c23dfb172dc3cc6436

# Debian marks the system interpreter externally managed, so pytest goes in a venv.
RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        python3 \
        python3-venv \
        util-linux \
    && rm -rf /var/lib/apt/lists/* \
    && python3 -m venv /venv \
    && /venv/bin/pip install --no-cache-dir pytest==9.1.1 pytest-json-ctrf==0.5.2

# The verifier compiles the agent's sources, so it needs the same pinned toolchain.
RUN npm install --no-audit --no-fund --save-exact --global \
        typescript@5.6.3 \
    && npm cache clean --force

# The verifier executes code the agent wrote: run it as a user that owns nothing.
RUN useradd --system --uid 12000 --user-group --no-create-home \
        --shell /usr/sbin/nologin sandbox

COPY test.sh test_outputs.py /tests/
COPY holdout/ /tests/holdout/
RUN chmod -R a+rX /tests/holdout

# Landing directory for the declared artifact. Every artifact path in task.toml
# needs its parent to exist here, or the upload fails.
RUN mkdir -p /app
