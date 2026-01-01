const fs = require('fs');
const path = require('path');

// Directory containing your EJS files
const viewsDir = path.join(__dirname, 'views');

// Recursively find all .ejs files
function findEJSFiles(dir) {
  let results = [];
  const list = fs.readdirSync(dir);
  
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    
    if (stat && stat.isDirectory()) {
      results = results.concat(findEJSFiles(filePath));
    } else if (file.endsWith('.ejs')) {
      results.push(filePath);
    }
  });
  
  return results;
}

// Fix layout references in files
function fixLayoutReferences() {
  const ejsFiles = findEJSFiles(viewsDir);
  let fixedCount = 0;
  
  ejsFiles.forEach(filePath => {
    let content = fs.readFileSync(filePath, 'utf8');
    const originalContent = content;
    
    // Replace layout('layout/boilerplate') with layout('./layout/boilerplate')
    content = content.replace(
      /<%\s*layout\(['"]layout\/boilerplate['"]\)\s*%>/g,
      "<% layout('./layout/boilerplate') %>"
    );
    
    // Replace layout('../layout/boilerplate') with layout('./layout/boilerplate')
    // (for files already in subdirectories)
    content = content.replace(
      /<%\s*layout\(['"]\.\.\/layout\/boilerplate['"]\)\s*%>/g,
      "<% layout('./layout/boilerplate') %>"
    );
    
    if (content !== originalContent) {
      fs.writeFileSync(filePath, content, 'utf8');
      console.log(`✓ Fixed: ${path.relative(viewsDir, filePath)}`);
      fixedCount++;
    }
  });
  
  console.log(`\n✅ Fixed ${fixedCount} file(s)`);
}

// Run the fix
try {
  console.log('🔧 Fixing layout references...\n');
  fixLayoutReferences();
  console.log('\n✨ All layout references have been fixed!');
  console.log('You can now restart your server.');
} catch (error) {
  console.error('❌ Error:', error.message);
  process.exit(1);
}