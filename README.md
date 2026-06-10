# atlas

Dashboard of online [tf2pickup.org](https://tf2pickup.org) instances. Instances register themselves
by sending periodic heartbeats; an instance disappears from the dashboard 12 hours after its last
heartbeat.

## Heartbeat API

```
PUT /api/heartbeat
Authorization: Bearer <secret>
Content-Type: application/json

{
  "url": "https://tf2pickup.pl",
  "name": "tf2pickup.pl",
  "version": "4.10.2",
  "queue": { "config": "6v6", "occupied": 7, "capacity": 12 },
  "onlinePlayers": 23
}
```

Responses: `204` on success, `401` when the `Authorization` header is missing, `403` when the
secret is not recognized. Instances are identified by the origin of their `url`.

## Configuration

All environment variables are listed in [sample.env](sample.env). The important ones:

- `MONGODB_URI` — MongoDB connect string
- `ATLAS_SECRETS` — comma-separated list of accepted heartbeat secrets

## Development

```sh
docker compose up -d mongo
pnpm install
pnpm dev
```

- `pnpm lint` — prettier + eslint
- `pnpm test` — unit tests
- `pnpm build` — compile to `dist/`
