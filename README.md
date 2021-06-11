# actions-vaddy

GitHub Action to run vulnerability scan with [VAddy](https://vaddy.net/).

[![test](https://github.com/higebu/actions-vaddy/workflows/test/badge.svg)](https://github.com/higebu/actions-vaddy/actions)
[![codecov](https://codecov.io/gh/higebu/actions-vaddy/branch/master/graph/badge.svg)](https://codecov.io/gh/higebu/actions-vaddy)
[![CodeFactor](https://www.codefactor.io/repository/github/higebu/actions-vaddy/badge)](https://www.codefactor.io/repository/github/higebu/actions-vaddy)
[![Maintainability](https://api.codeclimate.com/v1/badges/61850855568e055c7624/maintainability)](https://codeclimate.com/github/higebu/actions-vaddy/maintainability)

# Requirements

* If you want scan the server runs on GitHub Actions, your project should be V1(VAddy PrivateNet) project. See [VAddy PrivateNet Quickstart Guide](https://support.vaddy.net/hc/en-us/sections/115002520287-VAddy-PrivateNet-Quickstart-Guide)

# Usage

Add the following secrets to your project.

* `VADDY_USER`: Required
    * Login UserID
* `VADDY_AUTH_KEY`: Required
    * VAddy WebAPI Key from https://console.vaddy.net/user/webapi
* `VADDY_PROJECT_ID`: Required for V2 project
    * Vaddy Project ID from `Server` page.
* `VADDY_FQDN`: Required for V1 project
    * Server FQDN
* `VADDY_VERIFICATION_CODE`: Required for V1 project
    * Verification code of your FQDN
* `VADDY_PRIVATE_KEY`: Optional for V1 project
    * Private key for SSH tunnel
    * You can get the key from `privatenet/vaddy/ssh/id_rsa` in [go-vaddy](https://github.com/vaddy/go-vaddy). After running `vaddy_privatenet.sh connect`
    * If you don't set `VADDY_PRIVATE_KEY`, actions-vaddy generates SSH key every time.
* `VADDY_YOUR_LOCAL_IP`: Required for V1 project
    * Your local Web Server IP address
    * ex. `127.0.0.1`
* `VADDY_YOUR_LOCAL_PORT`: Required for V1 project
    * Your local Web Server Port Number

## Workflow example for V2 project.

```yaml
name: test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: higebu/actions-vaddy@master
      with:
        user: ${{ secrets.VADDY_USER }}
        auth_key: ${{ secrets.VADDY_AUTH_KEY }}
        project_id: ${{ secrets.VADDY_PROJECT_ID }}
        # crawl_id: 12345
```

## Workflow example for V1 project.

```yaml
name: test

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - name: run server
      run: ./run.sh &
      env:
        VADDY_VERIFICATION_CODE: ${{ secrets.VADDY_VERIFICATION_CODE }}
        LISTEN_ADDR: ${{ secrets.VADDY_YOUR_LOCAL_IP }}:${{ secrets.VADDY_YOUR_LOCAL_PORT }}
    - uses: higebu/actions-vaddy@master
      with:
        user: ${{ secrets.VADDY_USER }}
        auth_key: ${{ secrets.VADDY_AUTH_KEY }}
        fqdn: ${{ secrets.VADDY_FQDN }}
        verification_code: ${{ secrets.VADDY_VERIFICATION_CODE }}
        private_key: ${{ secrets.VADDY_PRIVATE_KEY }}
        local_ip: ${{ secrets.VADDY_YOUR_LOCAL_IP }}
        local_port: ${{ secrets.VADDY_YOUR_LOCAL_PORT }}
        # crawl_id: 12345
```

For more details, see [Example](https://github.com/higebu/actions-vaddy-example) and [Workflow syntax for GitHub Actions](https://help.github.com/en/actions/reference/workflow-syntax-for-github-actions).

# License

[MIT](LICENSE)