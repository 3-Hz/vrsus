import dbConnect from '../../../database/connect';
import Tournament from '../../../database/models/Tournament';

export default async function handler(req, res) {
  const { method } = req;

  await dbConnect();

  switch (method) {
    case 'GET':
      try {
        const tournaments = await Tournament.find({});
        res.status(200).json({ success: true, data: tournaments });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    case 'POST':
      try {
        const tournament = await Tournament.create(req.body);
        res.status(201).json( { success: true, data: tournament });
      } catch (error) {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}
