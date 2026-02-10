const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);

config.projectRoot = __dirname;

// Ensure proper module resolution for all platforms
config.resolver = {
  ...config.resolver,
  // Prioritize CommonJS exports for better compatibility
  resolverMainFields: ['react-native', 'browser', 'main'],
  // Add common JavaScript extensions
  sourceExts: ['js', 'jsx', 'ts', 'tsx', 'json', 'cjs'],
  // Blocklist to prevent using ES modules outside module context
  blockList: [
    /.*\.mjs$/,
    /.*node_modules\/zustand\/esm\/.*/,
  ],
};

module.exports = config;