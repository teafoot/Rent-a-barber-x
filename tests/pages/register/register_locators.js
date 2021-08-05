var webdriver = require("selenium-webdriver"),
    By = webdriver.By;

module.exports = {
    username: By.css("input[name='username']"),
    email: By.css("input[name='email']"),
    password: By.css("input[name='password']"),
    passwordRepeat: By.css("input[name='password_confirmation']"),
    userTypeCustomer: By.css("input[name='user_type'][value='customer']"),
    userTypeBarber: By.css("input[name='user_type'][value='barber']"),
    submit: By.css("button[type='submit']"),
    successAlert: By.xpath("//*[contains(text(),'registered successfully')]")
};
