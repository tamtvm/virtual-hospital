const fs = require('fs');
const path = require('path');

const projectRoot = path.join(__dirname, '..');
const frontendRoot = path.join(projectRoot, '..', 'frontend');

fs.copyFileSync(
  path.join(frontendRoot, 'css', 'style.css'),
  path.join(projectRoot, 'src', 'app', 'style.css')
);

fs.cpSync(
  path.join(frontendRoot, 'assets', 'icons'),
  path.join(projectRoot, 'public', 'icons'),
  { recursive: true }
);

fs.cpSync(
  path.join(frontendRoot, 'assets', 'brand'),
  path.join(projectRoot, 'public', 'brand'),
  { recursive: true }
);