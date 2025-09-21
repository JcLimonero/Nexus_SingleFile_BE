import { Test, TestingModule } from '@nestjs/testing';
import { AuthService } from '../../src/auth/auth.service';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from '../../src/users/users.service';
import { UnauthorizedException } from '@nestjs/common';

describe('AuthService', () => {
  let service: AuthService;
  let jwtService: JwtService;
  let usersService: UsersService;

  const mockJwtService = {
    sign: jest.fn(),
    verify: jest.fn(),
  };

  const mockUsersService = {
    findByUsername: jest.fn(),
    create: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        AuthService,
        { provide: JwtService, useValue: mockJwtService },
        { provide: UsersService, useValue: mockUsersService },
      ],
    }).compile();

    service = module.get<AuthService>(AuthService);
    jwtService = module.get<JwtService>(JwtService);
    usersService = module.get<UsersService>(UsersService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  describe('validateUser', () => {
    it('should return user if credentials are valid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      jest.spyOn(service as any, 'comparePasswords').mockResolvedValue(true);

      const result = await service.validateUser('testuser', 'password');
      expect(result).toEqual({ id: 1, username: 'testuser' });
    });

    it('should throw UnauthorizedException if user is not found', async () => {
      mockUsersService.findByUsername.mockResolvedValue(null);

      await expect(service.validateUser('testuser', 'password')).rejects.toThrow(
        UnauthorizedException,
      );
    });

    it('should throw UnauthorizedException if password is invalid', async () => {
      const mockUser = {
        id: 1,
        username: 'testuser',
        password: 'hashedpassword',
      };

      mockUsersService.findByUsername.mockResolvedValue(mockUser);
      jest.spyOn(service as any, 'comparePasswords').mockResolvedValue(false);

      await expect(service.validateUser('testuser', 'wrongpassword')).rejects.toThrow(
        UnauthorizedException,
      );
    });
  });

  describe('login', () => {
    it('should return access token', async () => {
      const mockUser = { 
        id: 1, 
        username: 'testuser',
        password: 'password' 
      };
      const mockToken = 'mock.jwt.token';

      mockJwtService.sign.mockReturnValue(mockToken);

      const result = await service.login(mockUser);
      expect(result).toEqual({ access_token: mockToken });
      expect(mockJwtService.sign).toHaveBeenCalledWith({
        username: mockUser.username,
        sub: mockUser.id,
      });
    });
  });
}); 