import passport from "../../../configuration/passportConfig";
import nextConnect from 'next-connect'
import { setLoginSession } from '../../../lib/auth';

const authenticate = (method, req, res) =>
    new Promise((resolve, reject) => {
        passport.authenticate(method, { }, (error, token) => {
            if (error) {
                reject(error)
            } else {
                resolve(token)
            }
        })(req, res)
    })

export default nextConnect()
    .use(passport.initialize())
    .post(async (req, res) => {
        try {
            const user = await authenticate('local-guest', req, res)
            // session is the payload to save in the token, it may contain basic info about the user
            const session = { ...user }

            await setLoginSession(res, session)

            res.status(200).send({ done: true })
        } catch (error) {
            console.error(error)
            res.status(401).send(error.message)
        }
    })
