import resolve from "rollup-plugin-node-resolve"
import sourcemaps from "rollup-plugin-sourcemaps"

const external = ["iconv-lite"]
const plugins = [sourcemaps(), resolve()]
const banner = "/*! @author Toru Nagashima <https://github.com/mysticatea> */"

//eslint-disable-next-line require-jsdoc
function output(format, file) {
    return {
        file,
        format,
        sourcemap: true,
        sourcemapFile: `${file}.map`,
        strict: true,
        banner,
    }
}

export default [
    {
        input: ".temp/index.js",
        output: output("cjs", "index.js"),
        plugins,
    },
    {
        input: ".temp/text-encoders/buffer.js",
        output: output("cjs", "text-encoders/buffer.js"),
        plugins,
    },
    {
        input: ".temp/text-encoders/iconv-lite.js",
        output: output("cjs", "text-encoders/iconv-lite.js"),
        external,
        plugins,
    },
    {
        input: ".temp/index.js",
        output: output("es", "index.mjs"),
        plugins,
    },
    {
        input: ".temp/text-encoders/buffer.js",
        output: output("es", "text-encoders/buffer.mjs"),
        plugins,
    },
    {
        input: ".temp/text-encoders/iconv-lite.js",
        output: output("es", "text-encoders/iconv-lite.mjs"),
        external,
        plugins,
    },
]
