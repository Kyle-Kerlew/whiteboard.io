import {getLoginSession} from '../../../lib/auth'
import {getUserByEmail} from "../../../server/service/user/userService";

export default async function handler(req, res) {
    const {
        method,
    } = req

    switch (method) {
        case 'GET':
            const session = await getLoginSession(req)
            const user = (session && (await getUserByEmail(session.email))) ?? null
            if (!user) {
                res.status(401).send()
            } else {
                res.status(200).json({user})
            }
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
            break;

    }
}
