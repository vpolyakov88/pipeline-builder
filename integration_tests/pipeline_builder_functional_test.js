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
  username = process.env.SAUCE_USERNAME,
  accessKey = process.env.SAUCE_ACCESS_KEY;


function getTunnels() {
  var res = request('GET', 'https://saucelabs.com/rest/v1/' + username + '/tunnels', {
    headers: {
      authorization: 'Basic ' + new Buffer(username + ':' + accessKey).toString("base64")
    },
  });
  return res.getBody().toString('utf8').slice(2).slice(0, -2);
}

test.describe('Pipelin Builder JS functional test', function () {
  this.timeout(600000);
  var driver;
  var saucelabs = new SauceLabs({
    username: username,
    password: accessKey,
    tunnelIdentifier: getTunnels(),
  });

  test.beforeEach(function () {
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
    var result = '';
    result = res.getBody().toString('ASCII');
    return result;
  }


  const PB_APP_URL = 'http://127.0.0.1:8081/';
  const REFERENCE_TMP_PNG = 'buffer.png';
  const REFERENCE_TMP_SVG = 'buffer.svg';
  const CASES_PATH = './integration_tests/cases/';
  var contents = fs.readFileSync(path.resolve(path.join(CASES_PATH + 'test-cases.json')));
  var testCases = JSON.parse(contents);

  testCases.cases.forEach(function (testCase) {
    test.it(testCase.name, function () {
      driver.get(PB_APP_URL);
      var wdlCont = getResponse(testCase.wdl_url).replace(/\n/g, '\\n').replace(/\"/g, '\\"');
      driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="btn-build"]')), 100000, 'Page wasn\'t loaded in time');
      driver.executeScript('document.getElementById("txt-script").value = "' +
        wdlCont + '";');
      setTimeout(function () {
      }, 2000);
      driver.findElement(webdriver.By.xpath('//*[@id="btn-build"]')).click();
      setTimeout(function () {
      }, 2000);
      driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
        fs.writeFileSync(REFERENCE_TMP_SVG, return_value);
        var f = svg2png.sync(fs.readFileSync(REFERENCE_TMP_SVG));
        //console.log(f);
        fs.writeFileSync(REFERENCE_TMP_PNG, f);
        fs.unlinkSync(REFERENCE_TMP_SVG);
        var screenshot = fs.readFileSync(REFERENCE_TMP_PNG);
        var golden = fs.readFileSync(path.join(CASES_PATH, testCase.reference_img));
        var d = doneReading(golden, screenshot);
        fs.unlinkSync(REFERENCE_TMP_PNG);
        assert.equal(d <= 10, true, 'image is the same ' + d);
      });
    });
  });
});
