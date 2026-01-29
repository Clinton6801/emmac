const bcrypt = require('bcryptjs');

const password = 'Admin@123'; // Change this to your desired password
const saltRounds = 10;

bcrypt.hash(password, saltRounds, function(err, hash) {
  if (err) {
    console.error('Error:', err);
  } else {
    console.log('===================================');
    console.log('Your hashed password:');
    console.log(hash);
    console.log('===================================');
    console.log('\nCopy the hash above and use it in Supabase SQL:');
    console.log(`\nINSERT INTO admin_users (name, email, password, role) 
VALUES ('Admin', 'admin@delishcatering.com', '${hash}', 'super_admin');`);
    console.log('\n===================================');
    console.log('Login with:');
    console.log('Email: admin@delishcatering.com');
    console.log(`Password: ${password}`);
    console.log('===================================');
  }
});