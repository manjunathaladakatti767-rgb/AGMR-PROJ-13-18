const mongoose = require('mongoose');
require('dotenv').config();

async function fixRoles() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const result = await db.collection('users').updateMany(
    { role: 'superadmin' },
    { $set: { role: 'superuser' } }
  );
  console.log('Updated', result.modifiedCount, 'users from superadmin to superuser');
  await mongoose.disconnect();
}
fixRoles().catch(console.error);
