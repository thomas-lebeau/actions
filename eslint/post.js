import * as core from '@actions/core';
import { end } from '../common/life-cycle';
import { NAME } from './utils/const';

async function run() {
    try {
        end(NAME);
    } catch (error) {
        core.setFailed(error.message);
    }
}
run();
