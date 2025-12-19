import {db} from "../config/data-source";
import {User} from "../entities/user.entity";

export class UserRepository {
    private repo = db.getRepository(User);

    public async findAll() {
        return this.repo.find({
            order: { lastName: 'ASC' }
        });
    }

    public async findById(id: number) {
        return this.repo.findOne({
            where: { userId: id },
            relations: { members: true }
        });
    }

    public async findByEmail(email: string) {
        return this.repo.findOne({
            where: { email }
        });
    }

    public async findByRole(role: string) {
        return this.repo.find({
            where: { role: role },
            order: { lastName: 'ASC' }
        });
    }

    public async save(user: Partial<User>) {
        return await this.repo.save(user);
    }
}