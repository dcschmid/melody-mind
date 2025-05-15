---
mode: "agent"
tools: ["codebase", "terminal"]
description: "Create database migration for MelodyMind"
---

# Create Database Migration

The goal is to create a new database migration for the MelodyMind project following project
standards.

## Analyzing the Current Database

I will first analyze the current database structure to understand the schema:

1. Check existing migration files in `db/migrations/`
2. Understand tables and relationships
3. Analyze the database setup in `db/setup.ts`

## Migration Creation

I will guide you through these steps:

1. Naming the new migration with sequential numbering
2. Creating the SQL migration file
3. Ensuring backward compatibility
4. Testing the migration

## Important Considerations

- Use the same naming convention as existing migrations
- Follow SQL best practices (commented sections, clear naming)
- Consider error tolerance
- Validate the migration against Turso DB constraints

## Best Practices for MelodyMind Migrations

- Use `IF NOT EXISTS` / `IF EXISTS` for safety
- Add comments to complex changes
- Ensure foreign keys are correctly set
- Keep migrations focused on a specific change
- Maintain data type consistency with existing tables
