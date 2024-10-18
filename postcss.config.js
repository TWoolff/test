module.exports = {
  plugins: [
    'postcss-import',
    'postcss-nested',
    [
      'postcss-preset-env',
      {
        autoprefixer: {
          flexbox: 'no-2009',
        },
        stage: 0,
        features: {
          'custom-properties': true,
          'custom-media-queries': true,
        },
      },
    ],
  ]
}