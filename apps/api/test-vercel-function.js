
// Let's test what it's like to import api/[...path].ts
try {
  console.log("Trying to import api/[...path].ts's underlying code via the bundle!");
  
  // First, let's check if dist is there
  const fs = require('fs');
  const path = require('path');
  
  const distVercel = path.join(__dirname, 'dist', 'vercel.js');
  if (fs.existsSync(distVercel)) {
    console.log('dist/vercel.js exists! Great!');
    
    const app = require(distVercel);
    console.log('Imported app successfully!', typeof app);
    
    // Now test /api/health
    console.log('Test app for /api/health');
    
    // Let's simulate an express request
    console.log('App exported:', app);
    
  } else {
    console.error('dist/vercel.js NOT found!');
  }
  
} catch (error) {
  console.error('ERROR:', error);
  console.error('STACK:', error.stack);
}
