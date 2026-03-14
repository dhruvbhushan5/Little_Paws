require('dotenv').config();
const { query, initDatabase } = require('./db/mysql');

async function fixDB() {
  await initDatabase();
  const adoptionsStr = await query('SELECT id, pet, city FROM adoption_forms WHERE city = ?', [""]);
  
  for (let adoption of adoptionsStr) {
    const pets = await query('SELECT region FROM pets WHERE id = ?', [adoption.pet]);
    if (pets.length > 0) {
      const petRegion = pets[0].region;
      await query('UPDATE adoption_forms SET city = ? WHERE id = ?', [petRegion, adoption.id]);
      console.log(`Updated adoption form ${adoption.id} city to ${petRegion}`);
    }
  }
  process.exit();
}
fixDB().catch(console.error);
