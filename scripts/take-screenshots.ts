import { chromium } from 'playwright';
import fs from 'fs';

async function runScreenshots() {
  console.log('📸 Starting PaciPort Screenshot Capture...');
  
  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setViewportSize({ width: 1920, height: 1080 });

  // 1. Dashboard
  console.log('Capturing Dashboard...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.screenshot({ path: 'screenshots/PaciPort_Dashboard.png', fullPage: true });

  await browser.close();
  console.log('✅ Screenshots saved in screenshots/');
}

// Ensure directory exists
if (!fs.existsSync('screenshots')) fs.mkdirSync('screenshots');

runScreenshots().catch(console.error);
