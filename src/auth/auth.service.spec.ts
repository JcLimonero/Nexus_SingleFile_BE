import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from './auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../users/users.service';
import { UnauthorizedException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';

describe('AuthService', () => {
  let service: AuthService;
  let usersService: UsersService;
  let jwtService: JwtService;

  const mockUser = {
    id: '1',
    username: 'testuser',
    name: 'Test User',
    email: 'test@example.com',
    password: 'hashedpassword',
    role: 'user',
    preferences: { theme: 'default' }
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
  };

  const mockJwtService = {
    sign: jest.fn().mockReturnValue('mock.jwt.token'),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        {
          provide: UsersService,
          useValue: mockUsersService,
        },
        {
          provide: JwtService,
          useValue: mockJwtService,
        },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    usersService = module.get<UsersService>(UsersService);
    jwtService = module.get<JwtService>(JwtService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user without password when credentials are valid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(true);
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await service.validateUser('testuser', 'password123');
      expect(result).toEqual({
        id: mockUser.id,
        username: mockUser.username,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        preferences: mockUser.preferences
      });
    });

    it('should return null when password is invalid', async () => {
      jest.spyOn(bcrypt, 'compare').mockResolvedValue(false);
      mockUsersService.findByUsername.mockResolvedValue(mockUser);

      const result = await service.validateUser('testuser', 'wrongpassword');
      expect(result).toBeNull();
    });

    it('should return null when user is not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      const result = await service.validateUser('nonexistent', 'password123');
      expect(result).toBeNull();
    });
  });

  describe('login', () => {
    it('should return access token and user data when login is successful', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue({
        id: mockUser.id,
        username: mockUser.username,
        name: mockUser.name,
        email: mockUser.email,
        role: mockUser.role,
        preferences: mockUser.preferences
      });

      const result = await service.login({
        username: 'testuser',
        password: 'password123',
      });

      expect(result).toEqual({
        access_token: 'mock.jwt.token',
        user: {
          id: mockUser.id,
          username: mockUser.username,
          name: mockUser.name,
          email: mockUser.email,
          role: mockUser.role,
          preferences: mockUser.preferences
        },
      });
    });

    it('should throw UnauthorizedException when credentials are invalid', async () => {
      jest.spyOn(service, 'validateUser').mockResolvedValue(null);

      await expect(
        service.login({
          username: 'testuser',
          password: 'wrongpassword',
        }),
      ).rejects.toThrow(UnauthorizedException);
    });
  });
}); 