const postcssImport = require('postcss-import');
const postcssNested = require('postcss-nested');
const postcssSortMediaQueries = require('postcss-sort-media-queries');
const simpleExtend = require('postcss-extend');
const postcssShort = require('postcss-short');
const cssnano = require('cssnano');

module.exports = {
  plugins: [
    postcssImport(),
    postcssShort(),
    simpleExtend(),
    postcssNested(),
    postcssSortMediaQueries(),
    cssnano(),
  ],
}
