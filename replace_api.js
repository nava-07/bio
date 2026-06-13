const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      if (content.includes('http://localhost:5000')) {
        // Find double quote strings like "http://localhost:5000/api..."
        content = content.replace(/"http:\/\/localhost:5000([^"]*)"/g, "`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}$1`");
        
        // Find existing template literal substrings: http://localhost:5000
        content = content.replace(/http:\/\/localhost:5000/g, "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}");
        
        // Wait, the first replace put `${...}` into the code. The second replace will replace inside the `${...}` string literal too!
        // Because the first replace put 'http://localhost:5000' inside the fallback string.
        // So we must fix the double replacement.
        
        // Clean up the double replacement inside the fallback:
        content = content.replace(/\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| '\$\{process\.env\.NEXT_PUBLIC_API_URL \|\| 'http:\/\/localhost:5000'\}'\}/g, "${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000'}");

        fs.writeFileSync(fullPath, content, 'utf8');
        console.log('Updated ' + fullPath);
      }
    }
  }
}

processDir('c:\\project\\Biopic\\frontend\\src');
