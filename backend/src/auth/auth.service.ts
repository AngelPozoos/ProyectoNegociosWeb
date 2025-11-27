import { Injectable, UnauthorizedException, ConflictException } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { LoginDto, RegisterDto } from './dto/auth.dto';
import * as crypto from 'crypto';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService) { }

    private hashPassword(password: string): string {
        const salt = crypto.randomBytes(16).toString('hex');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return `${salt}:${hash}`;
    }

    private verifyPassword(password: string, storedHash: string): boolean {
        const [salt, originalHash] = storedHash.split(':');
        const hash = crypto.pbkdf2Sync(password, salt, 1000, 64, 'sha512').toString('hex');
        return hash === originalHash;
    }

    async login(loginDto: LoginDto) {
        const { email, password } = loginDto;
        const user = await this.prisma.usuario.findUnique({ where: { email } });

        if (!user) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        if (!this.verifyPassword(password, user.password)) {
            throw new UnauthorizedException('Credenciales inválidas');
        }

        const { password: _, ...result } = user;
        return result;
    }

    async register(registerDto: RegisterDto) {
        const { email, password, nombre } = registerDto;

        const existingUser = await this.prisma.usuario.findUnique({ where: { email } });
        if (existingUser) {
            throw new ConflictException('El correo ya está registrado');
        }

        const hashedPassword = this.hashPassword(password);

        const user = await this.prisma.usuario.create({
            data: {
                email,
                nombre,
                password: hashedPassword,
                rol: 'CLIENTE', // Default role
            },
        });

        const { password: _, ...result } = user;
        return result;
    }
}
