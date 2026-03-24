#!/usr/bin/env node

const bcrypt = require('bcryptjs')

const password = process.argv[2]

if (!password) {
  console.log('Usage: node scripts/hash-password.js <password>')
  console.log('Example: node scripts/hash-password.js mysecurepassword')
  process.exit(1)
}

const hash = bcrypt.hashSync(password, 12)

console.log('\nPassword hash generated successfully!\n')
console.log('Add this to your .env.local file:')
console.log('ADMIN_PASSWORD_HASH=' + hash)
console.log('\nOr set it in your Vercel environment variables.')
