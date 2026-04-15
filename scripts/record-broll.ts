import { chromium, Page } from 'playwright';
import path from 'path';
import fs from 'fs';

async function smoothMouseMove(page: Page, x: number, y: number, steps = 30) {
  await page.mouse.move(x, y, { steps });
}

async function runBRoll() {
  console.log('🎥 Starting PaciPort B-Roll Recording...');
  
  const browser = await chromium.launch({ headless: false, slowMo: 60 });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: 'recordings/', size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();

  console.log('Loading PaciPort...');
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);
  
  // Navigate to dashboard via "Try Demo Account" button
  console.log('Entering demo mode...');
  await page.locator('text="Try Demo Account"').click();
  await page.waitForLoadState('networkidle');
  await page.waitForTimeout(2000);

  await smoothMouseMove(page, 960, 540);
  await page.waitForTimeout(1000);

  // Positions are pre-selected on load — go straight to migrate
  await page.waitForTimeout(1500);
  // Click the migrate/teleport button
  // Desktop migrate button is the circular ArrowRight inside the lg:flex center column
  const migrateBtn = page.locator('.hidden.lg\\:flex button').first();
  await migrateBtn.click();
  
  await page.waitForTimeout(8000);

  // Close context first to finalize the video, then retrieve path
  await context.close();
  
  const videoPath = await page.video()?.path();
  if (videoPath && fs.existsSync(videoPath)) {
    const finalPath = path.resolve(__dirname, '..', 'recordings', 'PaciPort_BRoll.webm');
    const finalDir = path.dirname(finalPath);
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });
    fs.renameSync(videoPath, finalPath);
    console.log(`🎬 B-Roll recorded at: ${finalPath}`);
  }

  await browser.close();
}

runBRoll().catch(console.error);
