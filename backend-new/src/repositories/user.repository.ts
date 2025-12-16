import {db} from "../config/data-source";
import {User} from "../entities/user.entity";

export class UserRepository {
    private repo = db.getRepository(User);

    findAll() {
        return this.repo.find({
            order: { lastName: 'ASC' }
        });
    }

    findById(id: number) {
        return this.repo.findOne({
            where: { userId: id },
            relations: { members: true }
        });
    }

    findByRole(role: string) {
        return this.repo.find({
            where: { role: role },
            order: { lastName: 'ASC' }
        });
    }

    async create(user: Partial<User>) {
        const newUser = this.repo.create(user);
        return await this.repo.save(newUser);
    }
}