import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { jwtUtils } from "../../utils";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {
    const { token = '' } = req.cookies;

    try {
        await jwtUtils.isValidToken(token);
        return NextResponse.next();
    } catch (error) {
        console.log(error);
        return NextResponse.redirect(`/auth/login?p=${ req.page.name }`)
    }

}
