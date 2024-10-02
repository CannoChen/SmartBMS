const { getDefaultConfig } = require('expo/metro-config');
const { mergeConfig } = require('@react-native/metro-config');

/**
 * Metro configuration
 * https://reactnative.dev/docs/metro
 *
 * @type {import('metro-config').MetroConfig}
 */
const config = {
    resolver: {
        sourceExts: ['tflite', 'js', 'jsx', 'json', 'ts', 'tsx', 'cjs', 'mjs'],
        assetExts: ['glb', 'gltf', 'png', 'jpg', 'bin'],
    },
};

module.exports = mergeConfig(getDefaultConfig(__dirname), config);
