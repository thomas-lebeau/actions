import * as core from '@actions/core';
import cmd from '../common/cmd';
import { setStatus } from '../common/life-cycle';
import { CHECK_CONCLUSION } from '../common/service';
import { NAME } from './utils/const';
import * as path from 'path';

function pluralize(s, n) {
    return n > 1 ? s + 's' : s;
}

const FORMATTER = path.join(__dirname, 'formatter.js');

async function run() {
    try {
        const extensions = core.getInput('extensions');
        const files = core.getInput('files');
        const quiet = JSON.parse(core.getInput('quiet'));
        const continueOnFail = JSON.parse(core.getInput('continue'));

        const { exitCode, data } = await cmd(
            `npx eslint ${files} --ext ${extensions} --format "${FORMATTER}" ${
                quiet ? '--quiet' : ''
            }`
        );

        const { annotations, warningCount, errorCount } = await data;

        const title = `${errorCount} ${pluralize(
            'error',
            errorCount
        )}, ${warningCount} ${pluralize('warning', warningCount)}`;

        const conclusion =
            exitCode === 0
                ? CHECK_CONCLUSION.SUCCESS
                : CHECK_CONCLUSION.FAILURE;

        await setStatus(NAME, {
            title,
            conclusion,
            annotations,
        });

        if (!continueOnFail && exitCode !== 0) {
            core.setFailed(title);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
