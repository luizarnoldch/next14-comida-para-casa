"use server";

import { v4 as uuidv4 } from "uuid";
import prisma from "@/lib/prisma";

export interface PostToAnalyze {
  url: string;
  title?: string;
  network?: string;
  text?: string;
  description?: string; // Possibly add this if you want to support description in posts
  id?: string; // Optional unique id for the post if applicable
}

export interface SearchDetailPayload {
  id_detail: string;
  kw_main: string;
  kw_secondary: string[];
  posts_to_analyze: PostToAnalyze[];
  search_type: "advanced" | "manual"; // restrict to these exactly
  kw_type?: string; // 'main' | 'competitor' | etc. – could add union type if desired
}

export interface AnalysisDataPayload {
  name_job: string; // made required as per your validation
  category?: string;
  search_details: SearchDetailPayload[];
}

export async function createAnalysisAction(
  data: AnalysisDataPayload
): Promise<{ success: boolean; error?: string; data?: any }> {
  console.log("Received data in server action:", JSON.stringify(data, null, 2));

  if (!data.name_job) {
    return { success: false, error: "Analysis name (name_job) is required." };
  }
  // Generate a unique id_job, e.g., using a UUID library or a simpler timestamp for now
  // For production, a robust UUID is recommended.
  const id_job = `job_${Date.now()}_${Math.random()
    .toString(36)
    .substring(2, 9)}`;

  try {
    const now = new Date();
    const result = await prisma.search_master.create({
      data: {
        id_job: id_job,
        name_job: data.name_job,
        category: data.category,
        created_at: now,
        updated_at: now,
      },
    });

    // Loop over each detail and insert properly with nested post creation
    for (const detail of data.search_details) {
      // IMPORTANT: kw_secondary is an array of strings - pass it as an array as expected
      // Also ensure id_detail is unique, or generate it here if not provided

      await prisma.search_detail.create({
        data: {
          id_detail: detail.id_detail,
          id_job: result.id_job,
          kw_main: detail.kw_main,
          kw_secondary: detail.kw_secondary,
          search_type: detail.search_type,
          kw_type: detail.kw_type,
          created_at: now,
          updated_at: now,
          search_post_source: {
            create: detail.posts_to_analyze.map((post) => ({
              id: post.id || uuidv4(), // always pass a string id
              url: post.url,
              description: post.description || null,
              post_metadata: {
                title: post.title,
                network: post.network,
                text: post.text,
                associated_kw_main: detail.kw_main,
                associated_kw_secondary: detail.kw_secondary,
              } as any,
              created_at: now,
              updated_at: now,
            })),
          },
        },
      });
    }

    console.log("Analysis created successfully:", result);

    // Start comment extraction for the created analysis
    try {
      console.log(
        "Starting comment extraction for search master:",
        result.id_job
      );
      const BACKOFFICE_API_URL =
        process.env.BACKOFFICE_API_URL || "https://backoffice-api.deepfeel.xyz";
      const extractionResponse = await fetch(
        `${BACKOFFICE_API_URL}/api/v1/extraction/extract/search-master/${result.id_job}`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
        }
      );

      if (!extractionResponse.ok) {
        console.warn(
          "Failed to start comment extraction:",
          extractionResponse.status,
          extractionResponse.statusText
        );
        // Don't fail the entire operation if extraction fails to start
        // The user can manually trigger extraction later if needed
      } else {
        const extractionResult = await extractionResponse.json();
        console.log(
          "Comment extraction started successfully:",
          extractionResult
        );
      }
    } catch (extractionError) {
      console.warn("Error starting comment extraction:", extractionError);
      // Don't fail the entire operation if extraction fails to start
    }

    return { success: true, data: result };
  } catch (error: any) {
    console.error("Error creating analysis:", error);
    let errorMessage = "Failed to create analysis due to an unexpected error.";

    // Fallback error checking due to type resolution issues
    if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      error.code === "P2002"
    ) {
      const typedError = error as {
        code: string;
        meta?: { target?: string[] };
      };
      errorMessage = `Failed to create analysis: A record with some of the provided unique identifiers already exists. Details: ${typedError.meta?.target?.join(
        ", "
      )}`;
    } else if (
      error &&
      typeof error === "object" &&
      "code" in error &&
      "message" in error
    ) {
      const typedError = error as { code: string; message: string };
      errorMessage = `Failed to create analysis. Database error: ${typedError.code} - ${typedError.message}`;
    } else if (error instanceof Error) {
      errorMessage = error.message;
    }
    return { success: false, error: errorMessage };
  }
}
