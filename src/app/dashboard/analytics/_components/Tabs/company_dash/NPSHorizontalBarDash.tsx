"use client"
import React, { use, useState, ChangeEvent } from 'react'
import { ComentarioMetadata } from "@/types/network"
import HorizontalBarDash from "@/components/dashes/HorizontalBarDash"

export interface TemasPopularesProps {
  data: Promise<ComentarioMetadata[]>
}

// Define the filter fields with friendly English labels
const FILTER_FIELDS: { key: keyof ComentarioMetadata; label: string }[] = [
  { key: "NPS", label: "Customer Interest" },
  { key: "categorias_de_interes(descripcion_corta)", label: "Interest Category" },
  { key: "tipo_de_comentario(descripcion_corta)", label: "Comment Types" },
  { key: "identificacion_con_valores(descripcion_corta)", label: "Identified Values" },
  { key: "comparaciones_con_competidores(descripcion_corta)", label: "Competitor Comparison" },
  { key: "elemento_persuasivo(descripcion_corta)", label: "Persuasive Element" },
  { key: "tema_conversacion(descripcion_corta)", label: "Conversation Topics" },
  { key: "conclusion(descripcion_corta)", label: "Conclusion" },
]

function NPSHorizontalBarDash({ data }: TemasPopularesProps) {
  const analysis: ComentarioMetadata[] = use(data)

  if (!analysis || analysis.length === 0) {
    return <div>No data available to display.</div>
  }

  // Initialize with the first available filter
  const [selectedField, setSelectedField] = useState<keyof ComentarioMetadata>(FILTER_FIELDS[0].key)
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')
  const LIMIT_OPTIONS = [5, 10, 20, 50]
  const [selectedLimit, setSelectedLimit] = useState<number>(LIMIT_OPTIONS[0])

  const handleFieldChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(e.target.value as keyof ComentarioMetadata)
  }
  const handleOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc')
  }
  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLimit(Number(e.target.value))
  }

  return (
    <div className="space-y-4 flex flex-col h-full">
      <div className="flex flex-wrap gap-4">
        <label className="flex items-center gap-2">
          <span>Field:</span>
          <select value={selectedField as string} onChange={handleFieldChange} className="p-1 border rounded">
            {FILTER_FIELDS.map(({ key, label }) => (
              <option key={key as string} value={key as string}>{label}</option>
            ))}
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Order:</span>
          <select value={sortOrder} onChange={handleOrderChange} className="p-1 border rounded">
            <option value="asc">Ascending</option>
            <option value="desc">Descending</option>
          </select>
        </label>
        <label className="flex items-center gap-2">
          <span>Limit:</span>
          <select value={selectedLimit} onChange={handleLimitChange} className="p-1 border rounded">
            {LIMIT_OPTIONS.map(opt => (
              <option key={opt} value={opt}>{opt}</option>
            ))}
          </select>
        </label>
      </div>
      <div className="flex-grow min-h-0">
        <HorizontalBarDash
          data={analysis}
          groupByKey={selectedField}
          title={`${FILTER_FIELDS.find(f => f.key === selectedField)?.label ?? selectedField}`}
          sortOrder={sortOrder}
          limit={selectedLimit}
        />
      </div>
    </div>
  )
}

export default NPSHorizontalBarDash