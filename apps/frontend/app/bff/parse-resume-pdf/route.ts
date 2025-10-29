import { NextResponse } from "next/server";

import { client, serializeFormData } from "@/shared/api";

export const config = {
  api: {
    bodyParser: false,
  },
};

export const maxDuration = 300;

export async function POST(req: Request) {
  const formData = await req.formData();
  const file = formData.get("file") as File;

  if (!file) {
    return NextResponse.json({ message: "No file uploaded" }, { status: 400 });
  }

  const { data, error, response } = await client.POST("/resumes/parse/pdf", {
    body: { file: file as unknown as string },
    bodySerializer: serializeFormData,
  });

  if (error || !data) {
    return NextResponse.json({
      data: null,
      error,
      status: response.status,
    });
  }

  return NextResponse.json({
    data,
    error: null,
    status: response.status,
  });
}
