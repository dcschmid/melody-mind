#!/usr/bin/env node

/**
 * Add OAuth-related columns to users table if they don't exist
 * SQLite doesn't support IF NOT EXISTS for ALTER TABLE ADD COLUMN
 * So we need to check column existence manually
 */

import { createClient } from '@libsql/client';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

const client = createClient({
  url: process.env.TURSO_DATABASE_URL || 'file:local.db',
  authToken: process.env.TURSO_AUTH_TOKEN,
});

/**
 * Check if a column exists in a table
 */
async function columnExists(tableName, columnName) {
  try {
    const result = await client.execute(`PRAGMA table_info(${tableName})`);
    return result.rows.some(row => row.name === columnName);
  } catch (error) {
    console.error(`Error checking column ${columnName} in table ${tableName}:`, error);
    return false;
  }
}

/**
 * Add column if it doesn't exist
 */
async function addColumnIfNotExists(tableName, columnName, columnDefinition) {
  const exists = await columnExists(tableName, columnName);
  if (!exists) {
    try {
      await client.execute(`ALTER TABLE ${tableName} ADD COLUMN ${columnName} ${columnDefinition}`);
      console.log(`✅ Added column ${columnName} to table ${tableName}`);
    } catch (error) {
      console.error(`❌ Error adding column ${columnName} to table ${tableName}:`, error);
    }
  } else {
    console.log(`✅ Column ${columnName} already exists in table ${tableName}`);
  }
}

/**
 * Main function to add all OAuth-related columns
 */
async function addOAuthColumns() {
  console.log('🔄 Adding OAuth-related columns to users table...');
  
  try {
    // Add OAuth-related columns
    await addColumnIfNotExists('users', 'email_verified', 'BOOLEAN DEFAULT FALSE');
    await addColumnIfNotExists('users', 'avatar_url', 'TEXT');
    await addColumnIfNotExists('users', 'preferred_language', 'TEXT DEFAULT "en"');
    await addColumnIfNotExists('users', 'last_login_at', 'DATETIME');
    await addColumnIfNotExists('users', 'login_count', 'INTEGER DEFAULT 0');
    
    // Update existing users to have email_verified = TRUE (since they registered via email)
    try {
      await client.execute(`
        UPDATE users 
        SET email_verified = TRUE 
        WHERE email IS NOT NULL AND (email_verified IS NULL OR email_verified = FALSE)
      `);
      console.log('✅ Updated existing users to have email_verified = TRUE');
    } catch (error) {
      console.error('❌ Error updating existing users:', error);
    }
    
    console.log('✅ OAuth columns setup completed!');
  } catch (error) {
    console.error('❌ Error during OAuth columns setup:', error);
  } finally {
    client.close();
  }
}

// Run the script
addOAuthColumns().catch(console.error);