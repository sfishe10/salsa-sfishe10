import {UserRepository} from "../repositories/user.repository";
import {UserDto} from "../dto/user.dto";
import {User} from "../entities/user.entity";
import {toUserDto} from "../mappers/user.mapper";
import {NotFoundError} from "../errors/not-found-error";
import {Utilities} from "../utilities/utilities";
import {InvalidEmailsError} from "../errors/invalid-emails-error";

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

    public async getById(userId: number): Promise<User | null> {
        const user: User | null =
            await this.userRepository.findById(userId);

        return user;
    }

    public async getByEmail(email: string): Promise<User | null> {
        const user: User | null =
            await this.userRepository.findByEmail(email);

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
        const existingUser = userDto.userId ? await this.getById(userDto.userId) : await this.getByEmail(userDto.email);

        if (!existingUser) {
            throw new NotFoundError('User not found');
        }

        existingUser.role = userDto.role;
        existingUser.firstName = userDto.firstName;
        existingUser.lastName = userDto.lastName;

        return await this.userRepository.save(existingUser);
    }

    public async insertOrUpdate(users: User[] | User) {
        return await this.userRepository.insertOrUpdate(users);
    }

    // TODO: I think we can get rid of this - just use getAll() and divide the roles in the frontend
    public async getByRole(role: string): Promise<UserDto[]> {
        const users: User[] =
            await this.userRepository.findByRole(role);

        const userDtos: UserDto[] = users.map(user => toUserDto(user));

        return userDtos;
    }

    public async parseRolesCsv(file: any, ignoreInvalidEmails: boolean) {
        const rows: Array<Record<string, string>> = await Utilities.parseCsv(file);

        if (!ignoreInvalidEmails) {
            // make sure each of the emails belongs to a current member - if not, send back the ones that don't
            const invalidEmails: string[] = rows
                .map(row => row.Email?.trim().toLowerCase() ?? '')
                .filter(async email => !(await this.isEmailInUse(email)));
            if (invalidEmails.length) {
                // return any invalid emails to the frontend
                throw new InvalidEmailsError(invalidEmails);
            }
        }

        for (const row of rows) {
            // TODO: extract these column names out as constants
            const email = row.Email?.trim().toLowerCase() ?? '';
            const role = row.Role?.trim() ?? '';

            const regex = /^.*<(.*)>.*$/;
            const formattedEmail = email.replace(regex, '$1');
            const user = {
                email: formattedEmail,
                role,
            } as User;

            await this.userRepository.updateRole(user);
        }

    }
}