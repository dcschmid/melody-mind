/**
 * MelodyMind Podcast Cover Generator
 * Creates a professional 1400x1400px podcast cover
 */

const { createCanvas } = require('canvas');
const fs = require('fs');
const path = require('path');

function generatePodcastCover() {
  // Create 1400x1400 canvas (podcast standard)
  const canvas = createCanvas(1400, 1400);
  const ctx = canvas.getContext('2d');

  // Background gradient (purple to dark blue)
  const gradient = ctx.createLinearGradient(0, 0, 1400, 1400);
  gradient.addColorStop(0, '#8B5CF6'); // Purple
  gradient.addColorStop(0.5, '#6366F1'); // Indigo
  gradient.addColorStop(1, '#3B82F6'); // Blue
  
  ctx.fillStyle = gradient;
  ctx.fillRect(0, 0, 1400, 1400);

  // Add noise/texture overlay
  ctx.globalAlpha = 0.1;
  for (let i = 0; i < 5000; i++) {
    const x = Math.random() * 1400;
    const y = Math.random() * 1400;
    const size = Math.random() * 3;
    
    ctx.fillStyle = Math.random() > 0.5 ? '#FFFFFF' : '#000000';
    ctx.beginPath();
    ctx.arc(x, y, size, 0, Math.PI * 2);
    ctx.fill();
  }
  ctx.globalAlpha = 1;

  // Central circle with glassmorphism effect
  const centerX = 700;
  const centerY = 650;
  const radius = 280;

  // Circle shadow
  ctx.save();
  ctx.globalAlpha = 0.3;
  ctx.fillStyle = '#000000';
  ctx.beginPath();
  ctx.arc(centerX + 10, centerY + 10, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Main circle
  ctx.save();
  ctx.globalAlpha = 0.2;
  ctx.fillStyle = '#FFFFFF';
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.fill();
  ctx.restore();

  // Circle border
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.arc(centerX, centerY, radius, 0, Math.PI * 2);
  ctx.stroke();

  // Microphone icon (stylized)
  ctx.fillStyle = '#FFFFFF';
  ctx.save();
  
  // Mic body
  const micX = centerX;
  const micY = centerY - 20;
  ctx.beginPath();
  ctx.roundRect(micX - 30, micY - 60, 60, 120, 30);
  ctx.fill();
  
  // Mic stand
  ctx.fillRect(micX - 3, micY + 60, 6, 40);
  ctx.fillRect(micX - 40, micY + 95, 80, 8);
  
  // Mic grille lines
  ctx.strokeStyle = '#6366F1';
  ctx.lineWidth = 3;
  for (let i = -2; i <= 2; i++) {
    ctx.beginPath();
    ctx.moveTo(micX - 20, micY + (i * 15));
    ctx.lineTo(micX + 20, micY + (i * 15));
    ctx.stroke();
  }
  
  ctx.restore();

  // Musical notes decoration
  ctx.fillStyle = 'rgba(255, 255, 255, 0.6)';
  ctx.font = 'bold 60px serif';
  
  // Note positions around the microphone
  const notes = ['♪', '♫', '♬', '♩'];
  const positions = [
    [centerX - 180, centerY - 80],
    [centerX + 160, centerY - 60],
    [centerX - 160, centerY + 100],
    [centerX + 140, centerY + 120]
  ];
  
  notes.forEach((note, index) => {
    const [x, y] = positions[index];
    ctx.save();
    ctx.translate(x, y);
    ctx.rotate((Math.random() - 0.5) * 0.5);
    ctx.fillText(note, 0, 0);
    ctx.restore();
  });

  // Title "MelodyMind"
  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 120px Arial, sans-serif';
  ctx.textAlign = 'center';
  ctx.textBaseline = 'middle';
  
  // Title shadow
  ctx.save();
  ctx.globalAlpha = 0.5;
  ctx.fillStyle = '#000000';
  ctx.fillText('MelodyMind', centerX + 3, 200 + 3);
  ctx.restore();
  
  // Main title
  ctx.fillStyle = '#FFFFFF';
  ctx.fillText('MelodyMind', centerX, 200);

  // Subtitle "PODCAST"
  ctx.font = 'bold 80px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
  ctx.fillText('PODCAST', centerX, 1150);

  // Tagline
  ctx.font = '40px Arial, sans-serif';
  ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
  ctx.fillText('Discover Music History', centerX, 1220);

  // Decorative elements
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.4)';
  ctx.lineWidth = 2;
  
  // Top decorative line
  ctx.beginPath();
  ctx.moveTo(400, 120);
  ctx.lineTo(1000, 120);
  ctx.stroke();
  
  // Bottom decorative line  
  ctx.beginPath();
  ctx.moveTo(400, 1280);
  ctx.lineTo(1000, 1280);
  ctx.stroke();

  // Corner decorative elements
  const cornerSize = 100;
  ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
  ctx.lineWidth = 4;
  
  // Top-left corner
  ctx.beginPath();
  ctx.moveTo(80, 80 + cornerSize);
  ctx.lineTo(80, 80);
  ctx.lineTo(80 + cornerSize, 80);
  ctx.stroke();
  
  // Top-right corner
  ctx.beginPath();
  ctx.moveTo(1320 - cornerSize, 80);
  ctx.lineTo(1320, 80);
  ctx.lineTo(1320, 80 + cornerSize);
  ctx.stroke();
  
  // Bottom-left corner
  ctx.beginPath();
  ctx.moveTo(80, 1320 - cornerSize);
  ctx.lineTo(80, 1320);
  ctx.lineTo(80 + cornerSize, 1320);
  ctx.stroke();
  
  // Bottom-right corner
  ctx.beginPath();
  ctx.moveTo(1320 - cornerSize, 1320);
  ctx.lineTo(1320, 1320);
  ctx.lineTo(1320, 1320 - cornerSize);
  ctx.stroke();

  return canvas;
}

// Generate and save the cover
try {
  console.log('🎨 Generating MelodyMind Podcast Cover...');
  
  const canvas = generatePodcastCover();
  const buffer = canvas.toBuffer('image/jpeg', { quality: 0.95 });
  
  // Save to public/images/
  const outputPath = path.join(__dirname, '..', 'public', 'images', 'podcast-cover.jpg');
  fs.writeFileSync(outputPath, buffer);
  
  console.log('✅ Podcast cover generated successfully!');
  console.log(`📁 Saved to: ${outputPath}`);
  console.log('📏 Dimensions: 1400x1400px (Perfect for podcast platforms)');
  
} catch (error) {
  console.error('❌ Error generating podcast cover:', error);
  process.exit(1);
}