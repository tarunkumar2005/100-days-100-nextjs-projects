import { NextRequest, NextResponse } from "next/server";
import axios from "axios";

export async function GET(req: NextRequest) {
  const category = req.nextUrl.searchParams.get("category");

  console.log(category);

  try {
    if (category != "random") {
    const response = await axios.get(`https://api.api-ninjas.com/v1/quotes?category=${category}`, {
      headers: {
        "X-Api-Key": process.env.API_NINJAS_API_KEY,
    }
    });
    const quoteWithId = {
      ...response.data[0],
      id: new Date().toISOString(),
    };
    return NextResponse.json(quoteWithId);
  } else {
    const response = await axios.get("https://api.api-ninjas.com/v1/quotes", {
      headers: {
        "X-Api-Key": process.env.API_NINJAS_API_KEY,
    }
    });
    const quoteWithId = {
      ...response.data[0],
      id: new Date().toISOString(),
    };
    return NextResponse.json(quoteWithId);
  }
  } catch (error) {
    console.log(error);
    return NextResponse.error();
  }
};