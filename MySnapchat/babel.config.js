module.exports = function(api) {
    api.cache(true);
    return {
      presets: ['babel-preset-expo'],
      plugins: [
        'react-native-reanimated/plugin', 
      ],
    };
  };
  
  const { getDefaultConfig } = require('expo/metro-config');
  
  const config = getDefaultConfig(__dirname);
  
  module.exports = config;
  
  module.exports = {
    root: true,
    
    extends: [
      '@react-native',
      '@typescript-eslint/recommended',
    ],
    parser: '@typescript-eslint/parser',
    
    plugins: ['@typescript-eslint'],

    rules: {
      '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'react-native/no-inline-styles': 'warn',
      'react-hooks/exhaustive-deps': 'warn',
    },
  };
  
  module.exports = {
    arrowParens: 'avoid',
    bracketSameLine: true,
    bracketSpacing: false,
    singleQuote: true,
    trailingComma: 'all',
    tabWidth: 2,
    semi: true,
  };