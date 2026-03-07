import { NextRequest, NextResponse } from "next/server"
import { jwtVerify } from "jose"

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_ACCESS_SECRET)

export async function middleware(request: NextRequest) {
  const token = request.cookies.get("accessToken")?.value
  const { pathname } = request.nextUrl


  // Public routes
  if (
    pathname.startsWith("/accounts/auth")
    // pathname.startsWith("/register") ||
    // pathname.startsWith("/api")
  ) {
    return NextResponse.next()
  }

  // If no token → redirect to login
  if (!token) {
    return NextResponse.redirect(new URL("/accounts/auth", request.url))
  }

  try {
    // Verify & decode token
    const { payload } = await jwtVerify(token, JWT_SECRET)
    const role = payload.role as string

    const roleRoutes: Record<string, string> = {
        "/admin": "admin",
        "/counsellor": "counsellor",
        "/student": "student",
    }

    for (const route in roleRoutes) {
        if (pathname.startsWith(route) && role !== roleRoutes[route]) {
            return NextResponse.redirect(new URL("/unauthorized", request.url))
        }
    }

    return NextResponse.next()
  } catch (error) {
    // Invalid token
    return NextResponse.redirect(new URL("/login", request.url))
  }
}


export const config = {
  matcher: [
    
    '/((?!api|_next/static|_next/image|favicon.ico|.*\\.svg$).*)',
  ],
}