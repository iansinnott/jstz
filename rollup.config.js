/* globals process */
import resolve from "rollup-plugin-node-resolve";
import commonjs from "rollup-plugin-commonjs";
import babel from "rollup-plugin-babel";
import { terser } from "rollup-plugin-terser";
import conditional from "rollup-plugin-conditional";
var pkg = require('./package.json');

const buildTime = function () {
    var now = new Date();
    var getMonth = function () {
        if (now.getMonth() + 1 < 10) {
            return "0" + (now.getMonth() + 1);
        }
        return now.getMonth() + 1;
    };
    var getDate = function () {
        if (now.getDate() < 10) {
            return "0" + now.getDate();
        }

        return now.getDate();
    };

    return now.getFullYear() + "-" + getMonth() + "-" + getDate()
};

const banner = `/* jstz.min.js Version: ${pkg.version} Build date: ${buildTime()} */`

const getPlugins = function(minified) {
  return [
    resolve({
      browser: true
    }),
    commonjs(),
    babel({
      exclude: "node_modules/**" // only transpile our source code
    }),
    conditional(minified, [
      terser({
        parse: {
          // parse options
        },
        compress: {
          toplevel: true,
          hoist_props: true,
          hoist_funs: true,
          arguments: true,
          booleans: true,
          booleans_as_integers: false,
          unsafe: true,
          unsafe_arrows: true,
          unsafe_comps: true,
          unsafe_Function: true,
          unsafe_math: true,
          unsafe_proto: true,
          unsafe_regexp: true,
          unused: true,
          passes: 4
        },
        mangle: {
          //eval: true,
          // properties: {
          //     keep_quoted: true
          // },
        },
        output: {
          beautify: false,
          preamble: banner
        },
        ecma: 5,
        keep_classnames: false,
        keep_fnames: false,
        ie8: false,
        module: false,
        nameCache: null,
        safari10: false,
        toplevel: true,
        warnings: true
      })
    ])
  ];
}

export default [
  {
    input: "src/jstz.js",
    output: {
      file: "dist/jstz.js",
      format: "umd",
      name: "jstz",
      banner: banner
    },
    treeshake: {
      propertyReadSideEffects: false,
      pureExternalModules: true
    },
    plugins: getPlugins(false)
  },
  {
    input: "src/jstz.js",
    output: {
      file: "dist/jstz.min.js",
      format: "umd",
      name: "jstz"
    },
    treeshake: {
      propertyReadSideEffects: false,
      pureExternalModules: true
    },
    plugins: getPlugins(true)
  },
  {
    input: "src/jstz.js",
    output: {
      file: "dist/jstz.esm.js",
      format: "esm",
      name: "jstz",
      banner: banner
    },
    treeshake: {
      propertyReadSideEffects: false,
      pureExternalModules: true
    }
  }
];
