"use server";

import prisma from "@/lib/prisma";

export const getAllSearchs = async () => {
  const data = await prisma.search_master.findFirst();
  return data;
};
