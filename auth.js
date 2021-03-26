//const passport = require('passport')
//const BearerStrategy = require('passport-http-bearer')
//const UserModel = require('./users/model')

//start new session stuff
const passport = require('passport')
const LocalStrategy = require('passport-local').Strategy
const UserModel = require('./users/model')

module.exports = function(passport) {

passport.serializeUser(function(foundUser, done) {
    done(null, foundUser.id)
})

passport.deserializeUser(function(id, done) {
    UserModel.findById(id, function(err, foundUser) {
        done(err, user)
    })
})

//passport.use('local-signup', new LocalStrategy({
//    usernameField: 'email',
//    passwordField: 'password',
//    passReqToCallback: true
//},
//function(req, email, password, done) {
//    process.nextTick(function() {
//        UserModel.findOne({'local.email': email}, function(err,user) {
//            if(err)
//                return done(err)
//            if(user) {
//                return done(null, false)
//            } else {
//                var newUser = newUser()
//                newUser.local.email = email
//                newUser.local.password = newUser.generateHash(password)
//                newUser.save(function(err) {
//                    if(err)
//                        throw err
//                        return done(null, newUser)
//                })
//            }
//        })
//    })
//}))

passport.use('local-login', new LocalStrategy({
    usernameField: 'email',
    passwordField: 'password',
    passReqToCallback: true
},
function(req, email, password, done) {
    //process.nextTick(function() {
        UserModel.findOne({'local.email': email}, function(err,foundUser) {
            if(err)
                return done(err)
            if(!foundUser)
                return done(null, false)
            if (!foundUser.validPassword(password))
                return done(null, false)
            else
                return done(null, foundUser)
                //var newUser = newUser()
                //newUser.local.email = email
                //newUser.local.password = newUser.generateHash(password)
                //newUser.save(function(err) {
                //    if(err)
                //        throw err
                //        return done(null, newUser)
            })
}))


}
//end new session stuff

//passport.use(new BearerStrategy(
//    function(accessToken, done) {
//        UserModel.findOne({ accessToken })
//            .then((foundUser)=>{
//                if(foundUser){
//                    return done(null, foundUser)
//                }else{
//                    return done(null, false)
//                }
//            })
//            .catch((err)=>{
//                done(err)
//            })
//    }
//  ))

//  module.exports = passport