## Password Reset Flow Task:

1. Design a forget password page, where the user enters the e-mail id

2. Check if the user exist in the DB

3. If the user is not present send an error message

4. If the user is found generate a random string and send a link with that random string in the mail

5. Store the random string in DB for latest verification

6. When the user enters that link, retrieve the random string and pass it to DB

7. Check if the random string matches

8. If the string matches show the password reset page

9. Store the new password and clear the random string in the db once the user submits the form

10. If the string does not match send an error message

#### Packages Used:

 - npm mongoose
 - npm express
 - npm bcrypt
 - npm jwt
 - npm dotenv
 - npm nodemon
 - npm nodemailer
 - npm cors

#### NodeJS, ExpressJS and MongoDB:

userController: This page has all the logic of the applications. The addUser function is only for the backend to add a user to the database




