import { getServerSession } from "next-auth";
import { authOptions } from "@/lib/authOptions";
import prisma from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      return NextResponse.json({ orders: [] }, { status: 401 });
    }

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      return NextResponse.json({ orders: [] }, { status: 404 });
    }

    // Fetch all orders for this user (newest first)
    const orders = await prisma.order.findMany({
      where: { userId: user.id },
      orderBy: { createdAt: "desc" },
    });

    return NextResponse.json({ orders });
  } catch (err: any) {
    console.error("Order fetch error:", err);
    return NextResponse.json({ orders: [] }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    // Auth check
    const session = await getServerSession(authOptions);
    if (!session?.user?.email) {
      console.warn("Not authenticated!");
      return NextResponse.json({ error: "Not authenticated" }, { status: 401 });
    }

    // Parse data
    const data = await request.json();

    // Get user
    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });
    if (!user) {
      console.warn("User not found for email:", session.user.email);
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }

    // Prepare and save order
    const {
      fullName,
      email,
      phone,
      altPhone,
      address1,
      address2,
      landmark,
      city,
      state,
      pincode,
      country,
      deliveryTime,
      specialInstructions,
      giftMessage,
      promoCode,
      personalize,
      size,
      quantity,
    } = data;

    // If your model has more required fields, check here and log if missing
    if (
      !fullName ||
      !email ||
      !phone ||
      !address1 ||
      !city ||
      !state ||
      !pincode ||
      !size ||
      !quantity
    ) {
      console.warn("Missing required order fields:", data);
      return NextResponse.json(
        { error: "Missing required fields." },
        { status: 400 }
      );
    }

    // Save order (add additional fields as per your Prisma model)
    const order = await prisma.order.create({
      data: {
        userId: user.id,
        size,
        quantity: Number(quantity),
        personalize,
        fullName,
        phone,
        email,
        address1,
        address2,
        city,
        state,
        pincode,
        country,
        deliveryTime,
        specialInstructions,
        giftMessage,
      },
    });

    return NextResponse.json({ order });
  } catch (err: any) {
    console.error("Order creation error:", err);
    return NextResponse.json(
      { error: err.message || "Internal server error" },
      { status: 500 }
    );
  }
}
