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
  await page.waitForTimeout(2000);
  
  await smoothMouseMove(page, 960, 540);
  await page.waitForTimeout(1000);

  console.log('Selecting positions...');
  await page.click('text="Select All"');
  await page.waitForTimeout(1000);

  console.log('Executing Migration...');
  await page.click('text="Teleport"'); // Based on the "Position Teleporter" theme and likely button text
  
  await page.waitForTimeout(8000);

  await page.close();
  await context.close();
  
  const videoPath = await page.video()?.path();
  if (videoPath) {
    const finalPath = path.join('/Users/edycu/Projects/DemoStudio/public/projects/PaciPort', 'PaciPort_BRoll.webm');
    const finalDir = path.dirname(finalPath);
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });
    fs.renameSync(videoPath, finalPath);
    console.log(`🎬 B-Roll recorded at: ${finalPath}`);
  }

  await browser.close();
}

runBRoll().catch(console.error);
