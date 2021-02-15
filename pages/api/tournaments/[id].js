import dbConnect from '../../../database/connect';
import Tournament from '../../../database/models/Tournament';

export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const tournament = await Tournament.findById(id);
        if (!tournament) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: tournament });
      } catch {
        res.status(400).json({ success: false });
      }
      break;
    case 'PUT':
      try {

      } catch {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {

      } catch {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}