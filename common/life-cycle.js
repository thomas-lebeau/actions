import * as core from '@actions/core';
import {
    CHECK_CONCLUSION,
    CHECK_STATUS,
    createCheck,
    updateCheck,
} from './service';

export async function init(name) {
    try {
        core.debug(`Creating check-run ${name}`);

        const { data } = await createCheck(name);

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
    { title, text, status, summary, conclusion }
) {
    try {
        let { id } = JSON.parse(core.getState(name) || '{}');

        if (!id) {
            const { data } = await createCheck(name);

            id = data.id;
        }

        core.debug(
            `Updating check-run ${name} with { title: ${title}, status: ${status}, conclusion: ${conclusion} }`
        );

        const { data } = await updateCheck(id, {
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

        if (status !== CHECK_STATUS.COMPLETED) {
            const conclusion =
                status === CHECK_STATUS.QUEUED
                    ? CHECK_CONCLUSION.CANCELLED
                    : CHECK_CONCLUSION.FAILURE;

            core.debug(
                `Completing check-run ${name} with conclusion ${conclusion}`
            );

            await updateCheck(id, {
                title: name,
                conclusion,
            });
        }
    } catch (error) {
        core.setFailed(error.message);
    }
}
