import * as core from '@actions/core';
import { setStatus } from '../common/life-cycle';
import { NAME } from './utils/const';
import sizeLimit from './utils/size-limit';

async function run() {
    try {
        const { conclusion, report, totalSize } = await sizeLimit();

        await setStatus(NAME, {
            title: totalSize,
            text: report,
            conclusion,
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
