var assert = require('assert'),
  test = require('selenium-webdriver/testing'),
  webdriver = require('selenium-webdriver'),
  pixelmatch = require('pixelmatch'),
  until = require('selenium-webdriver/lib/until'),
  SauceLabs = require("saucelabs"),
  username = process.env.SAUCE_USERNAME,
  accessKey = process.env.SAUCE_ACCESS_KEY,
  saucelabs = new SauceLabs({
    username: username,
    password: accessKey
  });

test.describe('Pipelin Builder JS functional test', function () {
  this.timeout(600000);

  var driver;

  test.beforeEach(function () {
    var browser = 'chrome',
      version = '43.0',
      platform = 'Windows 7',
      screenResolution = '1920x1080',
      build = process.env.TRAVIS_JOB_NUMBER;
      server = "http://" + username + ":" + accessKey +
        "@ondemand.saucelabs.com:80/wd/hub";


    driver = new webdriver.Builder().withCapabilities({
      'browserName': browser,
      'screenResolution': screenResolution,
      'platform': platform,
      'version': version,
      'username': username,
      'accessKey': accessKey,
      'build': build,
    }).usingServer(server).build();
    driver.getSession().then(function (sessionid) {
      driver.sessionID = sessionid.id_;
    });

  });

  test.afterEach(function (done) {
    var title = this.currentTest.title,
      passed = (this.currentTest.state === 'passed') ? true : false;
    driver.quit();
    saucelabs.tagName.
    saucelabs.updateJob(driver.sessionID, {
      name: title,
      passed: passed
    }, done);
  });

  function doneReading(golden, screenshot) {
    var diff = pixelmatch(golden, screenshot, diff, 1920, 899);
    return diff;
  }

  test.it('ConvertPairedFastQToUnmappedBamWf_170107.wdl', function () {
    var wdlname = 'ConvertPairedFastQToUnmappedBamWf_170107';
    driver.get('http://pb.opensource.epam.com/?url=https://raw.githubusercontent.com/broadinstitute/wdl/develop/scripts/broad_dsde_workflows/' + wdlname + '.wdl');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="wdl"]')), 10000, 'Page wasn\'t loaded in time');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@class="build-ok"]')), 10000, 'Build failure');
    driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
      require("fs").writeFileSync("buffer.svg", return_value);
      var f = require('svg2png').sync(require("fs").readFileSync("buffer.svg"));
      require("fs").writeFileSync("buffer.png", f);
      require("fs").unlinkSync("buffer.svg");
      var golden = require("fs").readFileSync("buffer.png"),
        screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      console.log(test);
      var d = doneReading(golden, screenshot);
      require("fs").unlinkSync("buffer.png");
      assert.equal(d <= 10, true, 'image the same ' + d);
    });
  });

  test.it('GenotypeGVCFsScatterWf_170204.wdl', function () {
    var wdlname = 'GenotypeGVCFsScatterWf_170204';
    driver.get('http://pb.opensource.epam.com/?url=https://raw.githubusercontent.com/broadinstitute/wdl/develop/scripts/broad_dsde_workflows/' + wdlname + '.wdl');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="wdl"]')), 10000, 'Page wasn\'t loaded in time');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@class="build-ok"]')), 10000, 'Build failure');
    driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
      require("fs").writeFileSync("buffer.svg", return_value);
      var f = require('svg2png').sync(require("fs").readFileSync("buffer.svg"));
      require("fs").writeFileSync("buffer.png", f);
      require("fs").unlinkSync("buffer.svg");
      var golden = require("fs").readFileSync("buffer.png"),
        screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      console.log(test);
      var d = doneReading(golden, screenshot);
      require("fs").unlinkSync("buffer.png");
      assert.equal(d <= 10, true, 'image the same ' + d);
    });
  });

  test.it('HaplotypeCallerGvcfScatterWf_170204.wdl', function () {
    var wdlname = 'HaplotypeCallerGvcfScatterWf_170204';
    driver.get('http://pb.opensource.epam.com/?url=https://raw.githubusercontent.com/broadinstitute/wdl/develop/scripts/broad_dsde_workflows/' + wdlname + '.wdl');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="wdl"]')), 10000, 'Page wasn\'t loaded in time');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@class="build-ok"]')), 10000, 'Build failure');
    driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
      require("fs").writeFileSync("buffer.svg", return_value);
      var f = require('svg2png').sync(require("fs").readFileSync("buffer.svg"));
      require("fs").writeFileSync("buffer.png", f);
      require("fs").unlinkSync("buffer.svg");
      var golden = require("fs").readFileSync("buffer.png"),
        screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      console.log(test);
      var d = doneReading(golden, screenshot);
      require("fs").unlinkSync("buffer.png");
      assert.equal(d <= 10, true, 'image the same ' + d);
    });
  });

  test.it('JointDiscoveryWf_170305.wdl', function () {
    var wdlname = 'JointDiscoveryWf_170305';
    driver.get('http://pb.opensource.epam.com/?url=https://raw.githubusercontent.com/broadinstitute/wdl/develop/scripts/broad_dsde_workflows/' + wdlname + '.wdl');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="wdl"]')), 10000, 'Page wasn\'t loaded in time');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@class="build-ok"]')), 10000, 'Build failure');
    driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
      require("fs").writeFileSync("buffer.svg", return_value);
      var f = require('svg2png').sync(require("fs").readFileSync("buffer.svg"));
      require("fs").writeFileSync("buffer.png", f);
      require("fs").unlinkSync("buffer.svg");
      var golden = require("fs").readFileSync("buffer.png"),
        screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      console.log(test);
      var d = doneReading(golden, screenshot);
      require("fs").unlinkSync("buffer.png");
      assert.equal(d <= 10, true, 'image the same ' + d);
    });
  });

  test.it('RevertBamToUnmappedRGBamsWf_170107.wdl', function () {
    var wdlname = 'RevertBamToUnmappedRGBamsWf_170107';
    driver.get('http://pb.opensource.epam.com/?url=https://raw.githubusercontent.com/broadinstitute/wdl/develop/scripts/broad_dsde_workflows/' + wdlname + '.wdl');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="wdl"]')), 10000, 'Page wasn\'t loaded in time');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@class="build-ok"]')), 10000, 'Build failure');
    driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
      require("fs").writeFileSync("buffer.svg", return_value);
      var f = require('svg2png').sync(require("fs").readFileSync("buffer.svg"));
      require("fs").writeFileSync("buffer.png", f);
      require("fs").unlinkSync("buffer.svg");
      var golden = require("fs").readFileSync("buffer.png"),
        screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      console.log(test);
      var d = doneReading(golden, screenshot);
      require("fs").unlinkSync("buffer.png");
      assert.equal(d <= 10, true, 'image the same ' + d);
    });
  });

  test.it('ValidateBamsWf_170107.wdl', function () {
    var wdlname = 'ValidateBamsWf_170107';
    driver.get('http://pb.opensource.epam.com/?url=https://raw.githubusercontent.com/broadinstitute/wdl/develop/scripts/broad_dsde_workflows/' + wdlname + '.wdl');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="wdl"]')), 10000, 'Page wasn\'t loaded in time');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@class="build-ok"]')), 10000, 'Build failure');
    driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
      require("fs").writeFileSync("buffer.svg", return_value);
      var f = require('svg2png').sync(require("fs").readFileSync("buffer.svg"));
      require("fs").writeFileSync("buffer.png", f);
      require("fs").unlinkSync("buffer.svg");
      var golden = require("fs").readFileSync("buffer.png"),
        screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      console.log(test);
      var d = doneReading(golden, screenshot);
      require("fs").unlinkSync("buffer.png");
      assert.equal(d <= 10, true, 'image the same ' + d);
    });
  });

  test.it('VariantRecalibrationWf_170305.wdl', function () {
    var wdlname = 'VariantRecalibrationWf_170305';
    driver.get('http://pb.opensource.epam.com/?url=https://raw.githubusercontent.com/broadinstitute/wdl/develop/scripts/broad_dsde_workflows/' + wdlname + '.wdl');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@id="wdl"]')), 10000, 'Page wasn\'t loaded in time');
    driver.wait(until.elementLocated(webdriver.By.xpath('//*[@class="build-ok"]')), 10000, 'Build failure');
    driver.executeScript('var svg = document.querySelector("svg").parentNode.innerHTML; return svg;').then(function (return_value) {
      require("fs").writeFileSync("buffer.svg", return_value);
      var f = require('svg2png').sync(require("fs").readFileSync("buffer.svg"));
      require("fs").writeFileSync("buffer.png", f);
      require("fs").unlinkSync("buffer.svg");
      var golden = require("fs").readFileSync("buffer.png"),
        screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      screenshot = require("fs").readFileSync('./integration_tests/' + wdlname + '.png');
      console.log(test);
      var d = doneReading(golden, screenshot);
      require("fs").unlinkSync("buffer.png");
      assert.equal(d <= 10, true, 'image the same ' + d);
    });
  });
});
