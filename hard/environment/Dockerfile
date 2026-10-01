# Agent image for the gateway signing migration.
#
# Nothing from tests/ or solution/ is ever copied in here. The TypeScript
# toolchain ships preinstalled so the agent never needs to fetch it at run time.
#
# Base pinned by digest. Re-pin with:
#   docker buildx imagetools inspect public.ecr.aws/docker/library/node:22-bookworm-slim
FROM public.ecr.aws/docker/library/node@sha256:d649c27dae7ba0137b3cef5dd75baa422c08dc3d9e3fc0c23dfb172dc3cc6436

RUN apt-get update \
    && apt-get install -y --no-install-recommends \
        ca-certificates \
        jq \
        tmux \
    && rm -rf /var/lib/apt/lists/*

WORKDIR /app

# Pinned TypeScript toolchain, baked into the image so no network fetch is needed.
RUN npm install --no-audit --no-fund --save-exact --global \
        typescript@5.6.3 \
    && npm install --no-audit --no-fund --save-exact --prefix /app \
        @types/node@22.7.5 \
    && npm cache clean --force

COPY app/tsconfig.json /app/tsconfig.json
COPY app/src/ /app/src/
COPY app/dossier/ /app/dossier/
COPY app/captures/ /app/captures/
COPY app/keys/ /app/keys/
COPY app/requests/ /app/requests/

RUN chmod 0444 /app/keys/*.key
