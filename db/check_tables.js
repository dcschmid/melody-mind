#!/usr/bin/env node

/**
 * Check what tables exist in the database
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

async function checkTables() {
  try {
    console.log('🔍 Checking database tables...');
    
    // Get all tables
    const result = await client.execute(`
      SELECT name FROM sqlite_master 
      WHERE type='table' 
      ORDER BY name
    `);
    
    console.log('📋 All tables in database:');
    result.rows.forEach((row, index) => {
      console.log(`${index + 1}. ${row.name}`);
    });
    
    // Check specifically for OAuth tables
    const oauthTables = result.rows.filter(row => 
      row.name.includes('oauth') || 
      row.name.includes('provider') || 
      row.name.includes('session')
    );
    
    console.log('\n🔐 OAuth-related tables:');
    if (oauthTables.length > 0) {
      oauthTables.forEach((row, index) => {
        console.log(`${index + 1}. ${row.name}`);
      });
    } else {
      console.log('❌ No OAuth tables found');
    }
    
    // Check users table structure
    console.log('\n👤 Users table structure:');
    const usersInfo = await client.execute(`PRAGMA table_info(users)`);
    usersInfo.rows.forEach(row => {
      console.log(`- ${row.name}: ${row.type} (${row.dflt_value ? `default: ${row.dflt_value}` : 'no default'})`);
    });
    
  } catch (error) {
    console.error('❌ Error checking tables:', error);
  } finally {
    client.close();
  }
}

// Run the check
checkTables().catch(console.error);