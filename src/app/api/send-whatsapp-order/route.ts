import { NextRequest, NextResponse } from "next/server";

// Helper to format WhatsApp message
function buildOrderMessage(data: any) {
  return `*FlipSip Order*
--------------------------
*Name*: ${data.fullName}
*Email*: ${data.email}
*Phone*: ${data.phone}
*Alt Phone*: ${data.altPhone || "None"}
*Address*: ${data.address1}
${data.address2 ? data.address2 + "\n" : ""}${
    data.landmark ? "Landmark: " + data.landmark + "\n" : ""
  }
${data.city}, ${data.state}, ${data.pincode}, ${data.country}
--------------------------
*Delivery Time*: ${data.deliveryTime || "Any"}
*Instructions*: ${data.specialInstructions || "None"}
*Gift Message*: ${data.giftMessage || "None"}
--------------------------
*Bottle Size*: ${data.size}
*Quantity*: ${data.quantity}
*Personalization*: ${data.personalize || "None"}
`;
}

export async function POST(req: NextRequest) {
  try {
    const data = await req.json();
    const raw = process.env.WHATSAPP_ADMIN_NUMBERS;
    const adminNumbers = raw ? raw.split(",").map((n) => n.trim()) : [];

    if (adminNumbers.length === 0) {
      console.error("No admin numbers set!");
      return NextResponse.json(
        { error: "No admin numbers set." },
        { status: 500 }
      );
    }

    const message = buildOrderMessage(data);

    const links = adminNumbers.map((number) => {
      const num = number.startsWith("+") ? number.slice(1) : number;
      return `https://wa.me/${num}?text=${encodeURIComponent(message)}`;
    });

    return NextResponse.json({ links });
  } catch (error) {
    let errorMessage = "Internal server error";
    if (typeof error === "object" && error !== null && "message" in error) {
      errorMessage = (error as { message?: string }).message || errorMessage;
    } else if (typeof error === "string") {
      errorMessage = error;
    }

    return NextResponse.json({ error: errorMessage }, { status: 500 });
  }
}
