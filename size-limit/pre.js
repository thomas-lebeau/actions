import * as core from '@actions/core';
import { init } from '../common/life-cycle';
import { NAME } from './utils/const';

async function run() {
    try {
        init(NAME);
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
