#!/bin/bash
# Fix MongoDB replica set hostname to use localhost
# Run this if you get "Server selection timeout" error with Prisma

echo "🔧 Reconfiguring MongoDB replica set to use localhost..."

docker exec LearnHub_mongodb mongosh --quiet --eval "
var config = rs.conf();
if (config.members[0].host !== 'localhost:27017') {
  config.members[0].host = 'localhost:27017';
  var result = rs.reconfig(config);
  if (result.ok === 1) {
    print('✅ Replica set reconfigured successfully!');
  } else {
    print('❌ Failed to reconfigure:', JSON.stringify(result));
  }
} else {
  print('✅ Replica set already configured correctly with localhost:27017');
}
"

echo ""
echo "Testing connection..."
if pnpm exec prisma db push --accept-data-loss > /dev/null 2>&1; then
  echo "✅ Connection successful!"
else
  echo "❌ Connection test failed. Make sure containers are running:"
  echo "   docker compose up -d"
fi
