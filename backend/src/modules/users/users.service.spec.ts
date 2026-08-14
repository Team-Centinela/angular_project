import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import { UsersService } from './users.service';
import { User } from './entities/user.entity';

type RepoMock = {
  findOne: jest.Mock<
    Promise<User | null>,
    [{ where: { email?: string; id?: string } }]
  >;
  create: jest.Mock;
  save: jest.Mock;
};

const buildRepoMock = (seed: User[] = []): RepoMock => {
  const byEmail = new Map<string, User>(seed.map((u) => [u.email, u]));
  const byId = new Map<string, User>(seed.map((u) => [u.id, u]));
  return {
    findOne: jest.fn(
      ({ where }: { where: { email?: string; id?: string } }) => {
        if (where?.email !== undefined) {
          return Promise.resolve(byEmail.get(where.email) ?? null);
        }
        if (where?.id !== undefined) {
          return Promise.resolve(byId.get(where.id) ?? null);
        }
        return Promise.resolve(null);
      },
    ),
    create: jest.fn((u: Partial<User>) => u as User),
    save: jest.fn((u: User) => {
      byEmail.set(u.email, u);
      if (u.id) byId.set(u.id, u);
      return Promise.resolve(u);
    }),
  };
};

const buildUser = (overrides: Partial<User> = {}): User => ({
  id: '11111111-1111-4111-8111-111111111111',
  name: 'Test User',
  email: 'test@example.com',
  password: 'hashed-stub',
  createdAt: new Date('2026-01-01T00:00:00Z'),
  updatedAt: new Date('2026-01-01T00:00:00Z'),
  ...overrides,
});

describe('UsersService (regression for #116)', () => {
  let service: UsersService;
  let repo: RepoMock;

  const setup = async (seed: User[] = []) => {
    repo = buildRepoMock(seed);
    const moduleRef: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        { provide: getRepositoryToken(User), useValue: repo },
      ],
    }).compile();
    service = moduleRef.get(UsersService);
  };

  describe('email normalization', () => {
    it('lowercases and trims before finding by email', async () => {
      const seed = [buildUser({ email: 'test@example.com' })];
      await setup(seed);

      const result = await service.findByEmail('  TEST@example.com  ');
      expect(result).not.toBeNull();
      expect(result!.email).toBe('test@example.com');
      expect(repo.findOne).toHaveBeenCalledWith({
        where: { email: 'test@example.com' },
      });
    });

    it('findByEmail returns null for unknown user regardless of case', async () => {
      await setup([]);
      expect(await service.findByEmail('Unknown@Example.com')).toBeNull();
    });
  });

  describe('create', () => {
    it('persists with the normalized (lowercased + trimmed) email', async () => {
      await setup([]);
      const created = await service.create(
        'U',
        '  USER@example.com  ',
        'TestPass123!',
      );
      expect(created.email).toBe('user@example.com');
      expect(repo.save).toHaveBeenCalledWith(
        expect.objectContaining({ email: 'user@example.com' }),
      );
    });

    it('rejects a duplicate email that differs only in case (#116)', async () => {
      const seed = [buildUser({ email: 'taken@example.com' })];
      await setup(seed);

      await expect(
        service.create('T', 'TAKEN@example.com', 'TestPass123!'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('rejects a duplicate email that differs only in surrounding whitespace', async () => {
      const seed = [buildUser({ email: 'taken@example.com' })];
      await setup(seed);

      await expect(
        service.create('T', '  taken@example.com  ', 'TestPass123!'),
      ).rejects.toBeInstanceOf(ConflictException);
    });

    it('hashes the password so the stored value is never plaintext', async () => {
      await setup([]);
      await service.create('U', 'user@example.com', 'TestPass123!');
      const savedCalls = repo.save.mock.calls as Array<[User]>;
      const savedArg = savedCalls[0]?.[0];
      expect(savedArg).toBeDefined();
      expect(savedArg.password).not.toBe('TestPass123!');
      expect(savedArg.password).toMatch(/^\$2[aby]\$/);
    });
  });

  describe('findById', () => {
    it('returns the user when found', async () => {
      const seed = [buildUser({ id: 'abc-uuid' })];
      await setup(seed);
      const u = await service.findById('abc-uuid');
      expect(u.id).toBe('abc-uuid');
    });

    it('throws NotFoundException when missing', async () => {
      await setup([]);
      await expect(service.findById('missing')).rejects.toBeInstanceOf(
        NotFoundException,
      );
    });
  });

  describe('toResponse', () => {
    it('omits the password hash', async () => {
      await setup([]);
      const dto = service.toResponse(buildUser({ password: '$2a$10$hashed' }));
      expect(dto).not.toHaveProperty('password');
      expect(dto.email).toBe('test@example.com');
    });
  });
});
