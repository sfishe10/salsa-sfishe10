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

    public async getById(userId: number): Promise<User> {
        const user: User | null =
            await this.userRepository.findById(userId);

        if (!user) {
            throw new Error('User not found');
        }

        return user;
    }

    public async isEmailInUse(email: string): Promise<boolean> {
        const user: User | null = await this.userRepository.findByEmail(email);
        return user != null;
    }

    public async create(userDto: UserDto): Promise<User> {
        const newUser: User = new User();
        newUser.email = userDto.email;
        newUser.role = userDto.role;
        newUser.firstName = userDto.firstName;
        newUser.lastName = userDto.lastName;

        return await this.userRepository.save(newUser);
    }

    public async update(userDto: UserDto): Promise<User> {
        const existingUser: User = await this.getById(userDto.userId);
        existingUser.email = userDto.email;
        existingUser.role = userDto.role;
        existingUser.firstName = userDto.firstName;
        existingUser.lastName = userDto.lastName;

        return await this.userRepository.save(existingUser);
    }

    // TODO: I think we can get rid of this - just use getAll() and divide the roles in the frontend
    public async getByRole(role: string): Promise<UserDto[]> {
        const users: User[] =
            await this.userRepository.findByRole(role);

        const userDtos: UserDto[] = users.map(user => toUserDto(user));

        return userDtos;
    }
}