import exec from '@actions/exec';
import bytes from 'bytes';

const CONCLUSION = {
    SUCCESS: 'success',
    FAILURE: 'failure',
    CANCELLED: 'cancelled',
};
const S = 1000;
const M = 60 * S;

const itdentityFn = (value) => value;
const humanizeBytes = (value) => bytes(value, { unitSeparator: ' ' });
const humanizeSeconds = (seconds) => {
    const ms = seconds * S;

    if (ms > M) return Math.round((ms * 10) / M) / 10 + ' m';
    if (ms > S) return Math.round((ms * 10) / S) / 10 + ' s';

    return Math.round(ms * 10) / 10 + ' ms';
};

const schema = {
    name: {
        title: 'Name',
        transform: itdentityFn,
    },
    size: {
        title: 'Size',
        transform: humanizeBytes,
    },
    running: {
        title: 'Running time (snapdragon)',
        transform: humanizeSeconds,
    },
    loading: {
        title: 'Loading time (3g)',
        transform: humanizeSeconds,
    },
};

const printRow = (cells) => `| ${cells.join(' | ')} |`;
const printTable = (rows) => rows.map(printRow).join('\n');

function createReport(data) {
    const titles = Object.keys(data[0])
        .map((key) => schema[key] && schema[key].title)
        .filter(Boolean);

    const separators = new Array(titles.length).fill('---');

    const rows = data.map((bundle) =>
        Object.entries(bundle)
            .map(([k, v]) => schema[k] && schema[k].transform(v))
            .filter(Boolean)
    );

    const table = [titles, separators, ...rows];

    return `\n${printTable(table)}\n`;
}

export async function cmd(cmd) {
    let output = '';

    const exitCode = await exec.exec(cmd, [], {
        listeners: {
            stdout: (data) => (output += data.toString()),
        },
        ignoreReturnCode: true,
    });

    return {
        exitCode,
        data: JSON.parse(output),
    };
}

export default async function sizeLimit() {
    const { exitCode, data } = await cmd('npx size-limit --json');

    const conclusion =
        exitCode === 0 &&
        data.every((bundle) => bundle.passed && bundle.size > 0)
            ? CONCLUSION.SUCCESS
            : CONCLUSION.FAILURE;

    const totalSize = humanizeBytes(
        data.reduce((total, bundle) => total + bundle.size, 0)
    );

    const report = createReport(data);

    console.log(report);

    return {
        conclusion,
        report,
        data,
        totalSize,
    };
}
