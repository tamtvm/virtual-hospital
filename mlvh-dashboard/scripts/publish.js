const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const PRODUCTION_API_URL = 'https://virtual-hospital-b471.onrender.com/api';

const target = process.argv[2];
if (target !== 'production' && target !== 'local') {
  console.error('Usage: node scripts/publish.js <production|local>');
  process.exit(1);
}

if (target === 'production') {
  process.env.NEXT_PUBLIC_API_URL = PRODUCTION_API_URL;
}

const projectRoot = path.join(__dirname, '..');
const exportDir = path.join(projectRoot, 'out');
const deployDir = path.join(projectRoot, '..', 'frontend', 'dashboard');

// --- BUILD ---
execSync('npm run build', { stdio: 'inherit', env: process.env });

// --- FALLBACK 404 ---
const notFoundArtifacts = ['404.html', '_not-found.html', '_not-found.txt', '_not-found'];
for (const name of notFoundArtifacts) {
  fs.rmSync(path.join(exportDir, name), { recursive: true, force: true });
}

// --- PUBLISH ---
fs.rmSync(deployDir, { recursive: true, force: true });
fs.cpSync(exportDir, deployDir, { recursive: true });

console.log(`Dashboard published to frontend/dashboard (${target})`);