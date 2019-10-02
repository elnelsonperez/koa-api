import {EntityRepository, Repository, Like, getCustomRepository} from 'typeorm';
import {User} from '@src/database/entity/user.entity';
import {Service} from "typedi";

@Service({factory : () => getCustomRepository(UserRepository)})
@EntityRepository(User)
export class UserRepository extends Repository<User> {
    findByNameAndCount(name: string) {
        return this.findAndCount({name: Like(`%${name.toLowerCase()}%`)});
    }
    findByEmail(email: string) {
        return this.findOne({email: email});
    }
}
