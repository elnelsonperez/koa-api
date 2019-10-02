import {Inject, Service} from "typedi";
import {User} from "@src/database/entity/user.entity";
import * as bcrypt from "bcrypt";
import {UserRepository} from "@src/database/repository/user.repository";

@Service()
export default class UserService {

    @Inject()
    userRepository: UserRepository;

    async createUser (name: string, email: string, password: string) {
        const user = new User();
        user.email = email;
        user.password = await bcrypt.hash(password, 5);
        user.name = name;
        return await this.userRepository.save(user);
    }

}
