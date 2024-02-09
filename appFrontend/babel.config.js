module.exports = {
  presets: ['module:metro-react-native-babel-preset'],
  plugins: [
    [
      'module-resolver',
      {
        root: ['./src'],
        extensions: ['.ts', '.tsx', '.jsx', '.js', '.json'],
        alias: {
          '@': './src',
          '@assets': './src/assets',
          '@global': './src/global',
          '@screens': './src/screens',
          '@store': './src/store',
        },
      },
    ],
    [
      'module:react-native-dotenv',
      {
        moduleName: '@env',
        path: '.env.development',
        safe: true,
        allowUndefined: true,
      },
    ],
  ],
};