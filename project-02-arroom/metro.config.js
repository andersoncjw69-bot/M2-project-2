// Metro does not treat .glb as an asset by default, so require('./assets/sculpture.glb') fails without this.
const { getDefaultConfig } = require('expo/metro-config');

const config = getDefaultConfig(__dirname);
config.resolver.assetExts.push('glb');

module.exports = config;
