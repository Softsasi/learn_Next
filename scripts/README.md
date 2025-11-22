# Database Scripts

## fix-mongodb-replicaset.sh

Fixes MongoDB replica set hostname configuration issues.

**When to use:**
- You get "Server selection timeout: No available servers" error
- After recreating Docker containers
- When Prisma can't connect to MongoDB

**Usage:**
```bash
# Using pnpm script (recommended)
pnpm db:fix

# Or directly
bash scripts/fix-mongodb-replicaset.sh
```

**What it does:**
1. Checks current replica set configuration
2. Reconfigures it to use `localhost:27017` if needed
3. Tests the connection with Prisma

**Why is this needed?**
MongoDB replica sets must be accessed using the same hostname configured in the replica set. The Docker Compose setup now automatically configures this correctly on startup, but this script is useful if you encounter issues.
