const postcss = require('postcss');
const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssSortMediaQueries = require('postcss-sort-media-queries');
const simpleExtend = require('postcss-extend');
const postcssShort = require('postcss-short');
const postcssVariables = require('postcss-css-variables');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    postcssImport(),
    postcssVariables({
      variables: {
        '--titleColor': '#000',
        '--titleFont': '700 24px/30px Arial',
        '--subTitleFont': '700 16px/20px Arial',
      },
    }),
    postcssShort(),
    simpleExtend(),
    postcssNested(),
    postcssSortMediaQueries(),
    cssnano(),
  ],
}
