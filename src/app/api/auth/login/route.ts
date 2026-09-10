import { NextResponse } from "next/server";
import { db } from "@/lib/db";
import { hashPassword, setSessionCookie, verifyPassword } from "@/lib/auth";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { email, password } = body;

    if (!email || !password) {
      return NextResponse.json(
        { error: "Email and password are required" },
        { status: 400 }
      );
    }

    const cleanEmail = email.toLowerCase().trim();

    let user = await db.user.findUnique({
      where: { email: cleanEmail },
    });

    // Auto-seed admin user if admin logs in for the first time
    if (!user && cleanEmail === "admin@adielas.com" && password === "admin123") {
      user = await db.user.create({
        data: {
          name: "Adielas Admin",
          email: "admin@adielas.com",
          password: hashPassword("admin123"),
          role: "ADMIN",
          phone: "9845379428",
          address: "Adielas HQ, Indiranagar",
          city: "Bengaluru",
          pincode: "560038",
        },
      });
    }

    if (!user) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const valid = verifyPassword(password, user.password);
    if (!valid) {
      return NextResponse.json(
        { error: "Invalid email or password" },
        { status: 401 }
      );
    }

    const sessionUser = {
      id: user.id,
      name: user.name,
      email: user.email,
      role: user.role as "CUSTOMER" | "ADMIN",
      phone: user.phone,
      address: user.address,
      city: user.city,
      pincode: user.pincode,
    };

    await setSessionCookie(sessionUser);

    return NextResponse.json({
      success: true,
      user: sessionUser,
    });
  } catch (error: any) {
    console.error("Login error:", error);
    return NextResponse.json(
      { error: error?.message || "Login failed" },
      { status: 500 }
    );
  }
}
