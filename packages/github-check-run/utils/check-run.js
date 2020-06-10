import * as core from '@actions/core';
import * as github from '@actions/github';

const githubToken = core.getInput('github_token', { required: true });
const { pull_request, repository } = github.context.payload;

const octokit = new github.getOctokit(githubToken, { log: console });
const headSha = pull_request.head.sha;
const owner = repository.owner.login;
const repo = repository.name;

export const STATUS = {
    QUEUED: 'queued',
    IN_PROGRESS: 'in_progress',
    COMPLETED: 'completed',
};

export const CONCLUSION = {
    SUCCESS: 'success',
    FAILURE: 'failure',
    NEUTRAL: 'neutral',
    CANCELLED: 'cancelled',
    SKIPPED: 'skipped',
    TIMED_OUT: 'timed_out',
    ACTION_REQUIRED: 'action_required',
};

export function create(name, head_sha = headSha) {
    return octokit.checks.create({
        owner,
        repo,
        name,
        head_sha,
        status: STATUS.QUEUED,
    });
}

export function get(check_run_id) {
    return octokit.checks.get({
        owner,
        repo,
        check_run_id,
    });
}

export function update(check_run_id, { title = '', summary = '', text, status, conclusion }) {
    const options = {};
    const output = {
        title,
        summary,
    };

    if (status) options.status = status;
    if (conclusion) options.conclusion = conclusion;
    if (!status && !conclusion) options.status = STATUS.IN_PROGRESS;

    if (text) output.text = text;

    return octokit.checks.update({
        owner,
        repo,
        check_run_id,
        ...options,
        output,
    });
}
