'use client';

import React from 'react';
import { useNewAnalysisFormStore, SearchDetail } from '@/store/newAnalysisFormStore';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Badge } from '@/components/ui/badge';
import { toast } from 'sonner';
import { AnalysisDataPayload, createAnalysisAction } from '@/actions/analytics/create_analysis';

const AnalysisReview = () => {
  const name_job_from_store = useNewAnalysisFormStore((state) => state.name_job);
  const category = useNewAnalysisFormStore((state) => state.category);
  const search_details = useNewAnalysisFormStore((state) => state.search_details);
  const setCurrentUiStep = useNewAnalysisFormStore((state) => state.setCurrentUiStep);
  const resetForm = useNewAnalysisFormStore((state) => state.resetForm);

  const handleActualSubmit = async () => {
    const analysisData: AnalysisDataPayload = {
      name_job: name_job_from_store === null ? '' : name_job_from_store,
      category: category === null ? undefined : category,
      search_details: search_details.map(detail => ({
        id_detail: detail.id_detail,
        kw_main: detail.kw_main,
        kw_secondary: detail.kw_secondary.filter(kw => kw && kw.trim() !== ""),
        search_type: detail.search_type,
        kw_type: detail.kw_type,
        posts_to_analyze: detail.posts_to_analyze.map(post => ({
          url: post.url,
          // Ensure title, network, and text are passed even if undefined, action will handle it
          title: post.ogData?.status === 'success' ? post.ogData.data.title : undefined,
          network: post.social_network,
          text: post.ogData?.status === 'success' ? post.ogData.data.description : undefined,
        })),
      }))
    };

    const toastId = "final-submit-analysis";
    toast.info("Submitting analysis...", { id: toastId });
    console.log("Final Analysis Data Payload for server action:", analysisData);

    try {
      const result = await createAnalysisAction(analysisData);
      if (result.success) {
        toast.success("Analysis created successfully! Comment extraction has been started in the background.", { id: toastId, duration: 6000 });
        console.log("Analysis creation result:", result.data);
        resetForm();
        setCurrentUiStep('initial_setup');
        // router.push('/dashboard/analyses'); // Optional: Navigate
      } else {
        toast.error(result.error || "Failed to submit analysis.", { id: toastId, duration: 8000 });
        console.error("Server action error:", result.error);
      }
    } catch (error) {
      console.error("Error submitting analysis via server action:", error);
      // This catch block handles errors if the server action itself throws an unhandled exception
      // or if there's a network issue preventing the call.
      let errorMessage = "An unexpected error occurred while submitting.";
      if (error instanceof Error) {
        errorMessage = error.message;
      }
      toast.error(errorMessage, { id: toastId, duration: 8000 });
    }
  };

  return (
    <div className="container mx-auto flex flex-col items-center justify-center p-6">
      <Card className="w-full max-w-2xl">
        <CardHeader>
          <CardTitle className="text-2xl">Review Your Analysis Configuration</CardTitle>
          <CardDescription>Please review the details below before starting the analysis.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-2">
            <h3 className="text-lg font-semibold">General Information</h3>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Analysis Name:</span>
              <span>{name_job_from_store || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-muted-foreground">Category:</span>
              <Badge variant="outline">{category || 'Not set'}</Badge>
            </div>
          </div>
          <Separator />
          {search_details.map((detail: SearchDetail, index: number) => (
            <div key={detail.id_detail} className="space-y-3">
              <h3 className="text-lg font-semibold">{detail.label || `Search Detail ${index + 1}`}</h3>
              <div className="ml-4 space-y-1">
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Main Keyword:</span>
                  <span className="truncate max-w-xs">{detail.kw_main || 'Not set'}</span>
                </div>
                <div>
                  <span className="text-muted-foreground">Secondary Keywords:</span>
                  {detail.kw_secondary && detail.kw_secondary.filter(kw => kw.trim() !== "").length > 0 ? (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {detail.kw_secondary.filter(kw => kw.trim() !== "").map((kw, kwIdx) => (
                        <Badge key={kwIdx} variant="secondary">{kw}</Badge>
                      ))}
                    </div>
                  ) : (
                    <span className="ml-2">None</span>
                  )}
                </div>
                <div className="flex justify-between">
                  <span className="text-muted-foreground">Selected Posts:</span>
                  <span>{detail.posts_to_analyze.length} post(s)</span>
                </div>
                {/* Optionally, list selected post titles/URLs here if desired */}
              </div>
              {index < search_details.length - 1 && <Separator className="mt-4" />}
            </div>
          ))}
        </CardContent>
        <CardFooter className="flex justify-end space-x-3">
          <Button variant="outline" onClick={() => setCurrentUiStep('main_config')}>
            Back to Edit
          </Button>
          <Button onClick={handleActualSubmit}>
            Confirm and Start Analysis
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
};

export default AnalysisReview; 
