import {plainToInstance} from "class-transformer";
import {User} from "../entities/user.entity";
import {UserDto} from "../dto/user.dto";

export function toUserDto(user: User): UserDto {
    const plainObj = {
        userId: user.userId,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.role
    };

    return plainToInstance(UserDto, plainObj, { excludeExtraneousValues: true });
}