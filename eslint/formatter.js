const ANNOTATION_LEVEL = {
    NOTICE: 'notice',
    WARNING: 'warning',
    FAILURE: 'failure',
};

const ANNOTATION_LEVEL_BY_SEVERITY = {
    1: ANNOTATION_LEVEL.WARNING,
    2: ANNOTATION_LEVEL.FAILURE,
};

export default function format(result) {
    const cwd = process.cwd();

    const res = result.reduce(
        (acc, lintResult) => {
            const { errorCount, warningCount, messages } = lintResult;
            if (errorCount || warningCount) {
                const path = lintResult.filePath.replace(cwd + '/', '');

                acc.errorCount += errorCount;
                acc.warningCount += warningCount;

                for (const message of messages) {
                    acc.annotations.push({
                        path,
                        start_line: message.line,
                        end_line: message.endLine,
                        start_column: message.column,
                        end_column: message.endColumn,
                        annotation_level:
                            ANNOTATION_LEVEL_BY_SEVERITY[message.severity],
                        message: message.message,
                        title: message.ruleId,
                    });
                }
            }

            return acc;
        },
        { errorCount: 0, warningCount: 0, annotations: [] }
    );

    return JSON.stringify(res);
}
