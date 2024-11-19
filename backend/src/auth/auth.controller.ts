import { Controller, Get, Redirect, Req, UseGuards } from "@nestjs/common";
import { AuthGuard } from "@nestjs/passport";

@Controller("auth")
export class AuthController {
    @Get("github")
    @UseGuards(AuthGuard("github"))
    async githubLogin(): Promise<void> {}

    @Get("github/login")
    @UseGuards(AuthGuard("github"))
    @Redirect()
    async githubLoginCallback(@Req() req) {
        const username: string = req.user.username;
        if (username) return { url: "/login/success/" + username };
        return { url: "/login/failure" };
    }

    @Get("protected")
    @UseGuards(AuthGuard("jwt"))
    protectedResource() {
        return "JWT is working!";

    }
}
