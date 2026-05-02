// Script pour sauvegarder les avatars base64
// Usage: node scripts/save-avatars.js

const fs = require('fs');
const path = require('path');

const avatarsDir = path.join(__dirname, '../public/avatars');

// Les données base64 seront insérées ici
const avatars = {
  'yui.png': null,      // Yui - Image 1
  'kayaba.png': null,   // Kayaba - Image 2  
  'asuna.png': null,    // Asuna - Image 3
  'server.png': null,   // Dragon rouge - Image 4 (serveur?)
  'vex.png': null,      // Vex/Vex bot - Image 5
};

Object.entries(avatars).forEach(([filename, base64]) => {
  if (base64) {
    const buffer = Buffer.from(base64, 'base64');
    fs.writeFileSync(path.join(avatarsDir, filename), buffer);
    console.log(`✓ Saved ${filename}`);
  }
});

console.log('\nDone! Place les images base64 dans le script et relance.');
