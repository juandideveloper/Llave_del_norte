import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const token = req.nextauth.token
    const pathname = req.nextUrl.pathname

    // Admin intentando entrar a rutas de la tienda
    if (token?.role === "ADMIN" && (
      pathname === "/" ||
      pathname.startsWith("/catalogo") ||
      pathname.startsWith("/perfil") ||
      pathname.startsWith("/carrito") ||
      pathname.startsWith("/checkout") ||
      pathname.startsWith("/registro") ||
      pathname.startsWith("/registro-especial")
    )) {
      return NextResponse.redirect(new URL("/admin", req.url))
    }

    // Usuario normal intentando entrar al admin
    if (pathname.startsWith("/admin") && token?.role !== "ADMIN") {
      return NextResponse.redirect(new URL("/", req.url))
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const pathname = req.nextUrl.pathname

        if (
          pathname.startsWith("/admin") ||
          pathname.startsWith("/perfil") ||
          pathname.startsWith("/checkout")
        ) {
          return !!token
        }

        return true
      }
    }
  }
)

export const config = {
  matcher: [
    "/",
    "/admin/:path*",
    "/perfil/:path*",
    "/checkout/:path*",
    "/carrito/:path*",
    "/catalogo/:path*",
    "/registro/:path*",
    "/registro-especial/:path*",
  ]
}