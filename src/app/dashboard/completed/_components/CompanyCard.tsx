"use client";
import Link from "next/link";
import { Download, Share2 } from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import ExportButton from "./ExportButton";

interface CompanyCardProps {
  empresa: string;
  category: string;
  stats: {
    totalLinks: number;
    facebook: number;
    instagram: number;
    tiktok: number;
    other: number;
  };
  id_job: string;
  competitors: { c_id_job: string; name: string }[];
}

export default function CompanyCard({
  empresa,
  stats,
  id_job,
  competitors,
  category
}: CompanyCardProps) {
  function getSentimentColor(sentiment: string) {
    switch (sentiment) {
      case "Political Campaign":
        return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
      case "Negative":
        return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
      case "Company":
        return "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300";
      default:
        return "bg-gray-100 text-gray-800 dark:bg-gray-800 dark:text-gray-300";
    }
  }

  const platformsList: string[] = [];
  if (stats.tiktok > 0) platformsList.push("TikTok");
  if (stats.instagram > 0) platformsList.push("Instagram");
  if (stats.facebook > 0) platformsList.push("Facebook");
  if (stats.other > 0) platformsList.push("Other");

  return (
    <Card>
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-lg">{empresa}</CardTitle>
          <Badge
            variant="outline"
            className={`flex items-center gap-1 ${getSentimentColor(
              category
            )}`}
          >
            {category}
          </Badge>
        </div>
        <CardDescription>{stats.totalLinks} total links found</CardDescription>
      </CardHeader>

      <CardContent>
        {/* Estadísticas generales */}
        <div className="mb-4 space-y-2">
          <div className="flex justify-between text-sm">
            <span>Platforms:</span>
            <span>{platformsList.join(", ") || "N/A"}</span>
          </div>
          <div className="flex justify-between text-sm">
            <span>Links analyzed:</span>
            <span>{stats.totalLinks}</span>
          </div>
        </div>

        {/* Lista de competidores (si los hay) */}
        {competitors.length > 0 && (
          <div className="mb-4">
            <span className="block font-semibold text-sm">Competitors:</span>
            <ul className="ml-4 list-disc text-sm">
              {competitors.map((c) => (
                <li key={c.name}>{c.name}</li>
              ))}
            </ul>
          </div>
        )}

        {/* Botones de acción */}
        <div className="flex flex-wrap gap-2 items-center">
          <Button size="sm" variant="default" asChild>
            <Link href={`/dashboard/completed/sentiment/${encodeURIComponent(id_job)}/${encodeURIComponent(category)}`}>
              Sentiment Analysis
            </Link>
          </Button>

          <ExportButton id_job={id_job} />
          <Button size="sm" variant="outline" onClick={() => alert("Share Completed")}>
            <Share2 className="mr-1 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
