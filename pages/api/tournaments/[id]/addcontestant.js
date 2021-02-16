import dbConnect from '../../../../database/connect';
import Tournament from '../../../../database/models/Tournament';

export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req;

  await dbConnect();

  switch (method) {
    case 'PUT':
      try {
        const tournament = await Tournament.update({_id: id}, {
          $push: {
            contestants: req.body.name
          }
        }, {
          new: true,
          runValidators: true
        });
        if (!tournament) {
          return res.status(400).json({ success: false });
        }
        res.status(200).json({ success: true, data: tournament } )
      } catch {
        res.status(400).json({ success: false });
      }
      break;
    default:
      res.status(400).json({ success: false });
      break;
  }
}