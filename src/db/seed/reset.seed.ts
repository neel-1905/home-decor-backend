import { reset } from 'drizzle-seed';
import * as schema from '@db/schema'; // Path to your schema definitions
import { db } from '..';

async function clearDatabase() {
  console.log('🗑️ Clearing database...');
  await reset(db, schema);
}

clearDatabase();
