// src/auth/auth.repository.ts
import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../../database/database.service';
import { IUser } from '../types';

@Injectable()
export class AuthRepository {
  constructor(private readonly db: DatabaseService) {}

  /**
   * Find a user by their email address
   * @param email - User's email address
   * @returns User if found, null otherwise
   */
  async findByEmail(email: string) {
    return this.db.user.findUnique({
      where: { email },
    });
  }

  /**
   * Find a user by their wallet address
   * @param walletAddress - Ethereum wallet address
   * @returns User if found, null otherwise
   */
  async findByWallet(walletAddress: string) {
    return this.db.user.findUnique({
      where: { wallet_address: walletAddress },
    });
  }

  async findByWalletAndEmail(walletAddress: string, email: string) {
    return this.db.user.findUnique({
      where: { wallet_address: walletAddress, email },
    });
  }

  /**
   * Find a user by their ID
   * @param id - User's ID
   * @returns User with limited fields if found, null otherwise
   */
  async findById(id: string) {
    return this.db.user.findUnique({
      where: { id },
      select: {
        id: true,
        email: true,
        wallet_address: true,
        first_name: true,
        last_name: true,
      },
    });
  }

  /**
   * Create a new user
   * @param data - User creation data containing email, password, and wallet address
   * @returns Created user
   */
  async create(data: IUser) {
    return this.db.user.create({
      data: {
        first_name: data.firstName,
        last_name: data.lastName,
        wallet_address: data.walletAddress,
        email: data.email,
        password: data.password,
      },
    });
  }

  /**
   * Update user's refresh token
   * @param userId - User's ID
   * @param refreshToken - New refresh token
   * @returns Updated user
   */
  async updateRefreshToken(userId: string, refreshToken: string) {
    return this.db.user.update({
      where: { id: userId },
      data: { refresh_token: refreshToken },
    });
  }
}
