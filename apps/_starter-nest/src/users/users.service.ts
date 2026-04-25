import type { PrismaClient, UserRole } from "@affex/db-core";
import { Inject, Injectable } from "@nestjs/common";

@Injectable()
export class UsersService {
	constructor(@Inject("PRISMA_CLIENT") private readonly prisma: PrismaClient) {}

	findAll() {
		return this.prisma.user.findMany();
	}

	findOne(id: string) {
		return this.prisma.user.findUnique({ where: { id } });
	}

	create(data: { email: string; name: string; role?: UserRole }) {
		return this.prisma.user.create({ data });
	}

	update(id: string, data: { email?: string; name?: string; role?: UserRole }) {
		return this.prisma.user.update({ where: { id }, data });
	}

	remove(id: string) {
		return this.prisma.user.delete({ where: { id } });
	}
}
