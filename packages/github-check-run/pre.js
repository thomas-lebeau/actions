import * as core from '@actions/core';
import { create } from './utils/check-run';

async function run() {
    try {
        const name = core.getInput('name', { required: true });

        core.debug(`Creating check-run ${name}`);

        const { data } = await create(name);

        core.saveState(name, {
            id: data.id,
            status: data.status,
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
