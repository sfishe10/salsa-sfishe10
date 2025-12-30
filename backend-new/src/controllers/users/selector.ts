import {UserService} from "../../services/user.service";
import {UserDto} from "../../dto/user.dto";
import {User} from "../../entities/user.entity";
import {NotFoundError} from "../../errors/not-found-error";

const userService: UserService = new UserService();

/**
 * Event selectors
 */

export const getAll = async (req: any, res: any) => {
    try {
        const users: UserDto[] = await userService.getAll();

        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};

export const getById = async (req: any, res: any) => {
    try {
        const userId = req.params.id;

        const user: User | null = await userService.getById(userId);

        if (!user) {
            return res.status(404).send('User not found');
        }

        res.send(user);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};

export const getByRole = async (req: any, res: any) => {
    try {
        const role = req.params.role;

        const users: UserDto[] = await userService.getByRole(role);

        res.send(users);
    } catch (err) {
        console.error(err);
        res.status(500).send('Query failed');
    }
};
