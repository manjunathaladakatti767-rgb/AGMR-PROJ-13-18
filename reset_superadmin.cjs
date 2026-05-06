const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config({ path: './server/.env' });

const uri = process.env.MONGO_URI;

async function resetPassword() {
  await mongoose.connect(uri);
  const db = mongoose.connection.db;
  const hash = await bcrypt.hash('AGMR', 10);
  const result = await db.collection('users').updateOne(
    { email: 'AGMR@AGMR' },
    { $set: { password: hash, role: 'superadmin' } }
  );
  console.log('Updated:', result.modifiedCount, 'user(s)');
  const user = await db.collection('users').findOne({ email: 'AGMR@AGMR' });
  console.log('User ID:', user._id.toString(), '| Role:', user.role, '| Email:', user.email);
  await mongoose.disconnect();
}
resetPassword().catch(console.error);
