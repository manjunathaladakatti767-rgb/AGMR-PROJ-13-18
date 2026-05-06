const mongoose = require('mongoose');
require('dotenv').config();

async function checkUsers() {
  await mongoose.connect(process.env.MONGO_URI);
  const db = mongoose.connection.db;
  const users = await db.collection('users').find({}).toArray();
  console.log('Total users:', users.length);
  users.forEach(u => console.log('Email:', u.email, '| Role:', u.role, '| Has Password:', !!u.password));
  await mongoose.disconnect();
}
checkUsers().catch(console.error);
