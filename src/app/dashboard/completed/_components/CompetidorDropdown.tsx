"use client";
import React, { useState } from "react";
import { useRouter } from "next/navigation";
// Uncomment next line if your UI library select is used, else comment it out
// import { Select } from "@/components/ui/select";

interface Competitor {
  c_id_job: string;
  name: string;
}

interface Props {
  id_job: string;
  competitors: Competitor[];
}

export default function CompetitorDropdown({ id_job, competitors }: Props) {
  const router = useRouter();
  const [selected, setSelected] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const cId = e.target.value;
    setSelected(cId);
    if (cId) {
      router.push(
        `/dashboard/completed/${encodeURIComponent(id_job)}/compete/${encodeURIComponent(cId)}`
      );
    }
  };

  return (
    <div>
      <label htmlFor="competitor-select" className="sr-only">
        Select Competitor
      </label>

      {/* Use your UI library Select component if desired */}
      {/* 
      <Select
        id="competitor-select"
        value={selected}
        onChange={handleChange}
      >
        <option value="">Select competitor</option>
        {competitors.map(({ c_id_job, name }) => (
          <option key={c_id_job} value={c_id_job}>
            {name}
          </option>
        ))}
      </Select>
      */}

      {/* Native select fallback / default */}
      <select
        id="competitor-select"
        className="p-1 border rounded text-sm cursor-pointer"
        value={selected}
        onChange={handleChange}
        aria-label="Select competitor"
      >
        <option value="">Select competitor</option>
        {competitors.map(({ c_id_job, name }) => (
          <option key={c_id_job} value={c_id_job}>
            {name}
          </option>
        ))}
      </select>
    </div>
  );
}