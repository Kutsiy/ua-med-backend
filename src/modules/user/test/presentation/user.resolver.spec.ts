import { UserService } from '@modules/user/services';
import { UserResolver, User } from '@modules/user/presentation';
import { UserRepository } from '@modules/user/infrastructure';
import { PrismaService } from '@common/services';

describe('UserResolver', () => {
  let service: UserService;
  let resolver: UserResolver;

  beforeEach(() => {
    service = new UserService(new UserRepository(new PrismaService()));
    resolver = new UserResolver(service);
  });

  describe('findAllUser', () => {
    it('return array that containt all users', async () => {
      const mockedData: Array<User> = [
        {
          id: 'test',
          firstName: 'test',
          secondName: 'test',
          middleName: 'test',
          email: 'test@email.com',
          phoneNumber: '',
          createdAt: new Date(),
          deletedAt: null,
          bannedAt: null,
          lastOnlineAt: null,
          myRoles: null,
          myBooking: null,
          myToken: null,
        },
      ];

      jest.spyOn(resolver, 'getAllUsers').mockImplementation(() => Promise.resolve(mockedData));
      expect(await resolver.getAllUsers()).toBe(mockedData);
    });
  });
});
