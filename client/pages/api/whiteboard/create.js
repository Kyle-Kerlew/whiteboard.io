import {createWhiteboard} from "../../../server/service/board/boardService";

export default async function handler(req, res) {
    const {
        method,
    } = req

    switch (method) {
        case 'POST':
            const response = await createWhiteboard(req?.session?.passport?.user);
            res.send(JSON.stringify(response))
            break
        default:
            res.setHeader('Allow', ['POST'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
