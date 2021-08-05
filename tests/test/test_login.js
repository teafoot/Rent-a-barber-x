var { describe, it } = require("selenium-webdriver/testing");
const { expect } = require('chai');
var Login = require("../pages/login/login_page");

describe("Login Test Suite", function () {
    this.timeout(20000);
    let login_page;

    beforeEach(function () {
        login_page = new Login();
        login_page.goToUrl("localhost:3002/login");
    });

    it("It should login successfully into account", async function() { // set to existant email in MongoDB
        login_page.setEmailField("test0@test.com");
        login_page.setPasswordField("test");
        login_page.clickLoginBtn();

        let alert = await login_page.findSuccessAlertText();
        expect(alert).to.equal('User logged in successfully');
    });

    afterEach(function () {
        login_page.endSession();
    });
});
