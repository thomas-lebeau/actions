import * as core from '@actions/core';
import { end } from '../common/life-cycle';

async function run() {
    try {
        const name = core.getInput('name', { required: true });

        end(name);
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
