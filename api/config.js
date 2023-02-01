const path = require('path');

const rootPath = __dirname;

let dbURL = 'mongodb://127.0.0.1/dispatchers';
let port = 8000;

if(process.env.NODE_ENV === 'test-local') {
    dbURL = 'mongodb://localhost/dispatchers-test';
}

if(process.env.NODE_ENV === 'test') {
    dbURL = 'mongodb://mongodb:27017/dispatchers-test';
}

if(process.env.NODE_ENV === 'test-front') {
    dbURL = 'mongodb://localhost/dispatchers-test';
    port = 8010;
}

module.exports = {
    rootPath,
    port,
    uploadPath: path.join(rootPath, 'public/uploads'),
    mongo: {
        db: dbURL,
        options: {useNewUrlParser: true},
    },
    mailServerOptions: {
        service: "gmail",
        auth: {
            user: "dispatcheresdp@gmail.com",
            pass: "jivalgiphbokrgkh"
        },
        mailText: (displayName, email, password) => {
            return `Greetings, ${displayName}! You have been authorized! \n 
            Your login: ${email}; \n 
            Your password: ${password} \n
            Please change your password after log in.`
        },
        mailHtml: (displayName, email, password) => {
            return `<p>
                    Greetings, <b>${displayName}</b>! You have been authorized!<br/>
                    Your login: <b>${email}</b>;<br/> 
                    Your password: <b>${password}</b><br/>
                    Please change your password after log in.<br/>
                    </p>`
        }
    }
};