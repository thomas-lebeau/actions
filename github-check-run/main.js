import * as core from '@actions/core';
import { update, create } from './utils/check-run';

async function run() {
    try {
        const name = core.getInput('name', { required: true });
        const title = core.getInput('title', { required: true });

        const text = core.getInput('text');
        const status = core.getInput('status');
        const summary = core.getInput('summary');
        const conclusion = core.getInput('conclusion');

        let { id } = JSON.parse(core.getState(name) || '{}');

        if (!id) {
            const { data } = await create(name);

            id = data.id;
        }
        core.debug(
            `Updating check-run ${name} with { title: ${title}, status: ${status}, conclusion: ${conclusion} }`
        );

        const { data } = await update(id, {
            title,
            text,
            status,
            summary,
            conclusion,
        });

        core.saveState(name, {
            id: data.id,
            status: data.status,
        });
    } catch (error) {
        core.setFailed(error.message);
    }
}

run();
