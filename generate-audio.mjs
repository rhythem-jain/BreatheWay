import { KokoroTTS } from 'kokoro-js';
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';

const AUDIO_DIR = './audio-clips';
if (!fs.existsSync(AUDIO_DIR)) {
  fs.mkdirSync(AUDIO_DIR, { recursive: true });
}

// 6 scenes designed to match user specifications (~50s, ~45s, ~50s, ~50s, ~40s, ~30s)
// Total target >= 245 seconds (~4m 20s - 4m 30s)
const SCENES = [
  {
    id: 1,
    name: 'scene1_intro_dashboard',
    title: 'Intro & Live Air Telemetry Dashboard',
    targetSec: 52,
    text: `Urban air pollution is often treated as a single city-wide number, but in reality, the air you breathe changes dramatically from street to street and hour to hour. Welcome to our Urban Air Telemetry and Personal Exposure Management platform—built for PromptWars Challenge 6 to turn hyperlocal environmental data into clear, actionable daily decisions. Right here on the live Air Telemetry Dashboard, users can monitor real-time air quality index ratings calculated with official US EPA breakpoints, track particulate matter including PM2.5 and PM10 concentrations, and inspect critical meteorological dispersion trends like wind speed and humidity. Using our interactive Smog Heatmap and sensor mesh grid, you can click directly into individual urban zones to examine localized pollution spikes, historical trend sparklines, thermal inversion caps, and immediate health alerts. We also provide live simulation controls, allowing municipal planners and citizens to model winter smog spikes or observe the cleansing effects of solar wind dispersion in real time.`
  },
  {
    id: 2,
    name: 'scene2_routine_gemini',
    title: 'Daily Routine Optimizer & Gemini AI',
    targetSec: 46,
    text: `Knowing the current air quality is only half the battle—knowing how to plan your day around it is what actually protects your health. In the Daily Routine Optimizer, we combine deterministic air-quality forecasting with the power of Google Gemini AI through our secure, cached backend service. Simply choose a family or lifestyle health persona—whether you are an outdoor runner, a daily commuter, or someone managing pediatric asthma or respiratory sensitivities—and the platform dynamically reshapes your schedule. It computes the lowest-exposure windows for outdoor workouts, errands, and high-exertion tasks, translating complex aerometric telemetry into a personalized, hour-by-hour timeline. Each time block includes actionable clinical guidance, predicted inhaled particulate dose calculations, and estimated carbon offsets, helping residents stay safe while reducing their personal footprint.`
  },
  {
    id: 3,
    name: 'scene3_transit_planner',
    title: 'Low-Exposure Transit Planner',
    targetSec: 50,
    text: `For urban commuters, the fastest route on a map is rarely the healthiest one. Our Transit Exposure Planner tackles this directly using a custom Dijkstra exposure-routing engine alongside an advanced respiratory commute dose model. Instead of optimizing purely for travel distance or speed, the algorithm weighs zone-by-zone pollutant density, travel duration, and physical exertion rates across different transport modes. In the comprehensive comparison table, you can immediately see the stark differences in inhaled particulate dose between walking along congested arterials, cycling, taking public electric transit, or driving. By highlighting the recommended clean corridor with the lowest inhaled burden, commuters are empowered to pick the healthiest path without sacrificing everyday practicality, cutting their pulmonary toxic load significantly.`
  },
  {
    id: 4,
    name: 'scene4_iaq_center',
    title: 'Indoor Air Quality (IAQ) Center',
    targetSec: 52,
    text: `When outdoor smog peaks, most people head indoors—assuming they are automatically safe. However, indoor air quality depends heavily on ventilation timing and filtration capacity. Inside the IAQ Center, our mass-balance Clean Air Delivery Rate engine models room volume and air-change rates to show exactly how fast your purifier can clear indoor particulates. If your room has a filtration deficit, the system instantly alerts you and calculates the shortfall. Below that, our smart Window Schedule analyzes atmospheric boundary layer dynamics to show the exact hours to open windows for natural solar cross-ventilation and when morning inversion traps require sealing everything shut. And because clean air should never be an unaffordable luxury, we also provide a low-cost DIY Filtration Hack Grid with peer-reviewed, science-backed guides like Corsi-Rosenthal box purifiers that deliver hospital-grade filtration at a fraction of commercial costs.`
  },
  {
    id: 5,
    name: 'scene5_community_auth',
    title: 'Community Hub, Multilingual Access & Auth',
    targetSec: 42,
    text: `Lasting environmental change requires collective momentum. The Community Hub allows residents to commit to shareable clean-air pledges—from carpooling and transit shifts to eliminating biomass burning—building real neighborhood accountability. Our live collective impact metrics show real-time tallies of carbon emissions prevented and particulate matter averted across the district. And because urban air quality affects diverse communities, the entire platform is built with strict WCAG 2.2 AA accessibility standards, high-contrast light and dark themes, and built-in multi-language translation support right in the sidebar. Users can also access our secure Firebase Authentication portal with multi-factor verification to enroll as verified municipal stakeholders or citizens.`
  },
  {
    id: 6,
    name: 'scene6_production_closing',
    title: 'Production Architecture & Closing',
    targetSec: 32,
    text: `Under the hood, this isn't just a frontend prototype. It is a production-grade full-stack platform built with React 19, TypeScript, Tailwind CSS, and an Express backend featuring schema validation, security middleware, response caching, and seven automated test suites covering our API endpoints, DOM rendering, Dijkstra routing, and EPA math—all deployed live on Vercel. Thank you for watching our walkthrough of BreatheWay, and let's work together to build healthier, cleaner, and more resilient cities for everyone.`
  }
];

console.log('Loading KokoroTTS with model onnx-community/Kokoro-82M-v1.0-ONNX...');
const tts = await KokoroTTS.from_pretrained('onnx-community/Kokoro-82M-v1.0-ONNX', {
  dtype: 'q8',
});

let totalAudioDuration = 0;
const sceneInfo = [];

for (const scene of SCENES) {
  const filePath = path.join(AUDIO_DIR, `${scene.name}.wav`);
  console.log(`Generating audio for Scene ${scene.id} (${scene.title})...`);
  const audio = await tts.generate(scene.text, {
    voice: 'am_michael',
    speed: 0.98,
  });
  await audio.save(filePath);

  // Measure exact duration using ffprobe
  const ffprobeCmd = `ffprobe -v error -show_entries format=duration -of default=noprint_wrappers=1:nokey=1 "${filePath}"`;
  const durSec = parseFloat(execSync(ffprobeCmd).toString().trim());
  totalAudioDuration += durSec;
  sceneInfo.push({
    ...scene,
    filePath,
    durationSec: durSec,
    durationMs: Math.round(durSec * 1000)
  });
  console.log(`  Scene ${scene.id} duration: ${durSec.toFixed(2)}s`);
}

const breathingPausePerScene = 1.5;
const totalPauses = breathingPausePerScene * SCENES.length;
const grandTotal = totalAudioDuration + totalPauses;

console.log('\n========================================');
console.log('       AUDIO GENERATION COMPLETE        ');
console.log('========================================');
sceneInfo.forEach(s => console.log(`Scene ${s.id} (${s.title}): ${s.durationSec.toFixed(2)}s`));
console.log('----------------------------------------');
console.log(`Total Audio Duration: ${totalAudioDuration.toFixed(2)}s`);
console.log(`Total Breathing Pauses (1.5s x ${SCENES.length}): ${totalPauses.toFixed(2)}s`);
console.log(`Grand Total Duration: ${grandTotal.toFixed(2)}s (${Math.floor(grandTotal/60)}m ${Math.round(grandTotal%60)}s)`);
console.log(`Requirement Check (>= 245s / 4m 05s): ${grandTotal >= 245 ? 'PASSED ✅' : 'FAILED ❌'}`);
console.log('========================================\n');

fs.writeFileSync('scene-durations.json', JSON.stringify({ sceneInfo, totalAudioDuration, totalPauses, grandTotal }, null, 2));
