"use client";

import { useActionState } from "react";
import { Button } from "@/components/ui/button";
import { Download } from "lucide-react";
import React from "react";
import { exportQueryData } from "../../../../actions/export/create_csv";

interface ExportButtonProps {
  id_job: string;
}

export default function ExportButton({ id_job }: ExportButtonProps) {
  // `csvData` contendrá el string CSV cuando el action termine.
  // `exportAction` es la función que React genera para llamar al action.
  const [csvData, exportAction] = useActionState(exportQueryData, null);

  // Cuando `csvData` pase de null → string CSV, generamos un Blob y forzamos la descarga.
  React.useEffect(() => {
    if (csvData) {
      // 1) Crear un Blob con el contenido CSV
      const blob = new Blob([csvData], { type: "text/csv;charset=utf-8;" });
      // 2) Generar URL temporal
      const url = URL.createObjectURL(blob);
      // 3) Crear enlace <a> invisible y hacer click para descargar
      const a = document.createElement("a");
      a.href = url;
      a.download = `export-${id_job}.csv`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      // 4) Liberar URL
      URL.revokeObjectURL(url);
    }
  }, [csvData, id_job]);

  return (
    // 3) El <form> que al hacer submit invoca `exportAction`
    <form>
      {/* Hacemos un input oculto para enviar el id_job al action */}
      <input type="hidden" name="id_job" value={id_job} />
      <Button size="sm" variant="outline" formAction={exportAction}>
        <Download className="mr-1 h-4 w-4" />
        Export
      </Button>
    </form>
  );
}
