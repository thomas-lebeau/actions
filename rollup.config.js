import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import builtins from 'builtin-modules';
import globby from 'globby';

const entryPointRegex = /(?<path>.*)\/(?<name>.*)\.m?js$/;

const getConfig = ({ path, name }) => ({
    input: `${path}/${name}.js`,
    output: {
        file: `${path}/dist/${name}.js`,
        format: 'cjs',
    },
    plugins: [resolve(), commonjs()],
    external: builtins,
});

const isCommon = ({ path }) => !path.includes('common');

export default globby
    .sync('*/{index,main,pre,post}.js')
    .map((file) => entryPointRegex.exec(file))
    .map((matches) => matches.groups)
    .filter(isCommon)
    .map(getConfig);
