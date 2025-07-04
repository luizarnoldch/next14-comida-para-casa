function EmbeddedChart({ type }: { type: string }) {
  // In a real application, this would be an embedded BI dashboard
  // For this demo, we'll just show a placeholder
  return (
    <div className="flex h-full w-full flex-col items-center justify-center rounded-md border border-dashed p-8 text-center">
      <div className="text-2xl font-semibold text-muted-foreground">
        {type.charAt(0).toUpperCase() + type.slice(1)} Chart
      </div>
      <p className="mt-2 text-sm text-muted-foreground">This is where your embedded BI dashboard would appear</p>
      <p className="mt-4 text-xs text-muted-foreground">(e.g., Amazon QuickSight, Power BI, Tableau, etc.)</p>
    </div>
  )
}

export default EmbeddedChart