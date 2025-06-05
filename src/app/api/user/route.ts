import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) return NextResponse.json({ user: null });
  const user = await prisma.user.findUnique({
    where: { email: session.user.email },
    include: { orders: true },
  });
  return NextResponse.json({ user });
}
