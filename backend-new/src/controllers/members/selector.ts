import {MemberService} from "../../services/member.service";
import {MemberDto} from "../../dto/member.dto";
import {Member} from "../../entities/member.entity";
import {toMemberDto} from "../../mappers/member.mapper";
import {NotFoundError} from "../../errors/not-found-error";

const memberService: MemberService = new MemberService();

/**
 * Event selectors
 */


export const getById = async (req: any, res: any) => {
  try {
    const memberId = req.params.id;

    const member: Member = await memberService.getById(memberId);

    res.send(toMemberDto(member));

  } catch (err) {
    if (err instanceof NotFoundError) {
      return res.status(404).send('Member not found');
    }

    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getBySectionAndTermId = async (req: any, res: any) => {
  try {
    const sectionId = req.params.sectionId;
    const termId = req.params.termId;

    const members: MemberDto[] = await memberService.getBySectionAndTermId(sectionId, termId);

    res.send(members);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};

export const getByTermId = async (req: any, res: any) => {
  try {
    const termId = req.params.id;

    const members: Member[] = await memberService.getByTermId(termId);

    const memberDtos: MemberDto[] = members.map(member => toMemberDto(member));

    res.send(memberDtos);

  } catch (err) {
    console.error(err);
    res.status(500).send('Query failed');
  }
};