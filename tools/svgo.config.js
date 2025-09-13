// tools/svgo.config.js
module.exports = {
  multipass: true,
  plugins: [
    { name: 'removeDoctype', active: true },
    { name: 'removeXMLProcInst', active: true },
    { name: 'removeComments', active: true },
    { name: 'removeMetadata', active: true },
    { name: 'removeEditorsNSData', active: true },
    { name: 'cleanupAttrs', active: true },
    { name: 'minifyStyles', active: true },
    { name: 'cleanupNumericValues', params: { floatPrecision: 3 } },
    { name: 'convertColors', params: { currentColor: true } },
    { name: 'removeUnknownsAndDefaults', active: true },
    { name: 'removeUselessStrokeAndFill', active: true },
    { name: 'mergePaths', active: true },
    { name: 'sortAttrs', active: true },
    { name: 'removeViewBox', active: false },
    { name: 'removeDimensions', active: false },
    { name: 'removeRasterImages', active: true }
  ]
};
