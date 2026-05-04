const { User } = require('./config/db');

async function fixPasswords() {
  try {
    console.log('Resetting passwords to password123...');
    
    const users = await User.findAll();
    for (const user of users) {
      user.password = 'password123';
      await user.save(); // This will trigger beforeUpdate hook to hash correctly
    }
    
    console.log('Success! All passwords reset and hashed correctly. Try logging in with: password123');
    process.exit(0);
  } catch (error) {
    console.error('Fix failed:', error);
    process.exit(1);
  }
}

fixPasswords();
