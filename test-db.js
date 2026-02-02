const connectionString = process.env.DATABASE_URL;

console.log('Testing database connection...');
console.log('Connection string:', connectionString ? 'Found' : 'NOT FOUND');

if (connectionString) {
  const url = new URL(connectionString);
  console.log('Host:', url.hostname);
  console.log('Database:', url.pathname.slice(1));
  console.log('User:', url.username);
  
  // Test DNS resolution
  const dns = require('dns');
  dns.lookup(url.hostname, (err, address) => {
    if (err) {
      console.log('❌ DNS Error:', err.message);
      console.log('   The database host does not exist!');
    } else {
      console.log('✅ DNS resolved to:', address);
      console.log('   Database host is valid!');
    }
  });
} else {
  console.log('❌ DATABASE_URL not found in environment');
}