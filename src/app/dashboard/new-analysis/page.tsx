'use client';

import React, { useEffect, useState } from 'react';
import { 
    useNewAnalysisFormStore, 
    AnalysisCategory, 
    SearchDetail // Import SearchDetail if needed for explicit typing, though often inferred
} from "@/store/newAnalysisFormStore";
// import { useAnalysisStore } from "@/store/analysisStore"; // REMOVE THIS

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "sonner";

import PostGroups from "./_components/VideoBanner/PostGroups";
import KeywordInputForm from "./_components/KeywordBanner/KeywordInputForm";
import AnalysisReview from "./_components/AnalysisReview";

// Placeholder for the actual server action
// import { createAnalysis } from "@/actions/analysis/create_analysis"; 

const CATEGORIES: AnalysisCategory[] = ["Company", "Political Campaign", "Content Creator"];
const EMPTY_ARRAY: any[] = []; // Stable reference for default array

const NewAnalysisPage = () => {
  // Select primitive values and stable arrays directly
  const name_job = useNewAnalysisFormStore((state) => state.name_job);
  const category = useNewAnalysisFormStore((state) => state.category);
  const current_ui_step = useNewAnalysisFormStore((state) => state.current_ui_step);
  const search_details = useNewAnalysisFormStore((state) => state.search_details);
  const active_search_detail_idx = useNewAnalysisFormStore((state) => state.active_search_detail_idx);
  const currentActiveFetchedPosts = useNewAnalysisFormStore((state) => state.currentActiveFetchedPosts);

  // Selector for derived data, ensuring stable reference for default
  const selectedPostsForActiveDetail = useNewAnalysisFormStore((state) => 
    state.search_details[state.active_search_detail_idx]?.posts_to_analyze || EMPTY_ARRAY
  );

  // Select actions (they are stable)
  const setNameJob = useNewAnalysisFormStore((state) => state.setNameJob);
  const setCategory = useNewAnalysisFormStore((state) => state.setCategory);
  const setCurrentUiStep = useNewAnalysisFormStore((state) => state.setCurrentUiStep);
  const initializeFirstSearchDetail = useNewAnalysisFormStore((state) => state.initializeFirstSearchDetail);
  const addCompetitorSearchDetail = useNewAnalysisFormStore((state) => state.addCompetitorSearchDetail);
  const removeSearchDetail = useNewAnalysisFormStore((state) => state.removeSearchDetail);
  const setActiveSearchDetailIdx = useNewAnalysisFormStore((state) => state.setActiveSearchDetailIdx);
  const updateSearchDetail = useNewAnalysisFormStore((state) => state.updateSearchDetail);
  // const setPostsForSearchDetail = useNewAnalysisFormStore((state) => state.setPostsForSearchDetail); // Not directly used in page render logic
  const resetForm = useNewAnalysisFormStore((state) => state.resetForm);
  const loadFetchedPostsForActiveDetail = useNewAnalysisFormStore((state) => state.loadFetchedPostsForActiveDetail);
  // clearSelectedPostsForActiveDetail and clearCurrentActiveFetchedPosts are not called directly from page, but passed to children or used in handlers not shown

  const [localAnalysisName, setLocalAnalysisName] = useState("");
  const [localCategory, setLocalCategory] = useState<AnalysisCategory>(null);

  useEffect(() => {
    return () => {
      resetForm();
      // No need to clear from old analysisStore as it's removed
    };
  }, [resetForm]);

  // Effect to load fetched posts for the active tab when it changes or on initial load of main_config.
  useEffect(() => {
    if (current_ui_step === 'main_config' && search_details.length > 0 && search_details[active_search_detail_idx]) {
      loadFetchedPostsForActiveDetail();
    }
    // Adding search_details.length as a dependency to ensure this runs if a detail is added/removed making the active index valid/invalid
  }, [active_search_detail_idx, current_ui_step, loadFetchedPostsForActiveDetail, search_details.length]);

  const handleNextToMainConfig = () => {
    if (!localAnalysisName.trim()) {
      toast.error("Please enter an analysis name."); return;
    }
    if (!localCategory) {
      toast.error("Please select a category."); return;
    }
    setNameJob(localAnalysisName.trim());
    initializeFirstSearchDetail(localCategory);
    setCurrentUiStep('main_config');
  };

  const handleCategoryChange = (newCategory: AnalysisCategory) => {
    setLocalCategory(newCategory);
    if (current_ui_step === 'main_config') {
        setCategory(newCategory);
    }
  };

  const onTabChange = (tabValue: string) => {
    const newIdx = parseInt(tabValue, 10);
    setActiveSearchDetailIdx(newIdx);
  };
  
  const currentActiveSearchDetail = search_details[active_search_detail_idx] as SearchDetail | undefined;
  const canAddMoreDetails = search_details.length < 3;

  const handleAddDetailTab = () => {
    if (category && canAddMoreDetails) {
      addCompetitorSearchDetail(category);
    } else if (!category) {
      toast.error("Please ensure a category is selected before adding a new detail.");
    } else {
      toast.info("Maximum number of analysis details reached (3).");
    }
  };

  const isAnalysisDataComplete = () => {
    if (!name_job || !category || search_details.length === 0) {
      return false;
    }
    return search_details.every(detail => {
      const hasSelectedPosts = detail.posts_to_analyze.length > 0;
      
      if (detail.search_type === 'manual') {
        // For manual mode, we only need posts and a kw_main (which can be minimal)
        const hasKwMain = detail.kw_main && detail.kw_main.trim() !== "";
        return hasKwMain && hasSelectedPosts;
      } else {
        // For advanced search mode, we need all the keywords
        const hasKwMain = detail.kw_main && detail.kw_main.trim() !== "";
        const hasMinSecondaryKws = detail.kw_secondary.length > 0 && detail.kw_secondary[0] && detail.kw_secondary[0].trim() !== "";
        return hasKwMain && hasMinSecondaryKws && hasSelectedPosts;
      }
    });
  };

  const handleProceedToReview = () => {
    if (!isAnalysisDataComplete()) {
      toast.error("Please complete all required fields for each search configuration and select posts.");
      return;
    }
    setCurrentUiStep('review_summary');
  };

  if (current_ui_step === 'initial_setup') {
    return (
      <div className="container mx-auto flex h-screen flex-col items-center justify-center p-6">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle className="text-2xl">Create New Analysis</CardTitle>
            <CardDescription>Start by giving your analysis a name and selecting a category.</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-1">
              <Label htmlFor="analysisName">Analysis Name*</Label>
              <Input id="analysisName" placeholder="E.g., Q4 Product Launch Campaign" value={localAnalysisName} onChange={(e) => setLocalAnalysisName(e.target.value)} />
            </div>
            <div className="space-y-1">
              <Label htmlFor="analysisCategory">Category*</Label>
              <Select onValueChange={(value: string) => handleCategoryChange(value as AnalysisCategory)} value={localCategory || undefined}>
                <SelectTrigger id="analysisCategory"><SelectValue placeholder="Select a category" /></SelectTrigger>
                <SelectContent>{CATEGORIES.map(cat => (<SelectItem key={cat} value={cat!}>{cat}</SelectItem>))}</SelectContent>
              </Select>
            </div>
            <Button onClick={handleNextToMainConfig} className="w-full">Next</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (current_ui_step === 'review_summary') {
    return <AnalysisReview />;
  }

  // Determine the number of columns for TabsList: one for each detail + 1 for the add button if applicable
  // const tabListCols = search_details.length + (canAddMoreDetails ? 1 : 0); // REMOVED
  // Ensure at least 1 column if there are no details and no add button (should not happen if first detail is initialized)
  // Max columns can be search_details.length (up to 3) + 1 for add button = 4.
  // So, grid-cols-1, grid-cols-2, grid-cols-3, grid-cols-4
  // const gridColsClass = `grid-cols-${Math.min(tabListCols, 4) || 1}`; // REMOVED

  let addDetailContextText = "Detail";
  if (category === "Company") {
    addDetailContextText = "Competitor";
  } else if (category === "Political Campaign") {
    addDetailContextText = "Other Candidate";
  } else if (category === "Content Creator") {
    addDetailContextText = "Other Creator";
  }
  const addButtonText = `+ Add ${addDetailContextText} (${3 - search_details.length} left)`;

  return (
    <div className="container mx-auto p-6">
      <div className="mb-6 flex items-center justify-between">
        <div>
            <h1 className="text-2xl font-bold">{name_job}</h1>
            <p className="text-sm text-muted-foreground">Configure your analysis details below.</p>
        </div>
      </div>
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <div className="flex flex-col space-y-4">
            <Tabs value={active_search_detail_idx.toString()} onValueChange={onTabChange} className="w-full">
                <TabsList className="flex w-full items-center justify-between rounded-md bg-muted p-1 text-muted-foreground mb-2 overflow-x-auto flex-nowrap">
                    <div className="flex items-center gap-2">
                        {search_details.map((detail: SearchDetail, index: number) => {
                            // Show placeholder if label is a default (contains 'Name'), otherwise show label
                            let tabLabel = detail.label;
                            if (!tabLabel || tabLabel.includes('Name')) {
                                if (category === 'Company') {
                                    tabLabel = index === 0 ? 'Company Name' : 'Competitor Name';
                                } else if (category === 'Political Campaign') {
                                    tabLabel = index === 0 ? 'Candidate or Party Name' : 'Opposition Name';
                                } else if (category === 'Content Creator') {
                                    tabLabel = index === 0 ? 'Creator Name' : 'Other Creator Name';
                                } else {
                                    tabLabel = index === 0 ? 'Main Target' : `Detail ${index + 1}`;
                                }
                            }
                            return (
                                <TabsTrigger
                                    key={detail.id_detail || `detail-tab-${index}`}
                                    value={index.toString()}
                                    disabled={!detail.label && index !== 0}
                                    className="w-[160px] truncate overflow-hidden whitespace-nowrap block"
                                    title={tabLabel}
                                >
                                    {tabLabel}
                                </TabsTrigger>
                            );
                        })}
                    </div>
                    {canAddMoreDetails && (
                        <Button 
                            variant="ghost" 
                            onClick={handleAddDetailTab}
                            className="px-3 py-1.5 text-sm font-medium h-auto text-muted-foreground hover:text-foreground"
                        >
                            {addButtonText}
                        </Button>
                    )}
                </TabsList>
                {search_details.map((detail: SearchDetail, index: number) => {
                    const hasTitle = !detail.label;
                    const hasRemoveButton = index > 0;
                    // Always render CardHeader for spacing
                    return (
                        <TabsContent key={detail.id_detail || `detail-content-${index}`} value={index.toString()}>
                            <Card>
                                <CardHeader className="flex-row items-center justify-between">
                                    {hasTitle && (
                                        <CardTitle>
                                            {index === 0 ? "Main Target Configuration" : `Configure Detail ${index + 1}`}
                                        </CardTitle>
                                    )}
                                    {hasRemoveButton && (
                                        <Button 
                                            variant="outline" 
                                            size="sm" 
                                            onClick={() => removeSearchDetail(index)}
                                            className={hasTitle ? "" : "ml-auto"}
                                        >
                                            Remove
                                        </Button>
                                    )}
                                </CardHeader>
                                <CardContent>
                                    {currentActiveSearchDetail && category && active_search_detail_idx === index && (
                                        <KeywordInputForm 
                                            key={currentActiveSearchDetail.id_detail} // Use ID of the active detail for key
                                            detailIndex={active_search_detail_idx} // Pass active index
                                            searchDetail={currentActiveSearchDetail} // Pass the active search detail object
                                            category={category}
                                            updateKeywords={(kw_main: string, kw_secondary: string[]) => {
                                                updateSearchDetail(active_search_detail_idx, { kw_main, kw_secondary });
                                            }}
                                        />
                                    )}
                                </CardContent>
                            </Card>
                        </TabsContent>
                    );
                })}
            </Tabs>
        </div>
        <div className="h-full min-h-[600px]">
          <PostGroups /> 
        </div>
      </div>

      {current_ui_step === 'main_config' && (
        <div className="mt-8 flex justify-center">
          <Button 
            size="lg" 
            onClick={handleProceedToReview}
            disabled={!isAnalysisDataComplete()}
          >
            Review Analysis Details
          </Button>
        </div>
      )}
    </div>
  );
}

export default NewAnalysisPage;