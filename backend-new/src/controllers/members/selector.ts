import {MemberService} from "../../services/member.service";
import {MemberDto} from "../../dto/member.dto";

const memberService: MemberService = new MemberService();

/**
 * Event selectors
 */


export const getById = async (req: any, res: any) => {
  const memberId = req.params.id;

  try {
    const member: MemberDto = await memberService.getById(memberId);

    if (!member) {
      return res.status(404).send('Member not found');
    }

    res.send(member);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getSection = async (req: any, res: any) => {
  const sectionId = req.params.id;

  try {
    const members: MemberDto[] = await memberService.getBySectionId(sectionId);

    res.send(members);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getByTermId = async (req: any, res: any) => {
  const termId = req.params.id;

  try {
    const members: MemberDto[] = await memberService.getByTermId(termId);

    res.send(members);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};