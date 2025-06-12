import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { eq, or } from "drizzle-orm";
export const dynamic = "force-dynamic";

// GET /api/users - Get all users
export async function GET() {
  try {
    const allUsers = await db.select().from(users);
    return NextResponse.json(allUsers);
  } catch (error) {
    return NextResponse.json(
      { error: `Failed to fetch users:${error}` },
      { status: 500 }
    );
  }
}
// // POST /api/v1/seed - Seed 100 dummy users
// export async function POST() {
//   try {
//     const dummyUsers = [];
//     const roles = ["admin", "editor"] as const;  // Add type assertion
//     const saltRounds = 10;
//     const defaultPassword = await bcrypt.hash("password123", saltRounds);

//     // Generate 100 dummy users
//     for (let i = 1; i <= 100; i++) {
//       dummyUsers.push({
//         username: `user${i}`,
//         email: `user${i}@example.com`,
//         fullname: `User ${i}`,
//         password: defaultPassword,
//         status: true,
//         role: roles[i % 2] as "admin" | "editor",  // Add type assertion
//       });
//     }

//     // Insert all users in a single transaction
//     const insertedUsers = await db.insert(users).values(dummyUsers).returning();

//     return NextResponse.json({
//       message: "Successfully seeded 100 users",
//       count: insertedUsers.length,
//     }, { status: 201 });
//   } catch (error) {
//     return NextResponse.json(
//       { error: `Failed to seed users: ${error}` },
//       { status: 500 }
//     );
//   }
// }

// POST /api/users - Create a new user
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { username, email, fullname, role, password, status } = body;

    // Validate required fields
    if (!username || !email || !fullname || !role || !password || !status) {
      return NextResponse.json(
        { error: "Missing required fields" },
        { status: 400 }
      );
    }

    // Check for unique email and username
    const existingUser = await db
      .select()
      .from(users)
      .where(or(eq(users.email, email), eq(users.username, username)));

    if (existingUser.length > 0) {
      return NextResponse.json(
        { error: "Email or username already exists" },
        { status: 409 }
      );
    }

    // Hash password
    const saltRounds = 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    // Create new user
    const newUser = await db
      .insert(users)
      .values({
        username,
        email,
        fullname,
        role,
        status,
        password: hashedPassword,
        createdAt: new Date(),
      })
      .returning();

    return NextResponse.json(newUser[0], { status: 201 });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to create user" },
      { status: 500 }
    );
  }
}
