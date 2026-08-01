const passport = require('passport')
const GoogleStrategy = require('passport-google-oauth20').Strategy
const userModel = require('../models/users_model')

passport.use(new GoogleStrategy({
  clientID: process.env.GOOGLE_CLIENT_ID,
  clientSecret: process.env.GOOGLE_CLIENT_SECRET,
  callbackURL: process.env.GOOGLE_CALLBACK_URL
}, async (accessToken, refreshToken, profile, done) => {
  try {
    const user = await userModel.getUserByGoogleId(profile.id)
    if (user) {
      return done(null, user)
    }

    const userByEmail = await userModel.getUserByEmail(profile.emails[0].value)
    if (userByEmail) {
      await userModel.updateGoogleId(userByEmail.id, profile.id)
      return done(null, userByEmail)
    }

    const username = profile.name.givenName + '_' + profile.id.slice(0, 5)
    const newUser = await userModel.createGoogleUser(
      username,
      profile.emails[0].value,
      profile.name.givenName,
      profile.name.familyName,
      profile.id
    )
    return done(null, newUser)
  } catch (error) {
    return done(error, null)
  }
}))

module.exports = passport