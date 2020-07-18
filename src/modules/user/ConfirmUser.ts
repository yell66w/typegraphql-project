import { redis } from './../../redis';
import { Resolver, Mutation, Arg } from 'type-graphql';
import { User } from '../../entity/User';
@Resolver()
export class ConfirmResolver {
	@Mutation(() => Boolean)
	async confirmUser(@Arg('token') token: string): Promise<boolean> {
		const userId = await redis.get(token);
		if (!userId) return false;
		User.update({ id: parseInt(userId, 10) }, { confirmed: true });
		redis.del(token);
		return true;
	}
}
