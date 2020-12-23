import * as core from '@actions/core';
import { setStatus } from '../common/life-cycle';
import { NAME } from './utils/const';
import sizeLimit from './utils/size-limit';

async function run() {
    try {
        const { exitCode, data } = await sizeLimit();
        const { conclusion, report, totalSize } = data;
        const continueOnFail = core.getInput('continue');

        await setStatus(NAME, {
            title: totalSize,
            text: report,
            conclusion,
        });

        if (!continueOnFail && exitCode !== 0) {
            core.setFailed('size over limit' + totalSize);
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
