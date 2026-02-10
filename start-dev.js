#!/usr/bin/env node

/**
 * Frontend Dev Server Launcher
 * Handles Windows-specific path issues with Expo CLI
 */

const { spawn } = require('child_process');
const path = require('path');

// Start the expo web server with NODE_OPTIONS to preload patch
const env = { ...process.env };

// Set NODE_OPTIONS to preload the Windows path fix
if (process.platform === 'win32') {
  const patchPath = path.join(__dirname, 'patches', 'windows-path-fix.js');
  env.NODE_OPTIONS = `--require ${patchPath} ${env.NODE_OPTIONS || ''}`.trim();
}

// Start the expo web server
const frontendDir = __dirname;
const child = spawn('npm', ['run', 'web'], {
  cwd: frontendDir,
  stdio: 'inherit',
  shell: true,
  env
});

child.on('exit', (code) => {
  process.exit(code);
});

child.on('error', (err) => {
  console.error('Failed to start dev server:', err);
  process.exit(1);
});
