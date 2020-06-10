import * as core from '@actions/core';
import { update, STATUS, CONCLUSION } from './utils/check-run';

async function run() {
    try {
        const name = core.getInput('name', { required: true });
        const { id, status } = JSON.parse(core.getState(name) || '{}');

        if (status !== STATUS.COMPLETED) {
            const conclusion = status === STATUS.QUEUED ? CONCLUSION.SKIPPED : CONCLUSION.FAILURE;

            core.debug(`Completing check-run ${name} with conclusion ${conclusion}`);

            await update(id, {
                title: name,
                conclusion,
            });
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
