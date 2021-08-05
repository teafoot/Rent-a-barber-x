var webdriver = require("selenium-webdriver");
var until = webdriver.until;

var BasePage = function (driver) {
    this.driver = driver || new webdriver.Builder()
        .withCapabilities(webdriver.Capabilities.firefox())
        .build();
    var driver = this.driver;

    this.goToUrl = function (url) {
        return driver.get(url);
    };

    // this.navigateToUrl = function (url) {
        // return driver.navigate().to(url);
    // }

    this.endSession = function () {
        return driver.quit();
    };

    this.find = function (element, timeout=5000) {
        driver.wait(until.elementLocated(element), timeout);
        return driver.findElement(element);
    };

    this.findAll = function (element, timeout=5000) {
        driver.wait(until.elementLocated(element), timeout);
        return driver.findElements(element);
    };
};

module.exports = BasePage;
