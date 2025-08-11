import { NextResponse } from "next/server";
import { db } from "@/lib/db/db";
import { users } from "@/lib/db/schema";
import { eq } from "drizzle-orm";
import bcrypt from "bcrypt";

// GET /api/users/[id] - Get a single user
export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  try {
    const user = await db
      .select()
      .from(users)
      .where(eq(users.email, id))
      .limit(1);

    if (!user.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(user[0]);
  } catch (error) {
    console.error("GET /users/[id] error:", error);
    return NextResponse.json(
      { error: "Internal Server Error" },
      { status: 500 }
    );
  }
}

// PUT /api/users/[id] - Update a user
export async function PUT(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const {
      username,
      fullname,
      email,
      status,
      role,
      newPassword,
      currentPassword,
    } = await request.json();

    if (!username && !fullname && status === undefined && !role) {
      return NextResponse.json(
        { error: "No fields provided" },
        { status: 400 }
      );
    }

    // Validate the existing password if a new password is provided
    if (newPassword) {
      // Password length check
      if (newPassword.length < 6) {
        return NextResponse.json(
          { message: "Password must be at least 6 characters long" },
          { status: 400 }
        );
      }

      // Fetch the user record to compare the current password
      const user = await db
        .select()
        .from(users)
        .where(eq(users.id, Number(id)))
        .limit(1);

      if (user.length === 0) {
        return NextResponse.json(
          { message: "User not found" },
          { status: 404 }
        );
      }

      const isPasswordValid = await bcrypt.compare(
        currentPassword,
        user[0].password
      );
      if (!isPasswordValid) {
        return NextResponse.json(
          { message: "Current password is incorrect" },
          { status: 400 }
        );
      }

      // Hash the new password
      const saltRounds = 10;
      const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

      // Update the password
      await db
        .update(users)
        .set({ password: hashedPassword })
        .where(eq(users.id, Number(id)));
    }

    // Update other user fields
    const updatedUser = await db
      .update(users)
      .set({ username, fullname, status, role, email })
      .where(eq(users.id, Number(id)))
      .returning();

    if (!updatedUser.length) {
      return NextResponse.json({ message: "User not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "User updated successfully" });
  } catch (error) {
    console.error(error);
    return NextResponse.json(
      { error: "Failed to update user" },
      { status: 500 }
    );
  }
}


// DELETE /api/users/[id] - Delete a user
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;

  try {
    const deletedUser = await db
      .delete(users)
      .where(eq(users.id, Number(id)))
      .returning();

    if (!deletedUser.length) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    return NextResponse.json(
      { message: "User deleted successfully" },
      { status: 200 }
    );
  } catch (error) {
    console.error("DELETE /users/[id] error:", error);

    return NextResponse.json(
      { error: "Failed to delete user" },
      { status: 500 }
    );
  }
}
