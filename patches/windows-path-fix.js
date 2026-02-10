/**
 * Patch for Windows Expo CLI path issue
 * This file polyfills fs methods to handle colon-in-path issues
 * Preload with: Node_OPTIONS="--require ./patches/windows-path-fix.js"
 */

const fs = require('fs');
const path = require('path');

console.log('[Windows Path Fix] Patching fs methods for Windows colon-in-path issues');

// Function to fix paths with colons (Windows incompatible)
function fixWindowsPath(dirPath) {
  if (typeof dirPath === 'string' && process.platform === 'win32') {
    // Replace node:sea, node:fs, etc. with node_sea, node_fs, etc.
    if (dirPath.includes('node:')) {
      return dirPath.replace(/node:/g, 'node_');
    }
  }
  return dirPath;
}

// Patch fs.promises.mkdir
const originalMkdir = fs.promises.mkdir;
fs.promises.mkdir = async function(dirPath, options) {
  const fixedPath = fixWindowsPath(dirPath);
  if (fixedPath !== dirPath) {
    console.log(`[Windows Path Fix] mkdir: ${dirPath} -> ${fixedPath}`);
  }
  return await originalMkdir.call(this, fixedPath, options);
};

// Patch fs.promises.open
const originalOpen = fs.promises.open;
fs.promises.open = async function(filePath, flags, mode) {
  const fixedPath = fixWindowsPath(filePath);
  if (fixedPath !== filePath) {
    console.log(`[Windows Path Fix] open: ${filePath} -> ${fixedPath}`);
  }
  return await originalOpen.call(this, fixedPath, flags, mode);
};

// Patch fs.promises.writeFile
const originalWriteFile = fs.promises.writeFile;
fs.promises.writeFile = async function(filePath, data, options) {
  const fixedPath = fixWindowsPath(filePath);
  if (fixedPath !== filePath) {
    console.log(`[Windows Path Fix] writeFile: ${filePath} -> ${fixedPath}`);
  }
  return await originalWriteFile.call(this, fixedPath, data, options);
};

// Patch fs.promises.readFile
const originalReadFile = fs.promises.readFile;
fs.promises.readFile = async function(filePath, options) {
  const fixedPath = fixWindowsPath(filePath);
  if (fixedPath !== filePath) {
    console.log(`[Windows Path Fix] readFile: ${filePath} -> ${fixedPath}`);
  }
  return await originalReadFile.call(this, fixedPath, options);
};

// Patch fs.promises.stat
const originalStat = fs.promises.stat;
fs.promises.stat = async function(filePath) {
  const fixedPath = fixWindowsPath(filePath);
  if (fixedPath !== filePath) {
    console.log(`[Windows Path Fix] stat: ${filePath} -> ${fixedPath}`);
  }
  return await originalStat.call(this, fixedPath);
};

// Patch fs.promises.access
const originalAccess = fs.promises.access;
fs.promises.access = async function(filePath, mode) {
  const fixedPath = fixWindowsPath(filePath);
  if (fixedPath !== filePath) {
    console.log(`[Windows Path Fix] access: ${filePath} -> ${fixedPath}`);
  }
  return await originalAccess.call(this, fixedPath, mode);
};

// Patch fs.existsSync
const originalExistsSync = fs.existsSync;
fs.existsSync = function(filePath) {
  const fixedPath = fixWindowsPath(filePath);
  return originalExistsSync.call(this, fixedPath);
};

// Patch fs.readFileSync
const originalReadFileSync = fs.readFileSync;
fs.readFileSync = function(filePath, options) {
  const fixedPath = fixWindowsPath(filePath);
  return originalReadFileSync.call(this, fixedPath, options);
};

// Patch fs.writeFileSync
const originalWriteFileSync = fs.writeFileSync;
fs.writeFileSync = function(filePath, data, options) {
  const fixedPath = fixWindowsPath(filePath);
  return originalWriteFileSync.call(this, fixedPath, data, options);
};

module.exports = { patchApplied: true };

