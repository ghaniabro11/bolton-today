import { NextResponse } from "next/server";

export async function POST() {
  try {
    const response = NextResponse.json({ 
      message: "Logged out successfully" 
    });
    
    // Clear the cookie properly
    response.cookies.set("authAccess", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      path: "/",
      maxAge: 0, // This expires the cookie immediately
    });
    
    return response;
  } catch (error) {
    console.error("Logout error:", error);
    return NextResponse.json(
      { error: "Logout failed" }, 
      { status: 500 }
    );
  }
}