const assert = require('assert'),
  test = require('selenium-webdriver/testing'),
  webdriver = require('selenium-webdriver'),
  pixelmatch = require('pixelmatch'),
  until = require('selenium-webdriver/lib/until'),
  SauceLabs = require('saucelabs'),
  fs = require('fs'),
  svg2png = require('svg2png'),
  path = require('path'),
  request = require('sync-request'),
  sauceConnectLauncher = require('sauce-connect-launcher'),
  username = process.env.SAUCE_USERNAME,
  accessKey = process.env.SAUCE_ACCESS_KEY;


function getTunnels() {
  var res = request('GET', 'https://saucelabs.com/rest/v1/'+username+'/tunnels', {
    headers: {
      authorization: 'Basic ' + new Buffer(username + ':' + accessKey).toString("base64")
    },
  });
  return res.getBody().toString('utf8').slice(2).slice(0, -2);
}

test.describe('Pipelin Builder JS functional test', function () {
  this.timeout(600000);
  var driver;
  test.before(function (done) {
    sauceConnectLauncher({
      username: username,
      accessKey: accessKey,
    }, done);
  });


  test.beforeEach(function () {
    var saucelabs = new SauceLabs({
      username: username,
      password: accessKey,
      tunnelIdentifier: getTunnels(),
    });
    var browser = 'chrome',
      version = '43.0',
      platform = 'Windows 7',
      screenResolution = '1920x1080',
      server = "http://" + username + ":" + accessKey +
        "@ondemand.saucelabs.com:80/wd/hub";

    driver = new webdriver.Builder().withCapabilities({
      'browserName': browser,
      'screenResolution': screenResolution,
      'platform': platform,
      'version': version,
      'username': username,
      'accessKey': accessKey,
    }).usingServer(server).build();
    driver.getSession().then(function (sessionid) {
      driver.sessionID = sessionid.id_;
    });
  });

  test.afterEach(function (done) {
    var title = this.currentTest.title,
      passed = (this.currentTest.state === 'passed') ? true : false;
    driver.quit();
    saucelabs.updateJob(driver.sessionID, {
      name: title,
      passed: passed,
      build: 'Build #' + process.env.TRAVIS_BUILD_NUMBER + ', ' + process.env.TRAVIS_COMMIT_MESSAGE,
    }, done);
  });

  function doneReading(golden, screenshot) {
    var diff = pixelmatch(golden, screenshot, diff, 1920, 899);
    return diff;
  }

  function getResponse(gitUrl) {
    var res = request('GET', gitUrl)
    return res.getBody().toString('utf8');
  }


  const PB_APP_URL = 'http://127.0.0.1:8081/';
  const REFERENCE_TMP_PNG = 'buffer.png';
  const REFERENCE_TMP_SVG = 'buffer.svg';
  const CASES_PATH = './integration_tests/cases/';
  var contents = fs.readFileSync(path.resolve(path.join(CASES_PATH + 'test-cases.json')));
  var test_cases = JSON.parse(contents);

  test_cases.cases.forEach(function (test_case) {

    test.it(test_case.name, function () {
      driver.get(PB_APP_URL);
      var wdlCont = getResponse(test_case.wdl_url);
      driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="btn-build"]')), 100000, 'Page wasn\'t loaded in time');
      driver.executeScript("document.getElementById('txt-script').value = '" +
        wdlCont + "';").then(function () {
        driver.findElement(webdriver.By.xpath('//*[@id="btn-build"]')).click();
        driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
          fs.writeFileSync(REFERENCE_TMP_SVG, return_value);
          var f = svg2png.sync(fs.readFileSync(REFERENCE_TMP_SVG));
          fs.writeFileSync(REFERENCE_TMP_PNG, f);
          fs.unlinkSync(REFERENCE_TMP_SVG);
          var golden = fs.readFileSync(REFERENCE_TMP_PNG);
          var screenshot = fs.readFileSync(path.join(CASES_PATH, test_case.reference_img));
          var d = doneReading(golden, screenshot);
          fs.unlinkSync(REFERENCE_TMP_PNG);
          assert.equal(d <= 10, true, 'image is the same ' + d);
        });
      });
    });
  });
});
