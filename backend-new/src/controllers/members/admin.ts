import {MemberService} from "../../services/member.service";
import {MemberDto} from "../../dto/member.dto";
import {plainToInstance} from "class-transformer";
import {UserService} from "../../services/user.service";
import {Member} from "../../entities/member.entity";
import {toMemberDto} from "../../mappers/member.mapper";
import {InvalidEmailsError} from "../../errors/invalid-emails-error";
import {InvalidSectionsError} from "../../errors/invalid-sections-error";

const memberService: MemberService = new MemberService();
const userService: UserService = new UserService();

export const create = async (req: any, res: any) => {
  try {
    const memberDto: any = req.body;
    console.log(memberDto);

    // make sure the User exists
    if (!(await userService.isEmailInUse(memberDto.user.email))) {
      return res.status(404).send({ message: 'User not found' });
    }

    const savedMember: Member = await memberService.create(memberDto);

    res.send(toMemberDto(savedMember));
  } catch (err: any) {
    console.error('A critical error occurred in members.create():', err.message);
    return res.status(500).send(err.message);
  }
};

export const update = async (req: any, res: any) => {
  try {
    const memberDto: MemberDto = plainToInstance(MemberDto, req.body);

    const updatedMember: Member = await memberService.update(memberDto);

    res.send(toMemberDto(updatedMember));
  } catch (err: any) {
    console.error('A critical error occurred in members.update():', err.message);
    return res.status(500).send(err.message);
  }
};

export const deleteMember = async (req: any, res: any) => {
  try {
    const memberId: number = req.params.id;

    await memberService.delete(memberId);

    res.status(200).send(null);
  } catch (err: any) {
    console.error('A critical error occurred in members.deleteMember():', err.message);
    return res.status(500).send(err.message);
  }
};

// For uploading the supplemental form
export const uploadCsv = async (req: any, res: any) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const termId: number = req.params.id;

    await memberService.parseCsvAndCreateMembers(req.file, termId);

    res.status(200).send(true);
  } catch (err: any) {
    if (err instanceof InvalidSectionsError) {
      return res.status(422).send(err.invalidSections);
    }
    console.error('A critical error occurred in members.uploadCsv():', err.message);
    return res.status(500).send(err.message);
  }

};

export const uploadRehearsalConflictsCsv = async (req: any, res: any)  => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }

    const termId: number = req.params.id;
    const ignoreInvalidEmails: boolean = req.body.ignoreInvalidEmails === 'true';

    await memberService.parseRehearsalConflictsCsv(req.file, termId, ignoreInvalidEmails);

  } catch (err: any) {
    if (err instanceof InvalidEmailsError) {
      return res.status(422).send(err.invalidEmails);
    }
    console.error('A critical error occurred in members.uploadRehearsalConflictsCsv():', err.message);
    return res.status(500).send(err.message);
  }

};
