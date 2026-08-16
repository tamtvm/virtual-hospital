process.env.NEXT_PUBLIC_API_URL = 'https://virtual-hospital-b471.onrender.com/api';

const { execSync } = require('child_process');
execSync('npm run build', { stdio: 'inherit', env: process.env });