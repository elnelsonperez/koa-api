import {EntityRepository, Repository} from 'typeorm';
import {User} from '@src/database/entity/user.entity';
import {Like} from "typeorm";

@EntityRepository(User)
export class UserRepository extends Repository<User> {
    findByNameAndCount(name: string) {
        return this.findAndCount({name: Like(`%${name.toLowerCase()}%`)});
    }

}
