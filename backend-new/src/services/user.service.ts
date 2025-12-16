import {UserRepository} from "../repositories/user.repository";
import {UserDto} from "../dto/user.dto";
import {User} from "../entities/user.entity";
import {toUserDto} from "../mappers/user.mapper";

export class UserService {
    private userRepository: UserRepository;

    constructor(userRepository?: UserRepository) {
        this.userRepository = userRepository ?? new UserRepository();
    }

    public async getAll(): Promise<UserDto[]> {
        const users: User[] =
            await this.userRepository.findAll();

        const userDtos: UserDto[] = users.map(user => toUserDto(user));

        return userDtos;
    }

    public async getById(userId: number): Promise<UserDto> {
        const user: User | null =
            await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return toUserDto(user);
    }

    // TODO: I think we can get rid of this - just use getAll() and divide the roles in the frontend
    public async getByRole(role: string): Promise<UserDto[]> {
        const users: User[] =
            await this.userRepository.findByRole(role);

        const userDtos: UserDto[] = users.map(user => toUserDto(user));

        return userDtos;
    }
}