import {Expose, Type} from "class-transformer";
import {MemberDto} from "./member.dto";

export class SectionDto {
    @Expose()
    sectionId!: number;

    @Expose()
    name!: string;

    // @Expose()
    // @Type(() => MemberDto)
    // members!: MemberDto[];
}