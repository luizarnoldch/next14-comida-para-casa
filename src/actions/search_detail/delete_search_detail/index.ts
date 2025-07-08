"use server";
import prisma from "@/lib/prisma";

export async function deleteSearchDetailById(id_detail: string): Promise<void> {
  await prisma.search_detail.delete({
    where: { id_detail },
  });
}
