const db = require('../../../config/db');

// module.exports.create = async (req, res) => {
//   db.execute('INSERT INTO Term (termName, startDate, endDate) VALUES (?, ?, ?)',
//     [req.body.termName, req.body.startDate, req.body.endDate],
//     (err, result) => {
//       if (err) {
//         console.log(err);
//         res.status(500).send(err.message);
//       } else {
//         res.send(result);
//       }
//     });
// };
//
// module.exports.update = async (req, res) => {
// };
//
// module.exports.delete = async (req, res) => {
//   await db.execute('DELETE FROM Term WHERE termId=?', [req.params.id]);
//   res.end();
// };
