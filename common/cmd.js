import exec from '@actions/exec';

export default async function cmd(cmd) {
    let output = '';

    const exitCode = await exec.exec(cmd, [], {
        listeners: {
            stdout: (data) => (output += data.toString()),
        },
        ignoreReturnCode: true,
    });

    return {
        exitCode,
        data: JSON.parse(output),
    };
}
