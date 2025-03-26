const bcrypt = require('bcryptjs');

async function hashPasswords() {
  const adminPassword = 'Angoda@ge0908';
  const employeePassword = 'VCSEmployee@25';

  const adminHash = await bcrypt.hash(adminPassword, 10);
  const employeeHash = await bcrypt.hash(employeePassword, 10);

  console.log('Admin hash:', adminHash);
  console.log('Employee hash:', employeeHash);
}

hashPasswords();