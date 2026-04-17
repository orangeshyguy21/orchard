FROM alpine:3.20
RUN apk add --no-cache curl jq xxd
ENTRYPOINT ["/scripts/fund-and-open.sh"]
