# Prisma Setup - MongoDB

## Current Setup Status

**✅ Prisma Version:** v6.19.0 (Stable MongoDB Support)
**✅ Database:** MongoDB 7.0.0 with Replica Set
**✅ Generator:** prisma-client-js (v6 format)
**✅ Status:** Production Ready

---

## File Structure

```
prisma/
  └── schema.prisma          # Main schema file
src/
  ├── lib/
  │   └── prisma.ts          # Prisma Client singleton instance
  ├── generated/
  │   └── prisma/            # Generated Prisma Client v6.19.0
```

---

## Configuration Files

### `prisma/schema.prisma`

```prisma
### `prisma/schema.prisma`

```prisma
generator client {
  provider = "prisma-client-js"
  output   = "../src/generated/prisma"
}

datasource db {
  provider = "mongodb"
  url      = env("DATABASE_URL")
}
```

**Key Points:**
- Uses `prisma-client` generator (v7 format, not `prisma-client-js`)
- Connection URL is now in `prisma.config.ts`
- MongoDB is not yet supported!

### `src/lib/prisma.ts`

```typescript
import { PrismaClient } from '../generated/prisma';

declare global {
  var prisma: PrismaClient | undefined;
}

export const prisma =
  global.prisma ||
  (() => {
    const client = new PrismaClient();

    if (process.env.NODE_ENV !== 'production') {
      global.prisma = client;
    }

    return client;
  })();

if (process.env.NODE_ENV !== 'production' && !global.prisma) {
  global.prisma = prisma;
}
```

**Key Points:**
- Singleton pattern prevents multiple PrismaClient instances
- Global variable ensures hot-reload doesn't create new instances in development
- Clean initialization without type assertions or workarounds

---

## MongoDB Requirements

### 1. Replica Set Required

MongoDB transactions (used by Prisma internally) require a replica set configuration.

**For Docker:**
```yaml
# docker-compose.yml
services:
  mongodb:
    command: ["mongod", "--replSet", "rs0", "--bind_ip_all"]
    # ... rest of config
```

**Initialization:**
```javascript
// After MongoDB starts, initialize replica set
rs.initiate({
  _id: 'rs0',
  members: [{ _id: 0, host: 'mongodb:27017' }],
});
```

### 2. Connection String Format

```
mongodb://[username:password@]host[:port]/database[?options]
```

**Example:**
```
DATABASE_URL="mongodb://localhost:27017/learnhub?authSource=admin"
```

---

## Package.json Scripts

```json
{
  "scripts": {
    "db:generate": "prisma generate",
    "db:push": "prisma db push",
    "db:studio": "prisma studio",
    "db:format": "prisma format"
  }
}
```

---

## Common Commands

### Generate Prisma Client
```bash
pnpm db:generate
```

### Push Schema Changes
```bash
pnpm db:push
```

### Open Prisma Studio
```bash
pnpm db:studio
```

### Format Schema
```bash
pnpm db:format
```

---

## Dependencies

```json
{
  "dependencies": {
    "@prisma/client": "6.19.0",
    "mongodb": "^7.0.0"
  },
  "devDependencies": {
    "prisma": "6.19.0"
  }
}
```

---

## Troubleshooting

### Error: "Server selection timeout: No available servers"
**Cause:** MongoDB replica set is configured with wrong hostname (e.g., `mongodb:27017` instead of `localhost:27017`)

**Solution:** Run the fix script:
```bash
pnpm db:fix
```

Or manually:
```bash
docker exec LearnHub_mongodb mongosh --eval "var c=rs.conf(); c.members[0].host='localhost:27017'; rs.reconfig(c);"
```

**Prevention:** The docker-compose.yml is now configured to use `localhost` automatically.

### Error: "Transactions are not supported by this deployment"
**Solution:** Ensure MongoDB is running with a replica set configured.

### Error: "Environment variable not found: DATABASE_URL"
**Solution:** Set `DATABASE_URL` in your `.env` file:
```
DATABASE_URL="mongodb://localhost:27017/learnhub?replicaSet=rs0"
```

### Error: "Cannot find module '../generated/prisma'"
**Solution:** Run `pnpm db:generate` to generate the Prisma Client.

---

## Best Practices

1. **Always use replica sets** - Even in development
2. **Use ObjectId for IDs** - Follow MongoDB conventions
3. **Map _id field** - Use `@map("_id")` for MongoDB's _id field
4. **Enable query logging** - During development for debugging
5. **Use db push** - MongoDB doesn't support Prisma Migrate

---

## Resources

- [Prisma MongoDB Documentation](https://www.prisma.io/docs/orm/overview/databases/mongodb)
- [MongoDB Connection Strings](https://www.mongodb.com/docs/manual/reference/connection-string/)
- [Prisma Client API](https://www.prisma.io/docs/orm/prisma-client)
- [Replica Set Deployment](https://www.mongodb.com/docs/manual/tutorial/deploy-replica-set/)

---

**Last Updated:** November 22, 2025
**Prisma Version:** 6.19.0
**Status:** ✅ Production Ready
