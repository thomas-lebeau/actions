import * as core from '@actions/core';
import { createDeployment, DEPLOYMENT_STATE } from '../common/service';

async function run() {
    try {
        const autoInactive = core.getInput('auto_inactive');
        const description = core.getInput('description');
        const environment = core.getInput('environment', { required: true });
        const ref = core.getInput('ref');
        const url = core.getInput('url');

        await createDeployment({
            state: DEPLOYMENT_STATE.SUCCESS,
            environment,
            ref,
            url,
            autoInactive,
            description,
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
