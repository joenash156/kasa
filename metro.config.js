const { getDefaultConfig } = require("expo/metro-config");
const path = require("path");
const { withNativeWind } = require("nativewind/metro");

const config = getDefaultConfig(__dirname);

config.resolver = config.resolver || {};
config.resolver.extraNodeModules = {
  ...(config.resolver.extraNodeModules || {}),
  "expo-keep-awake": path.resolve(__dirname, "stubs/expo-keep-awake.js"),
};

module.exports = withNativeWind(config, { input: "./global.css" });
