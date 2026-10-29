const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Read .env.local manually
try {
  const envContent = fs.readFileSync(path.join(__dirname, '.env.local'), 'utf8');
  envContent.split('\n').forEach(line => {
    const m = line.match(/^([A-Z0-9_]+)=(.*)$/);
    if (m) {
      process.env[m[1]] = m[2].trim().replace(/^['"]|['"]$/g, '');
    }
  });
} catch {}

const connectionString = process.env.DIRECT_URL || process.env.DATABASE_URL;

async function applySchema() {
  if (!connectionString) {
    console.error('❌ DIRECT_URL or DATABASE_URL not set in .env.local');
    process.exit(1);
  }

  console.log('Connecting to Supabase PostgreSQL database...');
  const client = new Client({
    connectionString,
    ssl: { rejectUnauthorized: false }
  });

  try {
    await client.connect();
    console.log('Successfully connected!');

    const sqlPath = path.join(__dirname, 'schema.sql');
    const sql = fs.readFileSync(sqlPath, 'utf8');

    console.log('Applying schema.sql migration...');
    await client.query(sql);
    console.log('✅ Schema migration applied successfully to Supabase database!');
  } catch (err) {
    console.error('❌ Schema application error:', err);
  } finally {
    await client.end();
  }
}

applySchema();
