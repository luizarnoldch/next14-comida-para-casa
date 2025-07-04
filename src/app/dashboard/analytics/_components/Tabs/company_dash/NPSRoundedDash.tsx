"use client"
import React, { use, useState, ChangeEvent } from 'react'
import CircularDash from '@/components/dashes/CircularDash'
import { ComentarioMetadata } from "@/types/network"

export interface PopularTopicsProps {
  data: Promise<ComentarioMetadata[]>
}

// Fields to filter by with friendly English labels
const FILTER_FIELDS: { key: keyof ComentarioMetadata; label: string }[] = [
  { key: "experiencia_cliente(descripcion_corta)", label: "Customer Experience" },
  { key: "percepcion_de_confianza(descripcion_corta)", label: "Customer Trust" },
  { key: "intencion_de_compra(descripcion_corta)", label: "Purchase Intention" },
]

const NPSRoundedDash: React.FC<PopularTopicsProps> = ({ data }) => {
  const analysis: ComentarioMetadata[] = use(data)

  if (!analysis || analysis.length === 0) {
    return <div>No data available to display.</div>
  }

  // Initially select the first filter from FILTER_FIELDS
  const [selectedField, setSelectedField] = useState<keyof ComentarioMetadata>(FILTER_FIELDS[0].key)

  const handleFieldChange = (e: ChangeEvent<HTMLSelectElement>) => {
    setSelectedField(e.target.value as keyof ComentarioMetadata)
  }

  return (
    <div className="space-y-4 flex flex-col h-full">
      <label className="flex items-center gap-2">
        <span>Field:</span>
        <select
          value={selectedField as string}
          onChange={handleFieldChange}
          className="ml-2 p-1 border rounded"
        >
          {FILTER_FIELDS.map(({ key, label }) => (
            <option key={key as string} value={key as string}>
              {label}
            </option>
          ))}
        </select>
      </label>
      <div className="flex-grow min-h-0">
        <CircularDash
          data={analysis}
          field={selectedField}
          title={`${FILTER_FIELDS.find(f => f.key === selectedField)?.label ?? selectedField}`}
        />
      </div>
    </div>
  )
}

export default NPSRoundedDash