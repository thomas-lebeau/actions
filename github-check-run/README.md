# Github check run

My template for typescript based github actions and also my testing repo for new workflows I want to use with them.

For the template `master` is the dev branch and `stable` is the default branch to use.
The releases of this template can be ignored, since they are for testing only.

## Usage

### Inputs

| Name           | Requirement | Default       | Description                                                                                                                                                                                                                                                  |
| -------------- | ----------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------ |
| `github_token` | _Required_  |               |                                                                                                                                                                                                                                                              |
| `name`         | _Required_  |               | The name of the check                                                                                                                                                                                                                                        |
| `title`        | _Required_  |               | The title of the check run                                                                                                                                                                                                                                   |
| `status`       |             | `in_progress` | The current status. Can be one of `queued`, `in_progress`,or `completed`. Default:                                                                                                                                                                           |
| `summary`      |             |               | The name of the check                                                                                                                                                                                                                                        |
| `conclusion`   |             |               | Required if you provide a status of `completed`. The final conclusion of the check. Can be one of `success`, `failure`, `neutral`, `cancelled`, `skipped`, `timed_out`. Note: Providing conclusion will automatically set the status parameter to completed. |
| `check_run_id` |             |               | The id of the check run.                                                                                                                                                                                                                                     |
| `queue`        |             | `true`        | The id of the check run.                                                                                                                                                                                                                                     |

### Outpus

| Name           | Description              |
| -------------- | ------------------------ |
| `check_run_id` | The id of the check run. |

### Example basic:

```yaml
steps:
    - uses: actions/checkout@v1
    - uses: s-weigand/github-action-template@v1
      with:
          dummy-input: bar
```

### Matrix Testing:

```yaml
jobs:
  build:
    runs-on: ${{ matrix.os }}

    strategy:
      matrix:
        os: [ubuntu-latest, windows-latest, macOS-latest]
        python-version: [3.6, 3.7, 3.8]

    name: Python ${{ matrix.python-version }} example

    steps:
      - uses: actions/checkout@v1
      - uses: s-weigand/github-action-template@v1
          with:
          dummy-input: bar
```
