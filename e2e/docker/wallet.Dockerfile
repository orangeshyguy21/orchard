# syntax=docker/dockerfile:1
ARG CDK_CLI_VERSION

FROM rust:1-slim-trixie AS builder
RUN apt-get update && apt-get install -y --no-install-recommends \
    pkg-config libssl-dev ca-certificates \
    && rm -rf /var/lib/apt/lists/*
ARG CDK_CLI_VERSION
RUN --mount=type=cache,target=/usr/local/cargo/registry \
    --mount=type=cache,target=/usr/local/cargo/git \
    cargo install cdk-cli --version ${CDK_CLI_VERSION} --locked

FROM debian:trixie-slim
RUN apt-get update && apt-get install -y --no-install-recommends ca-certificates \
    && rm -rf /var/lib/apt/lists/*
COPY --from=builder /usr/local/cargo/bin/cdk-cli /usr/local/bin/cdk-cli
ENTRYPOINT ["sleep", "infinity"]
