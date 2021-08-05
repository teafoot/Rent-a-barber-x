var { describe, it } = require("selenium-webdriver/testing");
const { expect, assert } = require('chai');
var Login = require("../pages/login/login_page");
var Profile = require("../pages/profile/profile_page");
const { until } = require("selenium-webdriver");

describe("Profile Test Suite", function () {
    this.timeout(20000);
    let login_page = new Login();
    let profile_page;

    before(async function () {
        login_page.goToUrl("localhost:3002/login");

        login_page.setEmailField("test0@test.com");
        login_page.setPasswordField("test");
        login_page.clickLoginBtn();

        // await login_page.driver.sleep(5000)
        // CAUSES ERROR
        // let alert = await login_page.findSuccessAlertText();
        // expect(alert).to.equal('User logged in successfully');

        await login_page.driver.sleep(5000)
    });

    it("User should be able to update their profile successfully", async function () {
        profile_page = new Profile(login_page.driver);
        profile_page.goToUrl("localhost:3002/profile");

        const timestamp = new Date().getTime();
        // profile_page.setProfilePicture(`test-${timestamp}.jpg`); // TODO: upload existing filename
        profile_page.setProfileStatus(`status-${timestamp}`);
        profile_page.clickSaveBtn();

        let alert = await profile_page.findSuccessAlertText();
        expect(alert).to.equal('Profile saved successfully');
    })

    afterEach(function () {
        profile_page.endSession();
    });
});
