import dbConnect from '../../../../database/connect';
import Tournament from '../../../../database/models/Tournament';
import createBracket from '../../../../utils/createBracket.js';

export default async function handler(req, res) {
  const {
    query: { id },
    method
  } = req;

  await dbConnect();

  switch (method) {
    case 'PUT':
      try {
        const tournament = await Tournament.findOneAndUpdate({_id: id, started: false}, {
          $push: {
            contestants: req.body.name
          }
        }, {
          new: true,
          runValidators: true
        })

        if (!tournament) {
          return res.status(400).json({ success: false });
        }

        try {
          const bracket = createBracket(tournament.contestants);
          const updated = await Tournament.findOneAndUpdate({_id: id}, {
            bracket: bracket
          });
        } catch {
          return res.status(400).json({ success: false });
        }

        res.status(200).json({ success: true, data: tournament } )
      } catch {
        res.status(400).json({ success: false });
      }
      break;
    case 'DELETE':
      try {
        const tournament = await Tournament.findOneAndUpdate({_id: id, started: false}, {
          $pull: {
            contestants: req.body.name
          }
        }, {
            new: true,
            runValidators: true
        })

        if (!tournament) {
          return res.status(400).json({ success: false });
        }

        try {
          const bracket = tournament.contestants.length > 0 ? createBracket(tournament.contestants) : [];
          const updated = await Tournament.findOneAndUpdate({_id: id}, {
            bracket: bracket
          });
        } catch {
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