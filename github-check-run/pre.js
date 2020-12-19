import * as core from '@actions/core';
import { init } from '../common/life-cycle';

async function run() {
    try {
        const name = core.getInput('name', { required: true });

        init(name);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
