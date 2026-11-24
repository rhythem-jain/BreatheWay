/**
 * Automated Demo Video Recording Pipeline
 * Uses Playwright, kokoro-js (free local neural TTS), and ffmpeg
 * Produces a smooth, human-like 1080p walkthrough video of the deployed Urban Air web app
 */

import { chromium } from 'playwright';
import { KokoroTTS } from 'kokoro-js';
import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const TARGET_URL = 'https://prompt-wars-challenge-6.vercel.app/';
const AUDIO_DIR = './audio-clips';
const DEMO_OUTPUT_DIR = './demo-output';
const FINAL_VIDEO_PATH = './urban-air-demo-4min.mp4';

// Ensure directories exist
if (!fs.existsSync(AUDIO_DIR)) fs.mkdirSync(AUDIO_DIR, { recursive: true });
if (!fs.existsSync(DEMO_OUTPUT_DIR)) fs.mkdirSync(DEMO_OUTPUT_DIR, { recursive: true });

// Narration scripts split into natural sentence chunks for 100% complete articulation
const SCENE_SCRIPTS = [
  {
    id: 1,
    name: 'scene1_intro_dashboard',
    title: 'Intro & Live Air Telemetry Dashboard',
    chunks: [
      `Urban air pollution is often treated as a single city-wide number, but in reality, the air you breathe changes dramatically from street to street and hour to hour.`,
      `Welcome to our Urban Air Telemetry and Personal Exposure Management platform—built for PromptWars Challenge 6 to turn hyperlocal environmental data into clear, actionable daily decisions.`,
      `Right here on the live Air Telemetry Dashboard, users can monitor real-time AQI calculated with US EPA breakpoints, track PM2.5 and PM10 concentrations, and inspect meteorological dispersion trends.`,
      `Using the interactive Smog Heatmap, you can click into individual urban zones to see localized pollution spikes, historical sparklines, and immediate health alerts.`
    ]
  },
  {
    id: 2,
    name: 'scene2_routine_gemini',
    title: 'Daily Routine Optimizer & Gemini AI',
    chunks: [
      `Knowing the current air quality is only half the battle—knowing how to plan your day around it is what actually protects your health.`,
      `In the Daily Routine Optimizer, we combine deterministic air-quality forecasting with the Google Gemini API through our cached backend service.`,
      `Simply choose a health persona—whether you are an outdoor runner, a daily commuter, or someone managing respiratory sensitivities—and the platform dynamically reshapes your schedule.`,
      `It identifies the lowest-exposure windows for outdoor workouts, errands, and high-exertion tasks, translating raw telemetry into a personalized, hour-by-hour timeline.`
    ]
  },
  {
    id: 3,
    name: 'scene3_transit_planner',
    title: 'Low-Exposure Transit Planner',
    chunks: [
      `For urban commuters, the fastest route on a map is rarely the healthiest one.`,
      `Our Transit Exposure Planner tackles this directly using a custom Dijkstra exposure-routing engine alongside a respiratory commute dose model.`,
      `Instead of optimizing purely for distance, the engine weighs zone-by-zone pollutant density, travel duration, and breathing rates across different transport modes.`,
      `In the comparison table, you can immediately see the difference in inhaled particulate dose between walking, cycling, taking public transit, or driving—empowering commuters to pick the cleanest path without sacrificing practicality.`
    ]
  },
  {
    id: 4,
    name: 'scene4_iaq_center',
    title: 'Indoor Air Quality (IAQ) Center',
    chunks: [
      `When outdoor smog peaks, most people head indoors—assuming they are automatically safe. However, indoor air quality depends heavily on ventilation timing and filtration capacity.`,
      `Inside the IAQ Center, our CADR calculation engine models room volume and air-change rates to show exactly how fast your purifier can clear indoor particulates.`,
      `Below that, the smart Window Schedule tells you the exact hours to open windows for natural cross-ventilation and when to seal them shut.`,
      `And because clean air shouldn't be a luxury, we also include a DIY Filtration Hack Grid with affordable, science-backed guides like Corsi-Rosenthal boxes.`
    ]
  },
  {
    id: 5,
    name: 'scene5_community_auth',
    title: 'Community Hub, Multilingual Access & Auth',
    chunks: [
      `Lasting environmental change requires collective momentum.`,
      `The Community Hub allows residents to commit to shareable clean-air pledges—from carpooling and transit shifts to reducing household emissions—building local accountability.`,
      `Because urban air quality affects everyone, the entire platform is built with WCAG accessibility standards, a high-contrast light-mode interface, and built-in multi-language support right in the header, backed by secure Firebase Authentication and Firestore rules.`
    ]
  },
  {
    id: 6,
    name: 'scene6_production_closing',
    title: 'Production Architecture & Closing',
    chunks: [
      `Under the hood, this isn't just a frontend prototype.`,
      `It is a production-ready full-stack application powered by an Express backend with request validation, security middleware, response caching, and seven automated test suites covering our API, DOM, routing, and environmental math—all deployed live on Vercel.`,
      `Thank you for watching, and let's build healthier, cleaner cities together.`
    ]
  }
];

// Helper to run ffprobe for duration
function getAudioDuration(filePath) {
  const cmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
  return parseFloat(execSync(cmd).toString().trim());
}

// ============================================================
// STEP 1: GENERATE NATURAL AUDIO CLIPS USING KOKORO-JS
// ============================================================
async function generateAllAudio() {
  console.log('\n======================================================');
  console.log(' STEP 1: Generating High-Quality Audio via Kokoro-TTS ');
  console.log('======================================================');

  let tts = null;
  const sceneAudios = [];
  let totalAudioSec = 0;

  for (const scene of SCENE_SCRIPTS) {
    const finalSceneWav = path.join(AUDIO_DIR, `${scene.name}.wav`);

    // Check if high-quality wav is already synthesized and valid
    if (fs.existsSync(finalSceneWav) && fs.statSync(finalSceneWav).size > 1000000) {
      const durSec = getAudioDuration(finalSceneWav);
      totalAudioSec += durSec;
      sceneAudios.push({
        ...scene,
        filePath: finalSceneWav,
        durationSec: durSec,
        durationMs: Math.round(durSec * 1000)
      });
      console.log(`Found existing audio for Scene ${scene.id} (${scene.title}): ${durSec.toFixed(2)}s`);
      continue;
    }

    if (!tts) {
      console.log('Loading KokoroTTS (voice: am_michael, speed: 0.98)...');
      tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', { dtype: 'q8' });
    }

    console.log(`\nSynthesizing Scene ${scene.id}: ${scene.title}...`);
    const chunkFiles = [];
    let chunkIdx = 0;
    for (const chunkText of scene.chunks) {
      chunkIdx++;
      const chunkWav = path.join(AUDIO_DIR, `${scene.name}_chunk${chunkIdx}.wav`);
      const audio = await tts.generate(chunkText, {
        voice: 'am_michael',
        speed: 0.98,
      });
      await audio.save(chunkWav);
      chunkFiles.push(chunkWav);
    }

    // Concatenate chunks into final scene wav using ffmpeg
    const concatListFile = path.join(AUDIO_DIR, `${scene.name}_chunks.txt`);
    fs.writeFileSync(concatListFile, chunkFiles.map(f => `file '${path.resolve(f).replace(/\\/g, '/')}'`).join('\n'));
    execSync(`ffmpeg -y -f concat -safe 0 -i "${concatListFile}" -c copy "${finalSceneWav}"`);

    // Clean up intermediate chunk files
    chunkFiles.forEach(f => fs.unlinkSync(f));
    fs.unlinkSync(concatListFile);

    const durSec = getAudioDuration(finalSceneWav);
    totalAudioSec += durSec;
    sceneAudios.push({
      ...scene,
      filePath: finalSceneWav,
      durationSec: durSec,
      durationMs: Math.round(durSec * 1000)
    });
    console.log(`  -> Scene ${scene.id} Complete! Duration: ${durSec.toFixed(2)}s`);
  }

  const breathingPause = 1.5;
  const totalBreathingPauses = breathingPause * SCENE_SCRIPTS.length;
  const grandTotal = totalAudioSec + totalBreathingPauses;

  console.log('\n--- Audio Generation Verification ---');
  sceneAudios.forEach(s => console.log(`  Scene ${s.id} (${s.title}): ${s.durationSec.toFixed(2)}s`));
  console.log(`  Total Audio Duration: ${totalAudioSec.toFixed(2)}s`);
  console.log(`  Total Breathing Pauses: ${totalBreathingPauses.toFixed(2)}s`);
  console.log(`  Combined Duration: ${grandTotal.toFixed(2)}s (~${Math.floor(grandTotal / 60)}m ${Math.round(grandTotal % 60)}s)`);
  console.log(`  Requirement (>= 245s / 4m 05s): ${grandTotal >= 245 ? 'PASSED ✅' : 'FAILED ❌'}`);

  return { sceneAudios, grandTotal };
}

// ============================================================
// STEP 2: HUMAN-LIKE INTERACTION HELPERS
// ============================================================
async function setupCursorAndStyles(page) {
  // Prevent any floating toast alerts from intercepting clicks
  await page.addStyleTag({
    content: `
      [role="alert"] {
        pointer-events: none !important;
      }
      [role="alert"] button {
        pointer-events: auto !important;
      }
    `
  }).catch(() => {});

  // Inject subtle circular cursor highlight
  await page.evaluate(() => {
    if (document.getElementById('playwright-cursor-highlight')) return;
    const cursor = document.createElement('div');
    cursor.id = 'playwright-cursor-highlight';
    cursor.style.position = 'fixed';
    cursor.style.top = '0px';
    cursor.style.left = '0px';
    cursor.style.width = '24px';
    cursor.style.height = '24px';
    cursor.style.borderRadius = '50%';
    cursor.style.backgroundColor = 'rgba(6, 182, 212, 0.45)';
    cursor.style.border = '2px solid rgba(6, 182, 212, 0.9)';
    cursor.style.boxShadow = '0 0 14px rgba(6, 182, 212, 0.7)';
    cursor.style.pointerEvents = 'none';
    cursor.style.zIndex = '9999999';
    cursor.style.transform = 'translate(-50%, -50%)';
    cursor.style.transition = 'width 0.15s ease, height 0.15s ease, background-color 0.15s ease';
    document.documentElement.appendChild(cursor);

    window.addEventListener('mousemove', (e) => {
      cursor.style.left = `${e.clientX}px`;
      cursor.style.top = `${e.clientY}px`;
    }, { passive: true });
    window.addEventListener('mousedown', () => {
      cursor.style.width = '18px';
      cursor.style.height = '18px';
      cursor.style.backgroundColor = 'rgba(16, 185, 129, 0.75)';
    }, { passive: true });
    window.addEventListener('mouseup', () => {
      cursor.style.width = '24px';
      cursor.style.height = '24px';
      cursor.style.backgroundColor = 'rgba(6, 182, 212, 0.45)';
    }, { passive: true });
  }).catch(() => {});
}

async function humanMove(page, selectorOrCoords) {
  let targetX = 0;
  let targetY = 0;

  if (typeof selectorOrCoords === 'string') {
    const el = await page.$(selectorOrCoords);
    if (!el) return;
    const box = await el.boundingBox();
    if (!box) return;
    targetX = box.x + box.width / 2;
    targetY = box.y + box.height / 2;
  } else {
    targetX = selectorOrCoords.x;
    targetY = selectorOrCoords.y;
  }

  await page.mouse.move(targetX, targetY, { steps: 25 });
}

async function safeClick(el) {
  if (!el) return;
  try {
    await el.click({ timeout: 2500 });
  } catch {
    try {
      await el.click({ force: true, timeout: 2000 });
    } catch {
      await el.evaluate(e => e.click()).catch(() => {});
    }
  }
}

async function humanClick(page, selector) {
  const el = await page.$(selector);
  if (!el) return;
  try {
    await el.scrollIntoViewIfNeeded({ timeout: 1500 }).catch(() => {});
  } catch {}
  const box = await el.boundingBox();
  if (box) {
    await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
    await page.waitForTimeout(350); // Natural hover pause
  }
  await safeClick(el);
  await page.waitForTimeout(500); // Post-click pause
}

async function humanScroll(page, pixels, durationMs = 1100) {
  const steps = 15;
  const stepPixel = pixels / steps;
  const stepDelay = durationMs / steps;
  for (let i = 0; i < steps; i++) {
    await page.mouse.wheel(0, stepPixel);
    await page.waitForTimeout(stepDelay);
  }
  await page.waitForTimeout(600); // Reading pause
}

export async function humanType(page, selector, text) {
  await humanClick(page, selector);
  for (const char of text) {
    await page.keyboard.type(char, { delay: Math.floor(Math.random() * 50) + 60 });
  }
}

// ============================================================
// STEP 3: PLAYWRIGHT SCENE-BY-SCENE RECORDING
// ============================================================
async function recordScenes(sceneAudios) {
  console.log('\n======================================================');
  console.log(' STEP 2: Recording Synchronized Video with Playwright ');
  console.log('======================================================');

  // Clean old webm in demo output
  const existingFiles = fs.readdirSync(DEMO_OUTPUT_DIR);
  existingFiles.forEach(f => {
    if (f.endsWith('.webm')) fs.unlinkSync(path.join(DEMO_OUTPUT_DIR, f));
  });

  const browser = await chromium.launch({
    headless: true,
  });

  const context = await browser.newContext({
    viewport: { width: 1920, height: 1080 },
    recordVideo: {
      dir: DEMO_OUTPUT_DIR,
      size: { width: 1920, height: 1080 }
    }
  });

  const page = await context.newPage();
  console.log(`Navigating to ${TARGET_URL}...`);
  await page.goto(TARGET_URL, { waitUntil: 'domcontentloaded', timeout: 60000 });
  await page.waitForLoadState('networkidle', { timeout: 15000 }).catch(() => {});
  await setupCursorAndStyles(page);

  const sceneStartDelays = [];
  const recordingStartTime = Date.now();

  // -----------------------------------------------------------
  // Scene 1: Intro & Live Air Telemetry Dashboard
  // -----------------------------------------------------------
  {
    const scene = sceneAudios[0];
    const targetMs = scene.durationMs + 1500;
    const startMs = Date.now();
    sceneStartDelays.push(startMs - recordingStartTime);
    console.log(`\nRecording Scene 1 (${scene.title}) - Allocated: ${(targetMs / 1000).toFixed(2)}s`);

    await page.waitForTimeout(2000);

    // Hover over KPI header and spectrum
    await humanMove(page, 'h1');
    await page.waitForTimeout(1000);
    await humanMove(page, 'text=Dominant:');
    await page.waitForTimeout(800);

    // Hover over Boundary Microclimate and Inversion Risk cards
    await humanMove(page, 'text=Boundary Microclimate');
    await page.waitForTimeout(1000);
    await humanMove(page, 'text=Inversion Dynamics');
    await page.waitForTimeout(1000);

    // Scroll to Smog Heatmap
    await humanScroll(page, 450, 1000);
    await humanMove(page, 'text=Urban Smog Heatmap');
    await page.waitForTimeout(1000);

    // Hover across heatmap zones in SVG canvas
    await page.mouse.move(500, 480, { steps: 25 });
    await page.waitForTimeout(600);
    await page.mouse.move(650, 520, { steps: 25 });
    await page.waitForTimeout(600);
    await page.mouse.move(800, 470, { steps: 25 });
    await page.waitForTimeout(600);

    // Scroll down to Zone Cards
    await humanScroll(page, 350, 1000);
    await page.waitForTimeout(800);

    // Click zone card with higher pollution to show sparkline
    const zoneButtons = await page.$$('button:has-text("Switch Telemetry")');
    if (zoneButtons.length > 0) {
      const box = await zoneButtons[0].boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
        await page.waitForTimeout(350);
        await safeClick(zoneButtons[0]);
        await page.waitForTimeout(1200);
      }
    }

    // Scroll down to view sparklines and telemetry
    await humanScroll(page, 350, 1000);
    await page.waitForTimeout(1500);

    // Click another zone card to contrast
    if (zoneButtons.length > 1) {
      const box2 = await zoneButtons[1].boundingBox();
      if (box2) {
        await page.mouse.move(box2.x + box2.width / 2, box2.y + box2.height / 2, { steps: 25 });
        await page.waitForTimeout(350);
        await safeClick(zoneButtons[1]);
        await page.waitForTimeout(1200);
      }
    }

    // Scroll back up and interact with Simulator button
    await humanScroll(page, -800, 1200);
    await humanClick(page, 'text=Simulate Winter Smog Spike');
    await page.waitForTimeout(1500);
    await humanClick(page, 'text=Simulate Solar Wind Cleansing');
    await page.waitForTimeout(1500);

    const elapsed = Date.now() - startMs;
    if (elapsed < targetMs) {
      console.log(`  Scene 1 pacing buffer: ${((targetMs - elapsed) / 1000).toFixed(2)}s`);
      await page.waitForTimeout(targetMs - elapsed);
    }
  }

  // -----------------------------------------------------------
  // Scene 2: Daily Routine Optimizer & Gemini AI
  // -----------------------------------------------------------
  {
    const scene = sceneAudios[1];
    const targetMs = scene.durationMs + 1500;
    const startMs = Date.now();
    sceneStartDelays.push(startMs - recordingStartTime);
    console.log(`\nRecording Scene 2 (${scene.title}) - Allocated: ${(targetMs / 1000).toFixed(2)}s`);

    // Click Daily Routine Tab
    await humanClick(page, '#tab-routine, [role="tab"]:has-text("Routine")');
    await page.waitForTimeout(1200);
    await setupCursorAndStyles(page);

    // Hover over hero banner
    await humanMove(page, 'h2:has-text("Routine")');
    await page.waitForTimeout(1000);

    // Select personas
    const personaCards = await page.$$('button[aria-pressed]');
    if (personaCards.length >= 2) {
      const p1Box = await personaCards[1].boundingBox();
      if (p1Box) {
        await page.mouse.move(p1Box.x + p1Box.width / 2, p1Box.y + p1Box.height / 2, { steps: 25 });
        await page.waitForTimeout(500);
        await safeClick(personaCards[1]);
        await page.waitForTimeout(1000);
      }
      if (personaCards.length >= 3) {
        const p2Box = await personaCards[2].boundingBox();
        if (p2Box) {
          await page.mouse.move(p2Box.x + p2Box.width / 2, p2Box.y + p2Box.height / 2, { steps: 25 });
          await page.waitForTimeout(500);
          await safeClick(personaCards[2]);
          await page.waitForTimeout(1000);
        }
      }
    }

    // Trigger AI Smart Schedule generation
    const genButton = await page.$('button:has-text("Generate Smart Schedule")');
    if (genButton) {
      const box = await genButton.boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
        await page.waitForTimeout(400);
        await safeClick(genButton);
        await page.waitForTimeout(1800);
      }
    }

    // Scroll down to explore Routine Timeline
    await humanScroll(page, 450, 1000);
    await humanMove(page, 'text=Optimal Outdoor Activity Window');
    await page.waitForTimeout(1500);

    await humanScroll(page, 400, 1000);
    await humanMove(page, 'text=Hour-by-Hour');
    await page.waitForTimeout(1200);

    // Smooth scroll through hourly cards
    await humanScroll(page, 300, 1000);
    await page.waitForTimeout(1000);
    await humanScroll(page, 300, 1000);
    await page.waitForTimeout(1500);

    // Scroll back to top
    await humanScroll(page, -1200, 1200);

    const elapsed = Date.now() - startMs;
    if (elapsed < targetMs) {
      console.log(`  Scene 2 pacing buffer: ${((targetMs - elapsed) / 1000).toFixed(2)}s`);
      await page.waitForTimeout(targetMs - elapsed);
    }
  }

  // -----------------------------------------------------------
  // Scene 3: Low-Exposure Transit Planner
  // -----------------------------------------------------------
  {
    const scene = sceneAudios[2];
    const targetMs = scene.durationMs + 1500;
    const startMs = Date.now();
    sceneStartDelays.push(startMs - recordingStartTime);
    console.log(`\nRecording Scene 3 (${scene.title}) - Allocated: ${(targetMs / 1000).toFixed(2)}s`);

    // Click Transit Planner Tab
    await humanClick(page, '#tab-transit, [role="tab"]:has-text("Transit")');
    await page.waitForTimeout(1200);
    await setupCursorAndStyles(page);

    await humanMove(page, 'h2:has-text("Transit")');
    await page.waitForTimeout(1000);

    // Select Origin and Destination
    const originSelect = await page.$('#transit-origin');
    if (originSelect) {
      await humanClick(page, '#transit-origin');
      await originSelect.selectOption({ index: 1 });
      await page.waitForTimeout(1000);
    }

    const destSelect = await page.$('#transit-destination');
    if (destSelect) {
      await humanClick(page, '#transit-destination');
      await destSelect.selectOption({ index: 3 });
      await page.waitForTimeout(1200);
    }

    // Hover over calculated route distance & trajectory breadcrumbs
    await humanMove(page, 'text=Distance:');
    await page.waitForTimeout(1200);

    // Scroll to Transit Comparison Table
    await humanScroll(page, 400, 1000);
    await page.waitForTimeout(1000);

    // Hover over table rows (Walking, Cycling, Metro, Electric Bus, Cab)
    await humanMove(page, 'text=Transit Mode');
    await page.waitForTimeout(1000);
    await humanMove(page, 'text=PM2.5 Inhaled Dose');
    await page.waitForTimeout(1200);

    const tableRows = await page.$$('table tbody tr');
    for (let i = 0; i < Math.min(tableRows.length, 4); i++) {
      const rowBox = await tableRows[i].boundingBox();
      if (rowBox) {
        await page.mouse.move(rowBox.x + 200, rowBox.y + rowBox.height / 2, { steps: 25 });
        await page.waitForTimeout(1200);
      }
    }

    await page.waitForTimeout(2000);

    const elapsed = Date.now() - startMs;
    if (elapsed < targetMs) {
      console.log(`  Scene 3 pacing buffer: ${((targetMs - elapsed) / 1000).toFixed(2)}s`);
      await page.waitForTimeout(targetMs - elapsed);
    }
  }

  // -----------------------------------------------------------
  // Scene 4: Indoor Air Quality (IAQ) Center
  // -----------------------------------------------------------
  {
    const scene = sceneAudios[3];
    const targetMs = scene.durationMs + 1500;
    const startMs = Date.now();
    sceneStartDelays.push(startMs - recordingStartTime);
    console.log(`\nRecording Scene 4 (${scene.title}) - Allocated: ${(targetMs / 1000).toFixed(2)}s`);

    // Click IAQ Center Tab
    await humanClick(page, '#tab-iaq, [role="tab"]:has-text("Indoor Air")');
    await page.waitForTimeout(1200);
    await setupCursorAndStyles(page);

    await humanMove(page, 'h2:has-text("CADR")');
    await page.waitForTimeout(1000);

    // Switch between room pills (Living Room, Bedroom, Nursery)
    const roomButtons = await page.$$('button:has-text("Living Room"), button:has-text("Master Bedroom"), button:has-text("Nursery")');
    if (roomButtons.length >= 2) {
      await humanClick(page, 'button:has-text("Master Bedroom")');
      await page.waitForTimeout(1000);
      await humanClick(page, 'button:has-text("Nursery")');
      await page.waitForTimeout(1000);
      await humanClick(page, 'button:has-text("Living Room")');
      await page.waitForTimeout(1000);
    }

    // Smoothly drag Room Area Slider
    const areaSlider = await page.$('#room-area-range');
    if (areaSlider) {
      const box = await areaSlider.boundingBox();
      if (box) {
        await page.mouse.move(box.x + 20, box.y + box.height / 2, { steps: 25 });
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.7, box.y + box.height / 2, { steps: 35 });
        await page.mouse.up();
        await page.waitForTimeout(1200);
      }
    }

    // Smoothly drag Purifier CADR Slider
    const cadrSlider = await page.$('#room-cadr-range');
    if (cadrSlider) {
      const box = await cadrSlider.boundingBox();
      if (box) {
        await page.mouse.move(box.x + 40, box.y + box.height / 2, { steps: 25 });
        await page.mouse.down();
        await page.mouse.move(box.x + box.width * 0.65, box.y + box.height / 2, { steps: 35 });
        await page.mouse.up();
        await page.waitForTimeout(1200);
      }
    }

    // Hover over Target CADR & ACH cards
    await humanMove(page, 'text=Target CADR');
    await page.waitForTimeout(1000);
    await humanMove(page, 'text=Effective Air Changes');
    await page.waitForTimeout(1000);

    // Scroll to Window Schedule
    await humanScroll(page, 450, 1000);
    await humanMove(page, 'text=Smart Inversion-Aware Window');
    await page.waitForTimeout(1200);

    // Hover over morning lock, flush window, rush trap
    await humanMove(page, 'text=Morning Inversion Lock');
    await page.waitForTimeout(1000);
    await humanMove(page, 'text=Optimal Flush Window');
    await page.waitForTimeout(1000);
    await humanMove(page, 'text=Evening Rush Trap');
    await page.waitForTimeout(1000);

    // Scroll to DIY Hack Grid
    await humanScroll(page, 450, 1000);
    await humanMove(page, 'text=Low-Cost & DIY');
    await page.waitForTimeout(1500);

    // Hover over DIY cards
    await humanMove(page, 'text=Corsi-Rosenthal');
    await page.waitForTimeout(1200);

    const elapsed = Date.now() - startMs;
    if (elapsed < targetMs) {
      console.log(`  Scene 4 pacing buffer: ${((targetMs - elapsed) / 1000).toFixed(2)}s`);
      await page.waitForTimeout(targetMs - elapsed);
    }
  }

  // -----------------------------------------------------------
  // Scene 5: Community Hub, Multilingual Access & Auth
  // -----------------------------------------------------------
  {
    const scene = sceneAudios[4];
    const targetMs = scene.durationMs + 1500;
    const startMs = Date.now();
    sceneStartDelays.push(startMs - recordingStartTime);
    console.log(`\nRecording Scene 5 (${scene.title}) - Allocated: ${(targetMs / 1000).toFixed(2)}s`);

    // Click Community Hub Tab
    await humanClick(page, '#tab-community, [role="tab"]:has-text("Community")');
    await page.waitForTimeout(1200);
    await setupCursorAndStyles(page);

    await humanMove(page, 'h2:has-text("Community Smog Abatement")');
    await page.waitForTimeout(1000);

    // Hover over impact counters
    await humanMove(page, 'text=CO₂ Prevented');
    await page.waitForTimeout(1000);
    await humanMove(page, 'text=PM2.5 Averted');
    await page.waitForTimeout(1000);

    // Scroll down to Pledge Cards
    await humanScroll(page, 400, 1000);
    await page.waitForTimeout(1000);

    // Click a pledge action button
    const pledgeButtons = await page.$$('button:has-text("Pledge Action"), button:has-text("Cancel Pledge")');
    if (pledgeButtons.length > 0) {
      const box = await pledgeButtons[0].boundingBox();
      if (box) {
        await page.mouse.move(box.x + box.width / 2, box.y + box.height / 2, { steps: 25 });
        await page.waitForTimeout(400);
        await safeClick(pledgeButtons[0]);
        await page.waitForTimeout(1500);
      }
    }

    // Scroll back to top
    await humanScroll(page, -600, 1000);

    // Demonstrate Multi-language selector in sidebar
    const langSelect = await page.$('#sidebar-lang, select[aria-label*="Language"]');
    if (langSelect) {
      await humanClick(page, '#sidebar-lang, select[aria-label*="Language"]');
      await langSelect.selectOption('hi').catch(() => {});
      await page.waitForTimeout(1500);
      await langSelect.selectOption('en').catch(() => {});
      await page.waitForTimeout(1000);
    }

    // Open Auth Modal
    const authBtn = await page.$('button:has-text("Sign In"), button:has-text("Citizen Portal")');
    if (authBtn) {
      await humanClick(page, 'button:has-text("Sign In")');
      await page.waitForTimeout(1200);

      // Fast prototype fill
      const fastFillBtn = await page.$('button:has-text("Director Chen")');
      if (fastFillBtn) {
        await humanClick(page, 'button:has-text("Director Chen")');
        await page.waitForTimeout(1500);
      }

      // Close modal
      const closeBtn = await page.$('button[aria-label="Close dialog"]');
      if (closeBtn) {
        await humanClick(page, 'button[aria-label="Close dialog"]');
        await page.waitForTimeout(1000);
      } else {
        await page.keyboard.press('Escape');
        await page.waitForTimeout(1000);
      }
    }

    const elapsed = Date.now() - startMs;
    if (elapsed < targetMs) {
      console.log(`  Scene 5 pacing buffer: ${((targetMs - elapsed) / 1000).toFixed(2)}s`);
      await page.waitForTimeout(targetMs - elapsed);
    }
  }

  // -----------------------------------------------------------
  // Scene 6: Production Architecture & Closing
  // -----------------------------------------------------------
  {
    const scene = sceneAudios[5];
    const targetMs = scene.durationMs + 1500;
    const startMs = Date.now();
    sceneStartDelays.push(startMs - recordingStartTime);
    console.log(`\nRecording Scene 6 (${scene.title}) - Allocated: ${(targetMs / 1000).toFixed(2)}s`);

    // Click back to Air Telemetry Dashboard
    await humanClick(page, '#tab-dashboard, [role="tab"]:has-text("Air Telemetry")');
    await page.waitForTimeout(1200);
    await setupCursorAndStyles(page);

    // Smooth scroll through entire dashboard
    await humanScroll(page, 500, 1200);
    await page.waitForTimeout(1000);
    await humanScroll(page, 600, 1200);
    await page.waitForTimeout(1200);

    // Scroll back to hero
    await humanScroll(page, -1200, 1500);
    await page.waitForTimeout(1000);

    // Hover over main logo and EPA scale
    await humanMove(page, 'h1');
    await page.waitForTimeout(2500);

    const elapsed = Date.now() - startMs;
    if (elapsed < targetMs) {
      console.log(`  Scene 6 pacing buffer: ${((targetMs - elapsed) / 1000).toFixed(2)}s`);
      await page.waitForTimeout(targetMs - elapsed);
    }
  }

  // Graceful shutdown to flush video
  console.log('\nClosing browser and finalizing video stream...');
  await page.waitForTimeout(2000);
  await context.close();
  await browser.close();

  // Find recorded video file
  const videoFiles = fs.readdirSync(DEMO_OUTPUT_DIR).filter(f => f.endsWith('.webm'));
  if (videoFiles.length === 0) {
    throw new Error('No .webm video file found in demo-output directory!');
  }
  const rawVideoPath = path.join(DEMO_OUTPUT_DIR, videoFiles[0]);
  console.log(`Raw video saved to: ${rawVideoPath}`);

  return { rawVideoPath, sceneStartDelays };
}

// ============================================================
// STEP 4: FINAL AUDIO + VIDEO SYNCHRONIZATION VIA FFMPEG
// ============================================================
async function assembleFinalVideo(rawVideoPath, sceneAudios, sceneStartDelays) {
  console.log('\n======================================================');
  console.log(' STEP 3: Merging & Multiplexing with FFmpeg           ');
  console.log('======================================================');

  // Build ffmpeg adelay filter
  const filterParts = [];
  const mixLabels = [];
  const inputArgs = ['-y', '-i', path.resolve(rawVideoPath)];

  sceneAudios.forEach((scene, i) => {
    inputArgs.push('-i', path.resolve(scene.filePath));
    const delayMs = Math.max(0, sceneStartDelays[i]);
    filterParts.push(`[${i + 1}:a]adelay=${delayMs}|${delayMs}[a${i + 1}]`);
    mixLabels.push(`[a${i + 1}]`);
  });

  const filterComplex = `${filterParts.join(';')};${mixLabels.join('')}amix=inputs=${sceneAudios.length}:duration=longest:normalize=0[aout]`;

  const ffmpegArgs = [
    ...inputArgs,
    '-filter_complex', filterComplex,
    '-map', '0:v',
    '-map', '[aout]',
    '-c:v', 'libx264',
    '-pix_fmt', 'yuv420p',
    '-preset', 'fast',
    '-crf', '20',
    '-c:a', 'aac',
    '-b:a', '192k',
    '-movflags', '+faststart',
    path.resolve(FINAL_VIDEO_PATH)
  ];

  console.log('Executing FFmpeg multiplexing via spawnSync...');
  const res = spawnSync('ffmpeg', ffmpegArgs, { stdio: 'inherit' });
  if (res.error) {
    throw res.error;
  }
  if (res.status !== 0) {
    throw new Error(`FFmpeg exited with code ${res.status}`);
  }

  // Measure final video duration
  const finalDurCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${FINAL_VIDEO_PATH}"`;
  const finalDurationSec = parseFloat(execSync(finalDurCmd).toString().trim());

  console.log('\n======================================================');
  console.log('             DEMO RECORDING PIPELINE COMPLETE         ');
  console.log('======================================================');
  console.log(`Output File: ${path.resolve(FINAL_VIDEO_PATH)}`);
  console.log(`Final Video Duration: ${finalDurationSec.toFixed(2)} seconds (${Math.floor(finalDurationSec / 60)}m ${Math.round(finalDurationSec % 60)}s)`);
  console.log(`Duration Requirement (>= 240 seconds / 4m 00s): ${finalDurationSec >= 240 ? 'PASSED ✅' : 'FAILED ❌'}`);
  console.log('Resolution: 1920x1080 (1080p Full HD)');
  console.log('Audio: AAC 192kbps stereo, synthesized with Kokoro neural TTS (am_michael, speed 0.98)');
  console.log('======================================================\n');
}

// ============================================================
// MAIN PIPELINE EXECUTION
// ============================================================
async function run() {
  try {
    const { sceneAudios } = await generateAllAudio();
    const { rawVideoPath, sceneStartDelays } = await recordScenes(sceneAudios);
    await assembleFinalVideo(rawVideoPath, sceneAudios, sceneStartDelays);
  } catch (err) {
    console.error('Recording Pipeline Error:', err);
    process.exit(1);
  }
}

run();
