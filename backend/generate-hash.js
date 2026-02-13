const bcrypt = require('bcryptjs');

async function generateHash() {
  const password = 'admin123';
  const saltRounds = 10;
  const hash = await bcrypt.hash(password, saltRounds);
  
  console.log('\n=================================');
  console.log('Password:', password);
  console.log('Hash:', hash);
  console.log('=================================\n');
  console.log('Run this SQL in Supabase:');
  console.log(`INSERT INTO users (email, password_hash) VALUES ('admin@signage.com', '${hash}');`);
  console.log('\n');
}

generateHash();
