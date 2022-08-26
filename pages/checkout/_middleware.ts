import { NextFetchEvent, NextRequest, NextResponse } from "next/server";
import { getToken } from 'next-auth/jwt';
//import { jwtUtils } from "../../utils";

export async function middleware(req: NextRequest, ev: NextFetchEvent) {

    const session = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log({session})

    if ( !session ) {
        return NextResponse.redirect(`/auth/login?p=${ req.page.name }`);
    }

    return NextResponse.next();

    // Logica personalizada de verificacion basada en cookies
    // const { token = '' } = req.cookies;

    // try {
    //     await jwtUtils.isValidToken(token);
    //     return NextResponse.next();
    // } catch (error) {
    //     console.log(error);
    //     return NextResponse.redirect(`/auth/login?p=${ req.page.name }`)
    // }

}
