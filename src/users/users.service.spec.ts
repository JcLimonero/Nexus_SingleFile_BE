import { Test, TestingModule } from '@nestjs/testing';
import { UsersService } from './users.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import { ConflictException, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('UsersService', () => {
  let service: UsersService;
  let repository: Repository<User>;

  const mockUser = {
    id: '1',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'user',
    preferences: { theme: 'default' }
  };

  const mockRepository = {
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    delete: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        UsersService,
        {
          provide: getRepositoryToken(User),
          useValue: mockRepository,
        },
      ],
    }).compile();

    service = module.get<UsersService>(UsersService);
    repository = module.get<Repository<User>>(getRepositoryToken(User));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('create', () => {
    it('should create a new user with hashed password', async () => {
      const createUserDto = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValue('hashedpassword');
      mockRepository.findOne.mockResolvedValue(null);
      mockRepository.create.mockReturnValue(mockUser);
      mockRepository.save.mockResolvedValue(mockUser);

      const result = await service.create(createUserDto);
      expect(result).toEqual(mockUser);
      expect(bcrypt.hash).toHaveBeenCalledWith(createUserDto.password, 10);
    });

    it('should throw ConflictException when username or email exists', async () => {
      const createUserDto = {
        username: 'testuser',
        name: 'Test User',
        email: 'test@example.com',
        password: 'password123',
      };

      mockRepository.findOne.mockResolvedValue(mockUser);

      await expect(service.create(createUserDto)).rejects.toThrow(ConflictException);
    });
  });

  describe('findAll', () => {
    it('should return an array of users', async () => {
      mockRepository.find.mockResolvedValue([mockUser]);

      const result = await service.findAll();
      expect(result).toEqual([mockUser]);
    });
  });

  describe('findOne', () => {
    it('should return a user by id', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findOne('1');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findOne('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('findByUsername', () => {
    it('should return a user by username', async () => {
      mockRepository.findOne.mockResolvedValue(mockUser);

      const result = await service.findByUsername('testuser');
      expect(result).toEqual(mockUser);
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.findOne.mockResolvedValue(null);

      await expect(service.findByUsername('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });

  describe('update', () => {
    it('should update a user', async () => {
      const updateUserDto = {
        name: 'Updated Name',
      };

      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, ...updateUserDto });

      const result = await service.update('1', updateUserDto);
      expect(result).toEqual({ ...mockUser, ...updateUserDto });
    });

    it('should hash password when updating password', async () => {
      const updateUserDto = {
        password: 'newpassword',
      };

      jest.spyOn(bcrypt, 'hash').mockResolvedValueOnce('newhashedpassword');
      mockRepository.findOne.mockResolvedValue(mockUser);
      mockRepository.save.mockResolvedValue({ ...mockUser, password: 'newhashedpassword' });

      const result = await service.update('1', updateUserDto);
      expect(result.password).toBe('newhashedpassword');
      expect(bcrypt.hash).toHaveBeenLastCalledWith('newpassword', 10);
    });
  });

  describe('remove', () => {
    it('should remove a user', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 1 });

      await service.remove('1');
      expect(mockRepository.delete).toHaveBeenCalledWith('1');
    });

    it('should throw NotFoundException when user not found', async () => {
      mockRepository.delete.mockResolvedValue({ affected: 0 });

      await expect(service.remove('nonexistent')).rejects.toThrow(NotFoundException);
    });
  });
}); 