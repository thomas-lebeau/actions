import * as core from '@actions/core';
import { setStatus } from '../common/life-cycle';

async function run() {
    try {
        const name = core.getInput('name', { required: true });
        const title = core.getInput('title', { required: true });

        const text = core.getInput('text');
        const status = core.getInput('status');
        const summary = core.getInput('summary');
        const conclusion = core.getInput('conclusion');

        await setStatus(name, {
            title,
            text,
            status,
            summary,
            conclusion,
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
