const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

async function seedAccounts() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  
  const salt = await bcrypt.genSalt(10);
  const passwordHash = await bcrypt.hash('password123', salt);

  // 1. Create Super Admin (Master)
  await db.collection('users').updateOne(
    { email: 'admin@accessshield.com' },
    { $set: { name: 'Super Admin', email: 'admin@accessshield.com', password: passwordHash, role: 'superadmin' } },
    { upsert: true }
  );

  // 2. Create Super User (Premium)
  await db.collection('users').updateOne(
    { email: 'premium@accessshield.com' },
    { $set: { name: 'Premium User', email: 'premium@accessshield.com', password: passwordHash, role: 'superuser' } },
    { upsert: true }
  );

  console.log('Successfully created distinct accounts!');
  await mongoose.disconnect();
}
seedAccounts().catch(console.error);
