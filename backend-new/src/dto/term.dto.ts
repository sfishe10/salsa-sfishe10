import {Expose, Type} from "class-transformer";
import {MemberDto} from "./member.dto";
import {MBEventDto} from "./mb-event.dto";

export class TermDto {
    @Expose()
    termId!: number;

    @Expose()
    termName!: string;

    @Expose()
    startDate!: Date;

    @Expose()
    endDate!: Date;

    /**
     * TODO: figure out if this kind of relationship would save time and effort (grabbing everything all at once)
     */
    @Expose()
    @Type(() => MBEventDto)
    events!: MBEventDto[]

    @Expose()
    @Type(() => MemberDto)
    members!: MemberDto[];
}