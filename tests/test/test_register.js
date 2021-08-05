var { describe, it } = require("selenium-webdriver/testing");
const { expect } = require('chai');
var Register = require("../pages/register/register_page");

describe("Register Test Suite", function () {
    this.timeout(20000);
    let register_page;

    beforeEach(function () {
        register_page = new Register();
        register_page.goToUrl("localhost:3002/register");
    });

    it("User should register a barber successfully", async function () {
        const timestamp = new Date().getTime();
        register_page.setUsernameField("test")
        register_page.setEmailField(`test${timestamp}@test.com`);
        register_page.setPasswordField("test");
        register_page.setPasswordRepeatField("test");
        register_page.selectUserType("barber");
        register_page.clickRegisterBtn();

        let alert = await register_page.findSuccessAlertText();
        expect(alert).to.equal('User registered successfully');
    });

    it("User should register a customer successfully", async function () {
        const timestamp = new Date().getTime();
        register_page.setUsernameField("test")
        register_page.setEmailField(`test${timestamp}@test.com`);
        register_page.setPasswordField("test");
        register_page.setPasswordRepeatField("test");
        register_page.selectUserType("customer");
        register_page.clickRegisterBtn();

        let alert = await register_page.findSuccessAlertText();
        expect(alert).to.equal('User registered successfully');
    });

    afterEach(function () {
        register_page.endSession();
    });
});
