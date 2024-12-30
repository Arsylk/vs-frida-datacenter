import { resolve } from 'path';
import * as url from 'url';
const __dirname = url.fileURLToPath(new URL('..', import.meta.url));

const base = {
    name: 'base',
    module: {
        rules: [
            {
                test: /\.ts$/,
                use: 'ts-loader',
                exclude: /node_modules/,
            },
        ],
    },
    resolve: {
        extensions: ['.ts', '.js'],
        alias: {
            '@reversense/interruptor': resolve(__dirname, 'node_modules/@reversense/interruptor'),
        },
        fallback: {
            assert: '@frida/assert',
            'base64-js': '@frida/base64-js',
            buffer: '@frida/buffer',
            crosspath: '@frida/crosspath',
            crypto: '@frida/crypto',
            diagnostics_channel: '@frida/diagnostics_channel',
            events: '@frida/events',
            http: '@frida/http',
            'http-parser-js': '@frida/http-parser-js',
            https: '@frida/https',
            ieee754: '@frida/ieee754',
            net: '@frida/net',
            os: '@frida/os',
            path: '@frida/path',
            process: '@frida/process',
            punycode: '@frida/punycode',
            querystring: '@frida/querystring',
            'readable-stream': '@frida/readable-stream',
            'reserved-words': '@frida/reserved-words',
            stream: '@frida/stream',
            string_decoder: '@frida/string_decoder',
            terser: '@frida/terser',
            timers: '@frida/timers',
            tty: '@frida/tty',
            url: '@frida/url',
            util: '@frida/util',
            vm: '@frida/vm',
            fs: 'frida-fs',
        },
    },
    //mode: 'production',
    mode: 'development',
    devtool: 'inline-source-map',
};
const mkbase = () => Object.assign({}, base);
const mkobject = (name) =>
    Object.assign(mkbase(), {
        name: name,
        entry: `./agent/${name}.ts`,
        output: {
            filename: `${name}.js`,
            path: resolve('./agent/dist'),
        },
    });

export default [mkobject('script'), mkobject('justdump'), mkobject('justcocos'), mkobject('justcli')];
