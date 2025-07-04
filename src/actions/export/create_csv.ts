"use server";

import prisma from "@/lib/prisma";
import { Prisma } from "@prisma/client";

// Define the shape of your query result
export interface QueryResult {
  id_job: string;
  category: string;
  kw_main: string;
  kw_type: string;
  id_comment: number;
  comment_date: Date;
  user_comment: string;
  comment: string;
  refined_es: string;
  translated_en: string;
  admiration: number;
  annoyance: number;
  approval: number;
  concern: number;
  disapproval: number;
  empathy: number;
  excitement: number;
  neutral: number;
  optimism: number;
  surprise: number;
  analisis_nps: string;
  tipo_de_comentario_descripcion: string;
  tipo_de_comentario_descripcion_corta: string;
  experiencia_cliente_descripcion: string;
  experiencia_cliente_descripcion_corta: string;
  percepcion_de_confianza_descripcion: string;
  percepcion_de_confianza_descripcion_corta: string;
  identificacion_con_valores_descripcion: string;
  identificacion_con_valores_descripcion_corta: string;
  categorias_de_interes_descripcion: string;
  categorias_de_interes_descripcion_corta: string;
  intencion_de_compra_descripcion: string;
  intencion_de_compra_descripcion_corta: string;
  comparaciones_con_competidores_descripcion: string;
  comparaciones_con_competidores_descripcion_corta: string;
  elemento_persuasivo_descripcion: string;
  elemento_persuasivo_descripcion_corta: string;
  tema_conversacion_descripcion: string;
  tema_conversacion_descripcion_corta: string;
  conclusion_descripcion: string;
  conclusion_descripcion_corta: string;
}

export async function exportQueryData(
  _previousCsv: string | null,
  formData: FormData
): Promise<string> {
  // 1) Extraer el id_job del FormData
  const id_job = formData.get("id_job");
  if (typeof id_job !== "string") {
    throw new Error("El `id_job` es requerido");
  }

  // 2) Ejecutar la consulta SQL como raw query con prisma.$queryRaw
  const detalles = await prisma.$queryRaw<QueryResult[]>`
      SELECT 
        a.id_job,
        a.category,
        b.kw_main,
        b.kw_type,
        d.id_comment,
        d.date::date AS comment_date,
        d.user_comment,
        d.comment,
        e.metadata::json->>'refined_es' AS refined_es,
        e.metadata::json->>'translated_en' AS translated_en,
        (e.metadata::json->>'admiration')::float AS admiration,
        (e.metadata::json->>'annoyance')::float AS annoyance,
        (e.metadata::json->>'approval')::float AS approval,
        (e.metadata::json->>'concern')::float AS concern,
        (e.metadata::json->>'disapproval')::float AS disapproval,
        (e.metadata::json->>'empathy')::float AS empathy,
        (e.metadata::json->>'excitement')::float AS excitement,
        (e.metadata::json->>'neutral')::float AS neutral,
        (e.metadata::json->>'optimism')::float AS optimism,
        (e.metadata::json->>'surprise')::float AS surprise,
        e.metadata::json->>'analisis_nps' AS analisis_nps,
        e.metadata::json->>'tipo_de_comentario_descripcion' AS tipo_de_comentario_descripcion,
        e.metadata::json->>'tipo_de_comentario_descripcion_corta' AS tipo_de_comentario_descripcion_corta,
        e.metadata::json->>'experiencia_cliente_descripcion' AS experiencia_cliente_descripcion,
        e.metadata::json->>'experiencia_cliente_descripcion_corta' AS experiencia_cliente_descripcion_corta,
        e.metadata::json->>'percepcion_de_confianza_descripcion' AS percepcion_de_confianza_descripcion,
        e.metadata::json->>'percepcion_de_confianza_descripcion_corta' AS percepcion_de_confianza_descripcion_corta,
        e.metadata::json->>'identificacion_con_valores_descripcion' AS identificacion_con_valores_descripcion,
        e.metadata::json->>'identificacion_con_valores_descripcion_corta' AS identificacion_con_valores_descripcion_corta,
        e.metadata::json->>'categorias_de_interes_descripcion' AS categorias_de_interes_descripcion,
        e.metadata::json->>'categorias_de_interes_descripcion_corta' AS categorias_de_interes_descripcion_corta,
        e.metadata::json->>'intencion_de_compra_descripcion' AS intencion_de_compra_descripcion,
        e.metadata::json->>'intencion_de_compra_descripcion_corta' AS intencion_de_compra_descripcion_corta,
        e.metadata::json->>'comparaciones_con_competidores_descripcion' AS comparaciones_con_competidores_descripcion,
        e.metadata::json->>'comparaciones_con_competidores_descripcion_corta' AS comparaciones_con_competidores_descripcion_corta,
        e.metadata::json->>'elemento_persuasivo_descripcion' AS elemento_persuasivo_descripcion,
        e.metadata::json->>'elemento_persuasivo_descripcion_corta' AS elemento_persuasivo_descripcion_corta,
        e.metadata::json->>'tema_conversacion_descripcion' AS tema_conversacion_descripcion,
        e.metadata::json->>'tema_conversacion_descripcion_corta' AS tema_conversacion_descripcion_corta,
        e.metadata::json->>'conclusion_descripcion' AS conclusion_descripcion,
        e.metadata::json->>'conclusion_descripcion_corta' AS conclusion_descripcion_corta
      FROM search_master a 
        LEFT JOIN search_detail b ON a.id_job = b.id_job
        LEFT JOIN search_post_source c ON b.id_detail = c.search_detail_id
        LEFT JOIN extracted_comments d ON c.id = d.search_post_source_id
        LEFT JOIN analyzed_comments e ON e.id_comment = d.id_comment
      WHERE a.id_job = ${id_job}
    `;

  // 3) Función auxiliar para escapar comas, comillas y saltos de línea
  const escapeCsv = (value: any) => {
    if (value == null) return "";
    const str = String(value);
    if (/[",\r\n]/.test(str)) {
      return `"${str.replace(/"/g, '""')}"`;
    }
    return str;
  };

  // 4) Definir el encabezado según los alias de la consulta
  const headers = [
    "id_job",
    "category",
    "kw_main",
    "kw_type",
    "id_comment",
    "comment_date",
    "user_comment",
    "comment",
    "refined_es",
    "translated_en",
    "admiration",
    "annoyance",
    "approval",
    "concern",
    "disapproval",
    "empathy",
    "excitement",
    "neutral",
    "optimism",
    "surprise",
    "analisis_nps",
    "tipo_de_comentario_descripcion",
    "tipo_de_comentario_descripcion_corta",
    "experiencia_cliente_descripcion",
    "experiencia_cliente_descripcion_corta",
    "percepcion_de_confianza_descripcion",
    "percepcion_de_confianza_descripcion_corta",
    "identificacion_con_valores_descripcion",
    "identificacion_con_valores_descripcion_corta",
    "categorias_de_interes_descripcion",
    "categorias_de_interes_descripcion_corta",
    "intencion_de_compra_descripcion",
    "intencion_de_compra_descripcion_corta",
    "comparaciones_con_competidores_descripcion",
    "comparaciones_con_competidores_descripcion_corta",
    "elemento_persuasivo_descripcion",
    "elemento_persuasivo_descripcion_corta",
    "tema_conversacion_descripcion",
    "tema_conversacion_descripcion_corta",
    "conclusion_descripcion",
    "conclusion_descripcion_corta",
  ] as const;

  // 5) Construir el CSV completo (encabezado + filas)
  let csv = headers.join(",") + "\r\n";
  detalles.forEach((fila) => {
    const row = headers.map((key) => escapeCsv(fila[key])).join(",");
    csv += row + "\r\n";
  });

  // 6) Devolver el CSV como string
  return csv;
}
