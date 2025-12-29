import { Expose, Type } from 'class-transformer';
import {MemberDto} from "./member.dto";

export class UserDto {
    @Expose()
    userId!: number;

    @Expose()
    firstName!: string;

    @Expose()
    lastName!: string;

    @Expose()
    email!: string;

    @Expose()
    role!: string;

    // Use `Type` to avoid circular serialization
    // @Expose()
    // @Type(() => MemberDto)
    // members?: MemberDto[];
}
