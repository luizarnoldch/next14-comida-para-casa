"use server";
import prisma from "@/lib/prisma";

export async function deleteSearchMasterById(id_job: string): Promise<void> {
  await prisma.search_master.delete({
    where: { id_job },
  });
}
