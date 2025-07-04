"use server";
// server/analytics.ts
import prisma from "@/lib/prisma";
import { EmpresaSummary, SocialStats } from "@/types/SeachDetails";

export async function getCommentsByCompanyAndDate(
  empresa: string,
  from: string,
  to: string
) {
  const results = await prisma.extracted_comments.findMany({
    where: {
      search_post_source: {
        search_detail: {
          kw_main: empresa,
        },
      },
      date: {
        gte: new Date(from),
        lte: new Date(to),
      },
    },
    select: {
      analyzed_comments: {
        select: {
          metadata: true,
        },
      },
    },
  });

  // Extraemos solo los metadata, filtrando los que son null
  const analyzedComments = results
    .map((r) => r.analyzed_comments?.metadata) // accedemos directo a metadata
    .filter((metadata) => metadata !== null && metadata !== undefined);

  return analyzedComments;
}

function getSocialPlatform(
  url: string
): "facebook" | "instagram" | "tiktok" | "other" {
  const lower = url.toLowerCase();
  if (lower.includes("facebook.com")) return "facebook";
  if (lower.includes("instagram.com")) return "instagram";
  if (lower.includes("tiktok.com")) return "tiktok";
  return "other";
}

export interface AnalisisSummary {
  id_job: string;
  principal: string;
  competidores: string[];
  category: string;
  counters: {
    totalVideos: number;
    redSocial: {
      facebook: number;
      instagram: number;
      tiktok: number;
      other: number;
    };
  };
}

// export async function getAllEmpresasWithSummary(): Promise<AnalisisSummary[]> {
//   // 1) Obtener todos los id_job únicos de search_detail
//   const jobsRaw = await prisma.search_detail.findMany({
//     distinct: ["id_job"],
//     select: {
//       id_job: true,
//     },
//   });
//   // jobsRaw = [ { id_job: "job1" }, { id_job: "job2" }, ... ]

//   const resultado: AnalisisSummary[] = [];

//   // 2) Recorro cada id_job exactamente una vez
//   for (const { id_job } of jobsRaw) {
//     // 2.1) Traer TODOS los detalles de search_detail para ese id_job,
//     //      necesitamos el kw_main y kw_type
//     const detalles = await prisma.search_detail.findMany({
//       where: { id_job },
//       select: {
//         kw_main: true,
//         kw_type: true,
//         search_post_sources: {
//           select: {
//             url: true,
//           },
//         },
//       },
//     });

//     // 2.2) Inicializar las estructuras de datos:
//     let principalKw = ""; // Será el único kw_main que kw_type = "principal"
//     const setCompetidores = new Set<string>(); // Para evitar duplicados
//     // Contadores por red social
//     let facebookCount = 0;
//     let instagramCount = 0;
//     let tiktokCount = 0;
//     let otherCount = 0;

//     // 2.3) Iterar todos los detalles para poblar "principal", "competidores" y contadores
//     for (const detalle of detalles) {
//       if (detalle.kw_type === "principal") {
//         if (!principalKw) {
//           principalKw = detalle.kw_main;
//         }
//       } else if (detalle.kw_type?.startsWith("competitor")) {
//         setCompetidores.add(detalle.kw_main);
//       }

//       for (const source of detalle.search_post_sources) {
//         // 2.3.1) Detectar red social
//         const plataforma = getSocialPlatform(source.url);
//         switch (plataforma) {
//           case "facebook":
//             facebookCount++;
//             break;
//           case "instagram":
//             instagramCount++;
//             break;
//           case "tiktok":
//             tiktokCount++;
//             break;
//           default:
//             otherCount++;
//             break;
//         }
//       }
//     }

//     // 2.4) Convertimos el Set de competidores a arreglo
//     const competidoresArr = Array.from(setCompetidores);

//     // 2.5) Armar el objeto final para este id_job
//     const summary: AnalisisSummary = {
//       id_job,
//       principal: principalKw,
//       competidores: competidoresArr,
//       counters: {
//         totalVideos: facebookCount + instagramCount + tiktokCount + otherCount,
//         redSocial: {
//           facebook: facebookCount,
//           instagram: instagramCount,
//           tiktok: tiktokCount,
//           other: otherCount,
//         },
//       },
//     };

//     resultado.push(summary);
//   }

//   return resultado;
// }

export async function getAllCompany(): Promise<AnalisisSummary[]> {
  // 1) Traigo todos los jobs incluyendo sus detalles y fuentes de posteo
  const masters = await prisma.search_master.findMany({
    include: {
      search_detail: {
        select: {
          kw_main: true,
          kw_type: true,
          search_post_source: {
            // Correct: singular as per your schema
            select: { url: true },
          },
        },
      },
    },
  });

  // 2) Mappeo a la estructura AnalisisSummary
  const resumen: AnalisisSummary[] = masters.map((master) => {
    let principalKw = master.name_job ?? "";
    let category = master.category ?? "";
    const setCompetidores = new Set<string>();
    let facebookCount = 0;
    let instagramCount = 0;
    let tiktokCount = 0;
    let otherCount = 0;

    for (const detalle of master.search_detail) {
      // principal vs competidores
      if (detalle.kw_type === "principal" && !principalKw) {
        // principalKw = detalle.kw_main;
        setCompetidores.add(detalle.kw_main);
      } else if (detalle.kw_type?.startsWith("competitor")) {
        setCompetidores.add(detalle.kw_main);
      }

      // cuento las URLs por red social
      for (const src of detalle.search_post_source) {
        switch (getSocialPlatform(src.url)) {
          case "facebook":
            facebookCount++;
            break;
          case "instagram":
            instagramCount++;
            break;
          case "tiktok":
            tiktokCount++;
            break;
          default:
            otherCount++;
        }
      }
    }

    const competidoresArr = Array.from(setCompetidores);
    const total = facebookCount + instagramCount + tiktokCount + otherCount;

    return {
      id_job: master.id_job,
      principal: principalKw,
      category: category,
      competidores: competidoresArr,
      counters: {
        totalVideos: total,
        redSocial: {
          facebook: facebookCount,
          instagram: instagramCount,
          tiktok: tiktokCount,
          other: otherCount,
        },
      },
    };
  });

  return resumen;
}

export async function getSearchDetailSummaryByCompany(
  empresa: string
): Promise<SocialStats> {
  const postSources = await prisma.search_post_source.findMany({
    where: {
      search_detail: {
        kw_main: empresa,
      },
    },
    select: {
      url: true,
      description: true,
      search_detail: {
        select: {
          id_detail: true,
          id_job: true,
        },
      },
    },
  });

  const stats: SocialStats = {
    totalLinks: postSources.length,
    tiktok: 0,
    instagram: 0,
    facebook: 0,
    other: 0,
    details: [],
  };
  for (const source of postSources) {
    const platform = getSocialPlatform(source.url);
    switch (platform) {
      case "tiktok":
        stats.tiktok++;
        break;
      case "instagram":
        stats.instagram++;
        break;
      case "facebook":
        stats.facebook++;
        break;
      default:
        stats.other++;
        break;
    }
    stats.details.push({
      id_detail: source.search_detail.id_detail,
      url: source.url,
      socialPlatform: platform,
      manual_description: source.description ?? undefined,
      id_job: source.search_detail.id_job,
    });
  }
  return stats;
}
