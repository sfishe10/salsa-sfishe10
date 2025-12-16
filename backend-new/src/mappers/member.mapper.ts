import {plainToInstance} from "class-transformer";
import {Member} from "../entities/member.entity";
import {MemberDto} from "../dto/member.dto";
import {toPepBandDto} from "./pepBand.mapper";
import {toTermDto} from "./term.mapper";
import {toSectionDto} from "./section.mapper";
import {toUserDto} from "./user.mapper";

export function toMemberDto(member: Member): MemberDto {
    const plainObj = {
        memberId: member.memberId,
        rehearsalConflict: member.rehearsalConflict,

        user: member.user ? toUserDto(member.user) : null,
        pepBand: member.pepBand ? toPepBandDto(member.pepBand) : null,
        section: member.section ? toSectionDto(member.section) : null,
        term: member.term ? toTermDto(member.term) : null
    };

    return plainToInstance(MemberDto, plainObj, { excludeExtraneousValues: true });
}