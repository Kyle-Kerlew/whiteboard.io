import {findWhiteboardById} from "../../../../server/service/board/boardService";

export default async function handler(req, res) {
    const {
        method,
    } = req
    const { whiteboardId } = req.query
    switch (method) {
        case 'GET':
            const response = await findWhiteboardById(whiteboardId, req?.session?.passport?.user);
            res.send(JSON.stringify(response)); //mongodb response
            break;
        default:
            res.setHeader('Allow', ['GET'])
            res.status(405).end(`Method ${method} Not Allowed`)
    }
}
