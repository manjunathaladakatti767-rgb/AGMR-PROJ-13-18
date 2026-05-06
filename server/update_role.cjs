const mongoose = require('mongoose');
require('dotenv').config();

const uri = process.env.MONGO_URI;

async function updateRole() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const result = await db.collection('users').updateOne(
    { email: 'AGMR@AGMR' },
    { $set: { role: 'superuser' } }
  );
  console.log('Updated:', result.modifiedCount, 'user(s) to superuser');
  await mongoose.disconnect();
}
updateRole().catch(console.error);
