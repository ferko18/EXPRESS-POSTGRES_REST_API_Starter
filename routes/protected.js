//note:  passport-jwtis intended to secure RESTful endpoints without sessions
// Statelessness means that every HTTP request happens in complete isolation. When the client makes an HTTP request,
// it includes all the information necessary for the server to fulfill that request. The server never relies on information
// from previous requests. If that information was important, the client would have to send it again in subsequent request
//https://stackoverflow.com/questions/3105296/if-rest-applications-are-supposed-to-be-stateless-how-do-you-manage-sessions?rq=1

//dependencies
const passport = require("passport");
const JwtStategy = require("passport-jwt").Strategy;
const { ExtractJwt } = require("passport-jwt");

//local dependencies
require("dotenv").config();
const db = require("../database/models/userModel");

//syntax: passport.use (new JwtStategy({}, async (paylod, done)=>{}));

passport.use(
  new JwtStategy(
    {
      jwtFromRequest: ExtractJwt.fromHeader("authorization"),
      secretOrKey: process.env.JWT_SECRET
    },
    async (payload, done) => {
      try {
        const user = await db.getOneUser(payload.user_id);
        if (!user) {
          return done(null, false);
        } else {
          done(null, user);
        }
      } catch (error) {
        done(error, false);
      }
    }
  )
);
