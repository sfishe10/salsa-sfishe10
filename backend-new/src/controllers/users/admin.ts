import {UserService} from "../../services/user.service";
import {UserDto} from "../../dto/user.dto";
import {plainToInstance} from "class-transformer";
import {toUserDto} from "../../mappers/user.mapper";

const stream = require("stream");
const csv = require("csv-parser");

const userService: UserService = new UserService();

export const create = async (req: any, res: any) => {
  const userDto: UserDto = plainToInstance(UserDto, req.body);

  // check if user exists first
  if (await userService.isEmailInUse(userDto.email)) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const savedUser = await userService.create(userDto);

  res.send(toUserDto(savedUser));
};

export const update = async (req: any, res: any) => {
  const userDto: UserDto = plainToInstance(UserDto, req.body);

  // check if email is in use first
  if (await userService.isEmailInUse(userDto.email)) {
    return res.status(409).json({ message: 'Email already in use' });
  }

  const updatedUser = await userService.create(userDto);

  res.send(toUserDto(updatedUser));
};

// TODO: see if this can be removed and update() can just be used instead
export const assignRole = async (req: any, res: any) => {
  // const email = req.body.email;
  // const role = req.body.role;
  // db.execute('UPDATE User SET role=? WHERE email=?',
  //   [role, email],
  //   (err, result) => {
  //     if (err) {
  //       console.log(err);
  //       return res.status(500).send(err.message);
  //     }
  //     return res.send(result);
  //   });
};

module.exports.uploadRolesCsv = async (req, res) => {
  console.log(req.body);
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }
  const parsedUsers = [];
  const { emailsToSkip } = req.body;

  // Convert buffer to string, remove BOM if present, then convert back to buffer
  const rawCsvString = req.file.buffer.toString('utf8').replace(/^\uFEFF/, '');
  const cleanedBuffer = Buffer.from(rawCsvString, 'utf8');

  const bufferStream = new stream.PassThrough();
  bufferStream.end(cleanedBuffer);
  bufferStream.pipe(csv()).on('data', (row) => {
    const email = row.Email?.trim().toLowerCase() ?? '';
    const role = row.Role?.trim() ?? '';

    const regex = /^.*<(.*)>.*$/;
    if (!(emailsToSkip.includes(email))) {
      const formattedEmail = email.replace(regex, '$1');
      const user = {
        email: formattedEmail,
        role,
      };
      parsedUsers.push(user);
      console.log(user);
    }
  })
    .on('end', () => {
      console.log('Parsed CSV:', parsedUsers);
      // make sure all the emails belong to users
      const emails = parsedUsers.map((user) => user.email);
      const placeholders = emails.map(() => 'SELECT ? AS email').join(' UNION ALL ');

      const selectString = `SELECT input_emails.email FROM (${placeholders}) AS input_emails
            LEFT JOIN User ON input_emails.email = User.email
            WHERE User.email IS NULL`;
      const params = [...emails];
      db.execute(selectString, params, (err, results) => {
        if (err) {
          console.log(err);
          return res.status(500).send(err.message);
        }
        if (results.length) {
          // some emails from the csv file do not have users attached to them
          return res.status(422).send(results);
        }
        // now update the members
        let roleClause = 'CASE email ';
        let emailString = '';
        const emailParams = [];
        const roleParams = [];
        parsedUsers.forEach((member) => {
          roleClause += 'WHEN ? THEN ? ';
          roleParams.push(member.email);
          roleParams.push(member.role);
          emailString += '?, ';
          emailParams.push(member.email);
        });
        roleClause += 'END ';
        emailString = emailString.slice(0, -2);
        const updateString = `UPDATE User SET role=${roleClause} WHERE email IN (${emailString})`;
        db.execute(updateString, roleParams.concat(emailParams), (err2, result) => {
          if (err2) {
            console.log(err2);
            res.status(500).send(err2.message);
          } else {
            res.send(result);
          }
        });
      });
    })
    .on('error', (error) => {
      console.error('Error parsing CSV:', error);
      return res.status(500).json({ error: 'Failed to parse CSV' });
    });
};

