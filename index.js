const VAddy = require('./vaddy')
const core = require('@actions/core')

async function run() {
  try { 
    let vaddy = new VAddy()
    vaddy.setSecret()
    if (vaddy.privateKey) {
      core.info('use private_key from input')
      await vaddy.putKey()
    } else {
      core.info('generate private_key')
      await vaddy.genKey()
      await vaddy.postKey()
    }
    await vaddy.getPort()
    const sp = await vaddy.spawnSsh()
    sp.on('error', (err) => {
      sp.kill()
      throw new Error(err)
    })
    const scanId = await vaddy.startScan()
    core.info('scan_id: ' + scanId)
    let result = await vaddy.waitScan(scanId)
    if (result.status === 'finish') {
      core.info('finish')
      core.info('scan_result_url: ' + result.scan_result_url)
      if (result.alert_count > 0) {
        core.setFailed('alert_count: ' + result.alert_count)
      }
    } else {
      core.setFailed(result.status)
    }
    sp.kill()
  }
  catch (err) {
    core.setFailed(err.message);
  }
}

run()
