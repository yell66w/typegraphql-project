import { Resolver, Query, Mutation, Arg, UseMiddleware } from 'type-graphql';
import bcrypt from 'bcryptjs';
import { User } from '../../entity/User';
import { RegisterInput } from './register/RegisterInput';
import { isAuth } from '../middleware/isAuth';

@Resolver()
export class RegisterResolver {
	@UseMiddleware(isAuth)
	@Query(() => String)
	async hello() {
		return 'Authorized hehe';
	}

	@Mutation(() => User)
	async register(@Arg('data') { email, firstName, lastName, password }: RegisterInput): Promise<User> {
		const hashedPassword = await bcrypt.hash(password, 12);
		const user = await User.create({
			firstName,
			lastName,
			email,
			password: hashedPassword
		});

		await user.save();

		return user;
	}
}
