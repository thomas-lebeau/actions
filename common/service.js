import * as core from '@actions/core';
import * as github from '@actions/github';

const githubToken = core.getInput('github_token', { required: true });

let { payload, sha, ref } = github.context;

const { pull_request, repository } = payload;

const octokit = new github.getOctokit(githubToken, {
    log: console,
    previews: ['ant-man-preview', 'flash-preview'],
});

if (pull_request) {
    sha = pull_request.head.sha;
    ref = pull_request.head.ref;
}

const owner = repository.owner.login;
const repo = repository.name;

core.startGroup('ENV');
core.debug(JSON.stringify(process.env, null, 2));
core.endGroup();

core.startGroup('Github Context');
core.debug(JSON.stringify(github.context, null, 2));
core.endGroup();

export const DEPLOYMENT_STATE = {
    ERROR: 'error',
    FAILURE: 'failure',
    INACTIVE: 'inactive',
    IN_PROGRESS: 'in_progress',
    QUEUED: 'queued',
    PENDING: 'pending',
    SUCCESS: 'success',
};

export const CHECK_STATUS = {
    QUEUED: 'queued',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
};

export const CHECK_CONCLUSION = {
    SUCCESS: 'success',
    FAILURE: 'failure',
    NEUTRAL: 'neutral',
    CANCELLED: 'cancelled',
    TIMED_OUT: 'timed_out',
    ACTION_REQUIRED: 'action_required',
};

export async function createDeployment({
    state = DEPLOYMENT_STATE.IN_PROGRESS,
    ref: _ref,
    environment,
    description,
    url,
    autoInactive,
}) {
    const deployment = await octokit.repos.createDeployment({
        owner,
        repo,
        ref: _ref || ref,
        required_contexts: [],
        environment,
        auto_merge: false,
        transient_environment: true,
    });

    const deploymentID = deployment.data.id.toString();

    return octokit.repos.createDeploymentStatus({
        owner,
        repo,
        state,
        description,
        environment,
        environment_url: url,
        auto_inactive: autoInactive,
        deployment_id: parseInt(deploymentID, 10),
    });
}

export function createCheck(name, head_sha = sha) {
    return octokit.checks.create({
        owner,
        repo,
        name,
        head_sha,
        status: CHECK_STATUS.QUEUED,
    });
}

export function getCheck(check_run_id) {
    return octokit.checks.get({
        owner,
        repo,
        check_run_id,
    });
}

export function updateCheck(
    check_run_id,
    { title = '', summary = '', text, status, conclusion, annotations }
) {
    const options = {};
    const output = {
        title,
        summary,
    };

    if (status) options.status = status;
    if (conclusion) options.conclusion = conclusion;
    if (!status && !conclusion) options.status = CHECK_STATUS.IN_PROGRESS;

    if (text) output.text = text;
    if (annotations) output.annotations = annotations;

    return octokit.checks.update({
        owner,
        repo,
        check_run_id,
        ...options,
        output,
    });
}
