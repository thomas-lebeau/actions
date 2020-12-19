import * as core from '@actions/core';
import { create, update, STATUS, CONCLUSION } from './service';

export async function init(name) {
    try {
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

export async function setStatus(
    name,
    { title, text, status = STATUS.COMPLETED, summary, conclusion }
) {
    try {
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

export async function end(name) {
    try {
        const { id, status } = JSON.parse(core.getState(name) || '{}');

        if (status !== STATUS.COMPLETED) {
            const conclusion =
                status === STATUS.QUEUED
                    ? CONCLUSION.CANCELLED
                    : CONCLUSION.FAILURE;

            core.debug(
                `Completing check-run ${name} with conclusion ${conclusion}`
            );

            await update(id, {
                title: name,
                conclusion,
            });
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
