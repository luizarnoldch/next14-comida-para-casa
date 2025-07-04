"use client"

import React, { use, useState, ChangeEvent } from 'react'
import { ComentarioMetadata } from "@/types/network"
import HorizontalBarDash from "@/components/dashes/HorizontalBarDash"

export interface TemasPopularesProps {
  data: Promise<ComentarioMetadata[]>
}

function NPSHorizontalBarDash({ data }: TemasPopularesProps) {
  const analysis: ComentarioMetadata[] = use(data)
  if (!analysis || analysis.length === 0) {
    return <div>No hay datos para mostrar.</div>
  }
  type Field = keyof ComentarioMetadata
  const allFields = Object.keys(analysis[0]) as Field[]

  const [selectedField, setSelectedField] = useState<Field>(allFields[32])
  const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc')

  // Agregamos estado local para limit
  const LIMIT_OPTIONS = [5, 10, 20, 50]
  const [selectedLimit, setSelectedLimit] = useState<number>(LIMIT_OPTIONS[0])

  const handleFieldChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(e.target.value as Field)
  }
  const handleOrderChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSortOrder(e.target.value as 'asc' | 'desc')
  }

  const handleLimitChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedLimit(Number(e.target.value))
  }

  return (
    <div className="space-y-4">
      {/* Dropdown para elegir el campo */}
      <label className="flex items-center gap-2">
        <span>Selecciona un campo:</span>
        <select
          value={selectedField}
          onChange={handleFieldChange}
          className="ml-2 p-1 border rounded"
        >
          {allFields.map((field) => (
            <option key={field} value={field}>
              {field}
            </option>
          ))}
        </select>
      </label>

      {/* Dropdown para elegir el orden */}
      <label className="flex items-center gap-2">
        <span>Orden:</span>
        <select
          value={sortOrder}
          onChange={handleOrderChange}
          className="ml-2 p-1 border rounded"
        >
          <option value="asc">Ascendente</option>
          <option value="desc">Descendente</option>
        </select>
      </label>

      {/* Dropdown para elegir límite */}
      <label className="flex items-center gap-2">
        <span>Límite barras:</span>
        <select
          value={selectedLimit}
          onChange={handleLimitChange}
          className="ml-2 p-1 border rounded"
        >
          {LIMIT_OPTIONS.map((opt) => (
            <option key={opt} value={opt}>
              {opt}
            </option>
          ))}
        </select>
      </label>

      {/* Dash con orden dinámico y límite */}
      <HorizontalBarDash
        data={analysis}
        groupByKey={selectedField}
        title={`Horizontal Bar – ${selectedField}`}
        description={`Visualización agrupada por “${selectedField}” (${sortOrder})`}
        sortOrder={sortOrder}        // asumiendo HorizontalBarDash soporta esta prop
        limit={selectedLimit}        // <-- nuevo prop para limitar barras
      />
    </div>
  )
}

export default NPSHorizontalBarDash
