import {Expose, Type} from "class-transformer";
import {MBEventDto} from "./mb-event.dto";
import {MemberDto} from "./member.dto";

export class PepBandDto {
    @Expose()
    bandId!: string;

    @Expose()
    displayName!: string;

    // @Expose()
    // @Type(() => MbEventDto)
    // events!: MbEventDto[];
    //
    @Expose()
    @Type(() => MemberDto)
    members!: MemberDto[];
}