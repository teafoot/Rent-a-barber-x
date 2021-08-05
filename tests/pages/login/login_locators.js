var webdriver = require("selenium-webdriver"),
    By = webdriver.By;

module.exports = {
    email: By.css("#email"),
    password: By.css("#password"),
    submit: By.css("button[type='submit']"),
    successAlert: By.xpath("//*[contains(text(),'logged in successfully')]")
};
