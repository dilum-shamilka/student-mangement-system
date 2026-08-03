import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// මෙහි 'export default' ලෙස වෙනස් කර ඇත
export default function middleware(request: NextRequest) {
    const token = request.cookies.get("token")?.value;
    const user = request.cookies.get("user")?.value;
    const pathname = request.nextUrl.pathname;

    // Public routes
    if (
        pathname === "/login" ||
        pathname === "/register"
    ) {
        return NextResponse.next();
    }

    // Token නැත්නම් login වෙත යැවීම
    if (
        !token &&
        (
            pathname.startsWith("/admin") ||
            pathname.startsWith("/student")
        )
    ) {
        return NextResponse.redirect(
            new URL(
                "/login",
                request.url
            )
        );
    }

    if (user) {
        try {
            const userData = JSON.parse(user);
            const role = userData.role;

            // Admin protection
            if (
                pathname.startsWith("/admin") &&
                role !== "ADMIN"
            ) {
                return NextResponse.redirect(
                    new URL(
                        "/student/dashboard",
                        request.url
                    )
                );
            }

            // Student protection
            if (
                pathname.startsWith("/student") &&
                role !== "STUDENT"
            ) {
                return NextResponse.redirect(
                    new URL(
                        "/admin/dashboard",
                        request.url
                    )
                );
            }
        } catch (error) {
            // Cookie එක JSON parse කිරීමේදී error එකක් ආවොත් login වෙත redirect කිරීම ආරක්ෂිතයි
            return NextResponse.redirect(
                new URL("/login", request.url)
            );
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: [
        "/admin/:path*",
        "/student/:path*",
    ],
};