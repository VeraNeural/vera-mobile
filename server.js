#!/usr/bin/env node

/**
 * VERA Server Restart Loop
 * Automatically restarts Next.js dev server if it crashes
 * Runs forever until manually stopped
 */

const { spawn } = require('child_process');
const path = require('path');

const webDir = path.join(__dirname, 'apps/web');
let serverProcess = null;
let attemptCount = 0;
const MAX_RESTART_ATTEMPTS = 50;

function log(msg) {
  const timestamp = new Date().toLocaleTimeString();
  console.log(`[${timestamp}] ${msg}`);
}

function startServer() {
  attemptCount++;
  
  if (attemptCount > MAX_RESTART_ATTEMPTS) {
    log('❌ Max restart attempts reached. Server giving up.');
    process.exit(1);
  }

  log(`🚀 Starting Next.js dev server (attempt ${attemptCount}/${MAX_RESTART_ATTEMPTS})`);
  
  serverProcess = spawn('npx', ['next', 'dev', '--port', '3000'], {
    cwd: webDir,
    stdio: 'inherit',
    shell: true,
    windowsHide: false
  });

  serverProcess.on('exit', (code) => {
    if (code === 0) {
      log('✓ Server stopped cleanly');
      process.exit(0);
    } else {
      log(`⚠️  Server crashed with code ${code}. Restarting in 3 seconds...`);
      setTimeout(startServer, 3000);
    }
  });

  serverProcess.on('error', (err) => {
    log(`❌ Server error: ${err.message}`);
    setTimeout(startServer, 3000);
  });
}

process.on('SIGINT', () => {
  log('\n📍 Shutting down...');
  if (serverProcess) {
    serverProcess.kill('SIGTERM');
  }
  process.exit(0);
});

log('================================');
log('  VERA Server - Auto Restart');
log('================================');
log('Port: localhost:3000');
log('Press Ctrl+C to stop');
log('');

startServer();
