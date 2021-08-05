var Base = require("../base_page");
var Locator = require("./profile_locators");

Base.prototype.setProfilePicture = function (filename) {
    return this.find(Locator.profilePicture).sendKeys(filename);
}

Base.prototype.setProfileStatus = function (status) {
    this.find(Locator.profileStatus).clear();
    return this.find(Locator.profileStatus).sendKeys(status);
}

Base.prototype.clickSaveBtn = function () {
    return this.find(Locator.profileSaveBtn).click();
};

Base.prototype.findSuccessAlertText = async function () {
    let result = "";
    await this.find(Locator.successAlert, 10000).getText().then(function (text) {
        result = text;
    });
    return result;
}

module.exports = Base;
