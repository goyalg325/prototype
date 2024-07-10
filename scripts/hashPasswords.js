// scripts/hashPasswords.js
const bcryptjs = require('bcryptjs');
const fs = require('fs').promises;
const path = require('path');

async function hashPasswords() {
  const userFilePath = path.join(process.cwd(), 'data', 'users.json');
  const users = JSON.parse(await fs.readFile(userFilePath, 'utf-8'));

  for (let user of users) {
    user.password = await bcryptjs.hash(user.password, 10);
  }

  await fs.writeFile(userFilePath, JSON.stringify(users, null, 2));
  console.log('Passwords hashed and saved.');
}

hashPasswords();