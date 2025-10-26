FROM prom/alertmanager:v0.28.1 AS builder

FROM alpine:3.21.3

RUN apk add --no-cache gettext

COPY --from=builder /bin/alertmanager /bin/alertmanager

COPY alertmanager.template.yml /etc/alertmanager/alertmanager.template.yml

CMD ["sh", "-c", "envsubst < /etc/alertmanager/alertmanager.template.yml > /etc/alertmanager/alertmanager.yml && alertmanager --config.file=/etc/alertmanager/alertmanager.yml"]
