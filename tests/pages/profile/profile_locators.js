var webdriver = require("selenium-webdriver"),
    By = webdriver.By;

module.exports = {
    profilePicture: By.css("#file_input"),
    profileStatus: By.css("#profile_status"),
    profileSaveBtn: By.css("#user_profile_form button[type='submit']"),
    successAlert: By.xpath("//*[contains(text(),'Profile saved successfully')]")
};
