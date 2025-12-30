import {db} from "../data-source";
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

    public async insertOrUpdate(users: User[] | User): Promise<number> {
        // try to insert the object, but if there already exists a User object with that email value, update it
        const result = await this.repo.upsert(users, ["email"]);

        // this isn't very useful info right now, but just wanted something to indicate if anything was inserted
        return result.identifiers.length;
    }

    public async updateRole(user: User) {
        await this.repo.update(
            { email: user.email },
            { role: user.role })
    }
}