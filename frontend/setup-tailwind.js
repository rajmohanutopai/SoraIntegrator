const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

// Ensure the index.css has the right imports
const indexCssPath = path.join(__dirname, 'src', 'index.css');
const tailwindContent = `@tailwind base;
@tailwind components;
@tailwind utilities;`;

fs.writeFileSync(indexCssPath, tailwindContent);
console.log('✅ Updated index.css with Tailwind directives');

// Make sure package.json has the right scripts
try {
  // Generate the Tailwind CSS config
  execSync('npx tailwindcss init -p', { stdio: 'inherit' });
  console.log('✅ Generated Tailwind config files');
  
  // Build the CSS
  execSync('npx tailwindcss -i ./src/index.css -o ./src/styles.css', { stdio: 'inherit' });
  console.log('✅ Generated Tailwind CSS output');
  
  console.log('🎉 Tailwind CSS setup complete! Run "npm start" to start the development server.');
} catch (error) {
  console.error('❌ Error:', error.message);
}