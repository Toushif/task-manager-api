module.exports = function(a) {
    return {
        messages() {
            return {
                send() {}
            }
        }
    }
}

//here we are mocking the mailgun-js npm node module coz this is a use case where when we test everytime the mail is always sent, so we dont want that to happen obvously. Emails should not be fired while we testing. So we create a __mocks__ folder under tests directory. Inside the __mocks__ we create a file with exactly the same name as our module name, eg, here the npom module name is mailgun-js so our file name will be mailgun-js.js. So jest will now invoke this file while importing mailgun-js and not the real mailgun-js. And here we just export a function which returns an object which has a function messages which in turn returns a function send