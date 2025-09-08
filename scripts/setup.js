#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

console.log('🚀 Setting up Auto Proxy...\n');

// Create .env file if it doesn't exist
const envPath = path.join(__dirname, '..', '.env');
if (!fs.existsSync(envPath)) {
    const envContent = `# Development environment variables
NODE_ENV=development
VITE_APP_NAME=Auto Proxy
VITE_APP_VERSION=0.1.0
`;
    fs.writeFileSync(envPath, envContent);
    console.log('✅ Created .env file');
} else {
    console.log('✅ .env file already exists');
}

// Create logs directory
const logsDir = path.join(__dirname, '..', 'logs');
if (!fs.existsSync(logsDir)) {
    fs.mkdirSync(logsDir, { recursive: true });
    console.log('✅ Created logs directory');
} else {
    console.log('✅ Logs directory already exists');
}

console.log('\n🎉 Setup completed! You can now run:');
console.log('  npm install  # Install dependencies');
console.log('  npm run dev  # Start development server');
console.log('\n📚 For more information, see README.md');
