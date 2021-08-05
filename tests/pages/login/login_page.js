var Base = require("../base_page");
var Locator = require("./login_locators");

Base.prototype.setEmailField = function (email) {
    return this.find(Locator.email).sendKeys(email);
}

Base.prototype.setPasswordField = function (password) {
    return this.find(Locator.password).sendKeys(password);
};

Base.prototype.clickLoginBtn = function () {
    return this.find(Locator.submit).click();
};

Base.prototype.findSuccessAlertText = async function () {
    let result = "";
    await this.find(Locator.successAlert, 10000).getText().then(function (text) {
        result = text;
    });
    return result;
}

module.exports = Base;
