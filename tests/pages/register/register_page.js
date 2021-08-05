var Base = require("../base_page");
var Locator = require("./register_locators");

Base.prototype.setUsernameField = function (username) {
    return this.find(Locator.username).sendKeys(username);
}

Base.prototype.setEmailField = function (email) {
    return this.find(Locator.email).sendKeys(email);
}

Base.prototype.setPasswordField = function (password) {
    return this.find(Locator.password).sendKeys(password);
};

Base.prototype.setPasswordRepeatField = function (password) {
    return this.find(Locator.passwordRepeat).sendKeys(password);
};

Base.prototype.selectUserType = function (userType) {
    if (userType == "barber") {
        return this.find(Locator.userTypeBarber).click();
    } else {
        return this.find(Locator.userTypeCustomer).click();
    }
};

Base.prototype.clickRegisterBtn = function () {
    return this.find(Locator.submit).click();
};

Base.prototype.findSuccessAlertText = async function () {
    let result = "";
    await this.find(Locator.successAlert).getText().then(function (text) {
        result = text;
    });
    return result;
}

module.exports = Base;
