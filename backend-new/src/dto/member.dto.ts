import { Expose, Type } from 'class-transformer';
import {UserDto} from "./user.dto";
import {TermDto} from "./term.dto";
import {PepBandDto} from "./pep-band.dto";
import {SectionDto} from "./section.dto";

export class MemberDto {
    @Expose()
    memberId!: number;

    @Expose()
    @Type(() => UserDto)
    user!: UserDto;

    @Expose()
    @Type(() => PepBandDto)
    pepBand!: PepBandDto | null;

    @Expose()
    @Type(() => SectionDto)
    section!: SectionDto | null;

    @Expose()
    @Type(() => TermDto)
    term!: TermDto;

    @Expose()
    rehearsalConflict!: string | null;
}
