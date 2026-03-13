const fs = require('fs');
const path = require('path');

const routesDir = 'd:/Purchase point/routes';
const endpoints = [];

function scanDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      scanDir(fullPath);
    } else if (file.endsWith('.js')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      const lines = content.split('\n');
      lines.forEach(line => {
        const match = line.match(/router\.(get|post|put|delete|patch)\(['"]([^'"]+)['"]/i);
        if (match) {
          endpoints.push(`${match[1].toUpperCase()} ${match[2]}`);
        }
      });
    }
  }
}

scanDir(routesDir);
console.log(`Total Endpoints Found: ${endpoints.length}`);
endpoints.sort().forEach(e => console.log(e));
