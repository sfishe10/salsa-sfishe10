import {UserService} from "../../services/user.service";
import {UserDto} from "../../dto/user.dto";
import {plainToInstance} from "class-transformer";
import {toUserDto} from "../../mappers/user.mapper";
import {InvalidEmailsError} from "../../errors/invalid-emails-error";

const userService: UserService = new UserService();

export const create = async (req: any, res: any) => {
  try {
    const userDto: UserDto = plainToInstance(UserDto, req.body);

    // check if user exists first
    if (await userService.isEmailInUse(userDto.email)) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    const savedUser = await userService.create(userDto);

    res.send(toUserDto(savedUser));
  } catch (err: any) {
    console.error('A critical error occurred in users.create():', err.message);
    return res.status(500).send(err.message);
  }
};

export const update = async (req: any, res: any) => {
  try {
    const userDto: UserDto = plainToInstance(UserDto, req.body);

    // TODO: it would be great to be able to update the email if needed, but right now throws an error because
    //  the Member table references the 'email' column  of User. Change Member to reference the 'userId' column

    // // check if email is being used by someone else first
    // const existingUser = await userService.getByEmail(userDto.email);
    // if (existingUser && existingUser.userId != userDto.userId) {
    //   return res.status(409).json({ message: 'Email already in use' });
    // }

    const updatedUser = await userService.update(userDto);

    res.send(toUserDto(updatedUser));
  } catch (err: any) {
    console.error('A critical error occurred in users.update():', err.message);
    return res.status(500).send(err.message);
  }
};

export const uploadRolesCsv = async (req: any, res: any) => {
  if (!req.file) {
    return res.status(400).json({ error: 'No file uploaded' });
  }

  try {
    const ignoreInvalidEmails: boolean = req.body.ignoreInvalidEmails === 'true';

    await userService.parseRolesCsv(req.file, ignoreInvalidEmails);

  } catch (err: any) {
    if (err instanceof InvalidEmailsError) {
      return res.status(422).send(err.invalidEmails);
    }
    console.error('A critical error occurred in users.uploadRolesCsv():', err.message);
    return res.status(500).send(err.message);
  }
};

