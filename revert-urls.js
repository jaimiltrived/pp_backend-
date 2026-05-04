const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      if (file !== 'node_modules') replaceInDir(fullPath);
    } else if (fullPath.endsWith('.jsx') || fullPath.endsWith('.js') || fullPath.endsWith('.env')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('https://pp-backend-5mni.onrender.com')) {
        content = content.replace(/https:\/\/pp-backend-5mni\.onrender\.com/g, 'http://localhost:5000');
        fs.writeFileSync(fullPath, content);
        console.log('Restored:', fullPath);
      }
    }
  }
}

replaceInDir('d:\\Purchase-point\\frontend');
console.log('Frontend URLs fully restored to localhost!');
