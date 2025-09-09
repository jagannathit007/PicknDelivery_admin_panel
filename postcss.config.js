import postcssNesting from 'postcss-nesting'

import postcssImport from 'postcss-import';
import postcssNested from 'postcss-nested';
import tailwindcssPostcss from '@tailwindcss/postcss';
import autoprefixer from 'autoprefixer';

export default {
  plugins: [
    postcssImport,
    postcssNested,
    tailwindcssPostcss('./tailwind.config.js'),
    autoprefixer,
  ]
}
