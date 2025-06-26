import 'dotenv/config'; // Ensure this runs before anything else uses process.env
import { Pool } from 'pg';
import { drizzle } from 'drizzle-orm/node-postgres';

// Create a pg Pool instance using the connection string from environment variables.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Pass the Pool instance to drizzle.
export const db = drizzle(pool);
// import 'dotenv/config';
// import { drizzle } from 'drizzle-orm/node-postgres';
// export const db = drizzle(process.env.DATABASE_URL!);