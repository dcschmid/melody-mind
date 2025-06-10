import { readFileSync } from 'fs';

// Test die Layout-Übersetzungen
console.log('Testing layout translations...');

try {
  // Test Deutsche Übersetzungen
  const deContent = readFileSync('./src/i18n/locales/de.ts', 'utf8');
  const hasLayoutErrorSystem = deContent.includes('layout.error.system');
  const hasLayoutMotionReduced = deContent.includes('layout.accessibility.motion.reduced');
  
  console.log('✓ Deutsche Layout-Übersetzungen:', hasLayoutErrorSystem && hasLayoutMotionReduced ? 'gefunden' : 'fehlen');

  // Test Englische Übersetzungen
  const enContent = readFileSync('./src/i18n/locales/en.ts', 'utf8');
  const hasEnLayoutErrorSystem = enContent.includes('layout.error.system');
  const hasEnLayoutMotionReduced = enContent.includes('layout.accessibility.motion.reduced');
  
  console.log('✓ Englische Layout-Übersetzungen:', hasEnLayoutErrorSystem && hasEnLayoutMotionReduced ? 'gefunden' : 'fehlen');
  
  // Test andere Sprachen
  const languages = ['es', 'fr', 'it', 'pt', 'da', 'nl', 'sv', 'fi'];
  
  languages.forEach(lang => {
    try {
      const content = readFileSync(`./src/i18n/locales/${lang}.ts`, 'utf8');
      const hasLayoutKeys = content.includes('layout.error.system') && content.includes('layout.accessibility.motion.reduced');
      console.log(`✓ ${lang.toUpperCase()} Layout-Übersetzungen:`, hasLayoutKeys ? 'gefunden' : 'fehlen');
    } catch (error) {
      console.log(`✗ ${lang.toUpperCase()} Datei nicht gefunden:`, error.message);
    }
  });

} catch (error) {
  console.error('Fehler beim Test:', error.message);
}
