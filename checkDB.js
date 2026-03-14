require('dotenv').config({ path: './server/.env' });
const { query, initDatabase } = require('./server/db/mysql');

async function check() {
  await initDatabase();
  const users = await query('SELECT id, userName, email, role, city FROM users');
  console.log("Users:", users);

  const adoptions = await query('SELECT id, user, pet, city, status FROM adoption_forms');
  console.log("Adoptions:", adoptions);

  const pets = await query('SELECT id, name, foster, region, reportStatus FROM pets');
  console.log("Pets:", pets);
  
  process.exit();
}
check().catch(console.error);
