import { chromium } from 'playwright';
import { spawn } from 'child_process';
import path from 'path';
import fs from 'fs';

const AUDIO_PATH = path.resolve(__dirname, '..', 'recordings', 'demo_audio.mp3');

async function runDemo() {
  console.log('🚀 Starting PaciPort Demo Recording Script...');
  
  const browser = await chromium.launch({ headless: true, slowMo: 50 });
  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: { dir: 'recordings/', size: { width: 1920, height: 1080 } }
  });

  const page = await context.newPage();
  await page.goto('http://localhost:3000');
  await page.waitForLoadState('networkidle');
  
  const hasAudio = fs.existsSync(AUDIO_PATH);
  let audioProcess;
  const startTime = Date.now();

  if (hasAudio) {
    console.log('🔊 Starting audio...');
    audioProcess = spawn('afplay', [AUDIO_PATH]);
  }

  const waitTo = async (targetSecond: number) => {
    const targetMs = targetSecond * 1000;
    const elapsed = Date.now() - startTime;
    if (targetMs > elapsed) await page.waitForTimeout(targetMs - elapsed);
  };

  // 0:00-0:08 (8s) reading the landing page 
  await waitTo(8);
  // 0:08-0:18 PaciPort dashboard appears
  await page.locator('text="Dashboard"').first().click();
  await page.waitForLoadState('networkidle');
  
  // UNCHECK all default positions first, so we can manually select SOL
  await waitTo(18);
  await page.locator('label:has-text("Select All")').click();
  
  await waitTo(28);
  // 0:35-0:50 "I want to migrate my SOL position to Pacifica."
  // Click SOL card
  await page.locator('div').filter({ hasText: /^SOL-PERP/ }).first().click();

  // "0.10% max slippage — aggressive but safe."
  await waitTo(34);
  // Click Desktop Migrate button (hidden mobile, flex lg)
  await page.locator('.hidden.lg\\:flex button').click();

  // Wait for migration receipt view
  await waitTo(66);
  // Close receipt card
  await page.locator('button:has-text("Close Receipt")').click();

  // "Let me migrate the entire portfolio"
  await waitTo(71);
  // Check Select All
  await page.locator('label:has-text("Select All")').click();

  await waitTo(78);
  // Click MIGRATE again
  await page.locator('.hidden.lg\\:flex button').click();

  // Await final narrative finish
  await waitTo(110);
  
  await page.close();
  await context.close();
  
  const videoPath = await page.video()?.path();
  if (videoPath) {
    const finalPath = path.resolve(__dirname, '..', 'recordings', 'PaciPort_Demo.webm');
    const finalDir = path.dirname(finalPath);
    if (!fs.existsSync(finalDir)) fs.mkdirSync(finalDir, { recursive: true });
    fs.renameSync(videoPath, finalPath);
    console.log(`🎬 Demo recorded at: ${finalPath}`);
  }

  await browser.close();
  if (audioProcess) audioProcess.kill();
  process.exit(0);
}

runDemo().catch(console.error);
