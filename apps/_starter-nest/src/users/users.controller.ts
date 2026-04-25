import type { UserRole } from "@affex/db-core";
import { Body, Controller, Delete, Get, Param, Patch, Post } from "@nestjs/common";
import type { UsersService } from "./users.service";

@Controller("users")
export class UsersController {
	constructor(private readonly usersService: UsersService) {}

	@Get()
	findAll() {
		return this.usersService.findAll();
	}

	@Get(":id")
	findOne(@Param("id") id: string) {
		return this.usersService.findOne(id);
	}

	@Post()
	create(@Body() body: { email: string; name: string; role?: UserRole }) {
		return this.usersService.create(body);
	}

	@Patch(":id")
	update(
		@Param("id") id: string,
		@Body() body: { email?: string; name?: string; role?: UserRole },
	) {
		return this.usersService.update(id, body);
	}

	@Delete(":id")
	remove(@Param("id") id: string) {
		return this.usersService.remove(id);
	}
}
