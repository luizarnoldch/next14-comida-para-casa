import { create } from "zustand";
import { devtools } from "zustand/middleware";
import { immer } from "zustand/middleware/immer";
import { v4 as uuidv4 } from "uuid"; // For generating unique IDs
import { NetworkScrap } from "@/types/network"; // Assuming this type is appropriate for posts

// Types
export interface PostToAnalyze extends NetworkScrap {
  // Add any additional properties if posts in this context need more than NetworkScrap
}

export type KwType =
  | "company"
  | "competitor"
  | "candidate"
  | "other candidate"
  | "creator"
  | "other creator";

export interface SearchDetail {
  id_detail: string; // Client-generated unique ID
  kw_main: string;
  kw_secondary: string[];
  kw_type: KwType;
  posts_to_analyze: PostToAnalyze[]; // These are the *selected* posts for this detail
  search_type: "advanced" | "manual";
  // Potentially add a user-facing label, e.g., "Company X Search" or "Competitor A"
  label?: string;
  fetched_posts?: NetworkScrap[]; // Added to store fetched posts per detail
}

export type AnalysisCategory =
  | "Company"
  | "Political Campaign"
  | "Content Creator"
  | null;

// OG Data types (similar to the old analysisStore)
export type OgData = {
  image?: string;
  title?: string;
  description?: string;
  [key: string]: any;
};
export type OgCacheEntry =
  | { status: "pending"; promise?: Promise<OgData> }
  | { status: "success"; data: OgData }
  | { status: "error"; error: any };

interface NewAnalysisFormState {
  name_job: string | null;
  category: AnalysisCategory;
  current_ui_step: "initial_setup" | "main_config" | "review_summary";

  search_details: SearchDetail[];
  active_search_detail_idx: number; // Index in the search_details array

  // New state properties for handling active fetched posts and loading state
  isLoading: boolean;
  currentActiveFetchedPosts: NetworkScrap[]; // Posts fetched for the current active tab
  // Note: selectedPosts are per SearchDetail (posts_to_analyze)

  // Actions
  setNameJob: (name: string) => void;
  setCategory: (category: AnalysisCategory) => void;
  setCurrentUiStep: (
    step: "initial_setup" | "main_config" | "review_summary"
  ) => void;

  initializeFirstSearchDetail: (category: AnalysisCategory) => void;
  addCompetitorSearchDetail: (category: AnalysisCategory) => void;
  updateSearchDetail: (
    index: number,
    updates: Partial<
      Omit<
        SearchDetail,
        "id_detail" | "posts_to_analyze" | "fetched_posts" | "kw_type"
      >
    >
  ) => void;
  removeSearchDetail: (index: number) => void;
  setActiveSearchDetailIdx: (index: number) => void;
  setSearchDetailLabel: (index: number, label: string) => void;

  // Actions for managing posts within a specific search_detail (selected posts)
  setPostsForSearchDetail: (
    detailIndex: number,
    posts: PostToAnalyze[]
  ) => void;
  addPostToSearchDetail: (detailIndex: number, post: PostToAnalyze) => void;
  removePostFromSearchDetail: (detailIndex: number, postId: string) => void;
  clearPostsForSearchDetail: (detailIndex: number) => void;

  // New actions for global loading and current fetched/selected posts for the ACTIVE detail
  setIsLoading: (loading: boolean) => void;
  setCurrentActiveFetchedPosts: (posts: NetworkScrap[]) => void; // This will set current and persist to active detail
  loadFetchedPostsForActiveDetail: () => void; // New action to explicitly load from active detail to currentActiveFetchedPosts
  clearCurrentActiveFetchedPosts: () => void; // This will clear current and persist to active detail

  clearSelectedPostsForActiveDetail: () => void; // Clears `posts_to_analyze` for the active search_detail
  toggleSelectAllInCurrentFetched: () => void; // Selects/deselects all from `currentActiveFetchedPosts` into active detail's `posts_to_analyze`
  setIsPostSelectedInActiveDetail: (
    post: PostToAnalyze,
    isSelected: boolean
  ) => void; // Adds/removes a single post
  setPostOgDataForCurrentActiveFetched: (
    url: string,
    entry: OgCacheEntry
  ) => void; // For OG data

  // Reset store to initial state
  resetForm: () => void;
}

const getInitialSearchDetail = (
  category: AnalysisCategory,
  isCompetitor = false
): SearchDetail => {
  let kwMainPlaceholder = ""; // This is the label, kw_main itself is "" initially
  let kw_type: KwType;

  switch (category) {
    case "Company":
      kwMainPlaceholder = isCompetitor ? "Competitor Name" : "Company Name";
      kw_type = isCompetitor ? "competitor" : "company";
      break;
    case "Political Campaign":
      kwMainPlaceholder = isCompetitor
        ? "Opposition Name"
        : "Candidate or Party Name";
      kw_type = isCompetitor ? "other candidate" : "candidate";
      break;
    case "Content Creator":
      kwMainPlaceholder = isCompetitor ? "Other Creator Name" : "Creator Name";
      kw_type = isCompetitor ? "other creator" : "creator";
      break;
    default: // Fallback for null or undefined category
      kwMainPlaceholder = isCompetitor ? "Competitor" : "Main Subject Focus";
      kw_type = isCompetitor ? "competitor" : "company";
      break;
  }

  return {
    id_detail: uuidv4(),
    kw_main: "", // kw_main is always initialized as empty
    kw_type,
    kw_secondary: isCompetitor ? ["", "", ""] : ["", "", "", ""], // Main: 1 mandatory + 3 opt; Competitor: 3
    posts_to_analyze: [],
    search_type: "advanced",
    label: kwMainPlaceholder,
    fetched_posts: [], // Initialize fetched_posts
  };
};

const initialState = {
  name_job: null,
  category: null,
  current_ui_step: "initial_setup" as
    | "initial_setup"
    | "main_config"
    | "review_summary",
  search_details: [],
  active_search_detail_idx: 0,
  isLoading: false,
  currentActiveFetchedPosts: [],
};

export const useNewAnalysisFormStore = create<NewAnalysisFormState>()(
  devtools(
    immer((set, get) => ({
      ...initialState,

      setNameJob: (name) => {
        set(
          (state) => {
            state.name_job = name;
          },
          false,
          "setNameJob"
        );
      },

      setCategory: (category) => {
        set(
          (state) => {
            state.category = category;
            // If category changes, update labels for details where kw_main is empty
            if (
              state.current_ui_step === "main_config" &&
              state.search_details.length > 0
            ) {
              state.search_details.forEach(
                (detail: SearchDetail, index: number) => {
                  if (!detail.kw_main || detail.kw_main.trim() === "") {
                    // Only update if kw_main is empty
                    const isCompetitor = index > 0; // Assuming first detail is main, others are competitors
                    const newDetails = getInitialSearchDetail(
                      category,
                      isCompetitor
                    );
                    detail.label = newDetails.label;
                    detail.kw_type = newDetails.kw_type;
                  }
                }
              );
            }
          },
          false,
          "setCategory"
        );
      },

      setCurrentUiStep: (step) => {
        set(
          (state) => {
            state.current_ui_step = step;
          },
          false,
          "setCurrentUiStep"
        );
      },

      initializeFirstSearchDetail: (category) =>
        set(
          (state) => {
            if (category) {
              const firstDetail = getInitialSearchDetail(category, false);
              state.search_details = [firstDetail];
              state.active_search_detail_idx = 0;
              state.category = category;
              // currentActiveFetchedPosts is NOT set here anymore, will be handled by component
            }
          },
          false,
          "initializeFirstSearchDetail"
        ),

      addCompetitorSearchDetail: (category) =>
        set(
          (state) => {
            if (category && state.search_details.length < 3) {
              const newDetail = getInitialSearchDetail(category, true);
              state.search_details.push(newDetail);
              state.active_search_detail_idx = state.search_details.length - 1;
              // currentActiveFetchedPosts is NOT set here anymore, will be handled by component
            }
          },
          false,
          "addCompetitorSearchDetail"
        ),

      updateSearchDetail: (index, updates) =>
        set(
          (state) => {
            const currentDetail = state.search_details[index];
            if (currentDetail) {
              // Update kw_main and subsequently label
              if (
                updates.kw_main !== undefined &&
                currentDetail.kw_main !== updates.kw_main
              ) {
                currentDetail.kw_main = updates.kw_main;

                if (updates.kw_main && updates.kw_main.trim() !== "") {
                  currentDetail.label = updates.kw_main;
                } else {
                  // kw_main is empty or whitespace, revert to category-based placeholder
                  const isCompetitor = index > 0; // Determine if it's a competitor based on index
                  // Ensure state.category is not null for getInitialSearchDetail by passing current state's category
                  const newDetails = getInitialSearchDetail(
                    state.category,
                    isCompetitor
                  );
                  currentDetail.label = newDetails.label;
                  currentDetail.kw_type = newDetails.kw_type;
                }
              }

              // Update kw_secondary if it's provided
              if (updates.kw_secondary !== undefined) {
                const newSec = updates.kw_secondary;
                const oldSec = currentDetail.kw_secondary;
                // Only update if the array content actually changed to avoid unnecessary re-renders
                if (
                  newSec.length !== oldSec.length ||
                  !newSec.every((val, i) => val === oldSec[i])
                ) {
                  currentDetail.kw_secondary = newSec;
                }
              }

              // Update search_type if it's provided
              if (updates.search_type !== undefined) {
                currentDetail.search_type = updates.search_type;
              }
              // Removed 'changed' flag logic as Immer handles direct mutations.
            }
          },
          false,
          "updateSearchDetail"
        ),

      setSearchDetailLabel: (index, label) =>
        set(
          (state) => {
            if (state.search_details[index]) {
              state.search_details[index].label = label;
            }
          },
          false,
          "setSearchDetailLabel"
        ),

      removeSearchDetail: (indexToRemove) => {
        set(
          (state) => {
            if (
              indexToRemove > 0 &&
              indexToRemove < state.search_details.length
            ) {
              // Can only remove competitors
              state.search_details.splice(indexToRemove, 1);
              if (state.active_search_detail_idx >= indexToRemove) {
                state.active_search_detail_idx = Math.max(
                  0,
                  state.active_search_detail_idx - 1
                );
              }
              // currentActiveFetchedPosts is NOT reloaded here anymore, will be handled by component after index change
            }
          },
          false,
          "removeSearchDetail"
        );
      },

      setActiveSearchDetailIdx: (index) => {
        set(
          (state) => {
            if (index >= 0 && index < state.search_details.length) {
              state.active_search_detail_idx = index;
              // currentActiveFetchedPosts is NOT reloaded here anymore, will be handled by component
            }
          },
          false,
          "setActiveSearchDetailIdx"
        );
      },

      setPostsForSearchDetail: (detailIndex, posts) => {
        set(
          (state) => {
            if (state.search_details[detailIndex]) {
              state.search_details[detailIndex].posts_to_analyze = posts;
            }
          },
          false,
          "setPostsForSearchDetail"
        );
      },

      addPostToSearchDetail: (detailIndex, post) => {
        set(
          (state) => {
            if (state.search_details[detailIndex]) {
              const detail = state.search_details[detailIndex];
              if (
                !detail.posts_to_analyze.find(
                  (p: PostToAnalyze) => p.url === post.url
                )
              ) {
                // Assuming 'url' is unique
                detail.posts_to_analyze.push(post);
              }
            }
          },
          false,
          "addPostToSearchDetail"
        );
      },

      removePostFromSearchDetail: (detailIndex, postId) => {
        // postId can be URL or any unique ID
        set(
          (state) => {
            if (state.search_details[detailIndex]) {
              const detail = state.search_details[detailIndex];
              detail.posts_to_analyze = detail.posts_to_analyze.filter(
                (p: PostToAnalyze) =>
                  p.url !== postId && (p as any).id !== postId
              );
            }
          },
          false,
          "removePostFromSearchDetail"
        );
      },

      clearPostsForSearchDetail: (detailIndex) => {
        set(
          (state) => {
            if (state.search_details[detailIndex]) {
              state.search_details[detailIndex].posts_to_analyze = [];
            }
          },
          false,
          "clearPostsForSearchDetail"
        );
      },

      // Implementations for new actions
      setIsLoading: (loading) =>
        set(
          (state) => {
            state.isLoading = loading;
          },
          false,
          "setIsLoading"
        ),
      setCurrentActiveFetchedPosts: (posts) =>
        set(
          (state) => {
            const mappedPosts = posts.map((p: NetworkScrap) => ({
              ...p,
              ogData: p.ogData || undefined,
            }));
            state.currentActiveFetchedPosts = mappedPosts;
            if (state.search_details[state.active_search_detail_idx]) {
              state.search_details[
                state.active_search_detail_idx
              ].fetched_posts = mappedPosts;
            }
          },
          false,
          "setCurrentActiveFetchedPosts"
        ),
      loadFetchedPostsForActiveDetail: () =>
        set(
          (state) => {
            const activeDetail =
              state.search_details[state.active_search_detail_idx];
            if (activeDetail) {
              state.currentActiveFetchedPosts =
                activeDetail.fetched_posts || [];
            }
          },
          false,
          "loadFetchedPostsForActiveDetail"
        ),
      clearCurrentActiveFetchedPosts: () =>
        set(
          (state) => {
            state.currentActiveFetchedPosts = [];
            if (state.search_details[state.active_search_detail_idx]) {
              state.search_details[
                state.active_search_detail_idx
              ].fetched_posts = [];
            }
          },
          false,
          "clearCurrentActiveFetchedPosts"
        ),
      clearSelectedPostsForActiveDetail: () =>
        set(
          (state) => {
            const activeIdx = state.active_search_detail_idx;
            if (state.search_details[activeIdx]) {
              state.search_details[activeIdx].posts_to_analyze = [];
            }
          },
          false,
          "clearSelectedPostsForActiveDetail"
        ),
      toggleSelectAllInCurrentFetched: () =>
        set(
          (state) => {
            const activeIdx = state.active_search_detail_idx;
            if (state.search_details[activeIdx]) {
              const activeDetail = state.search_details[activeIdx];
              const allCurrentFetchedUrls = new Set(
                state.currentActiveFetchedPosts.map((p: NetworkScrap) => p.url)
              );
              const allSelected =
                state.currentActiveFetchedPosts.length > 0 &&
                state.currentActiveFetchedPosts.every(
                  (fetchedPost: NetworkScrap) =>
                    activeDetail.posts_to_analyze.some(
                      (selectedPost: PostToAnalyze) =>
                        selectedPost.url === fetchedPost.url
                    )
                );

              if (allSelected) {
                // Deselect all: remove posts that are in currentActiveFetchedPosts from posts_to_analyze
                activeDetail.posts_to_analyze =
                  activeDetail.posts_to_analyze.filter(
                    (sp: PostToAnalyze) => !allCurrentFetchedUrls.has(sp.url)
                  );
              } else {
                // Select all: add posts from currentActiveFetchedPosts that are not already selected
                const currentSelectedUrls = new Set(
                  activeDetail.posts_to_analyze.map((p: PostToAnalyze) => p.url)
                );
                state.currentActiveFetchedPosts.forEach((fp: NetworkScrap) => {
                  if (!currentSelectedUrls.has(fp.url)) {
                    activeDetail.posts_to_analyze.push(fp as PostToAnalyze); // Cast needed if NetworkScrap != PostToAnalyze
                  }
                });
              }
            }
          },
          false,
          "toggleSelectAllInCurrentFetched"
        ),
      setIsPostSelectedInActiveDetail: (post, isSelected) =>
        set(
          (state) => {
            const activeIdx = state.active_search_detail_idx;
            if (state.search_details[activeIdx]) {
              const activeDetail = state.search_details[activeIdx];
              const postIndex = activeDetail.posts_to_analyze.findIndex(
                (p: PostToAnalyze) => p.url === post.url
              );
              if (isSelected && postIndex === -1) {
                activeDetail.posts_to_analyze.push(post as PostToAnalyze);
              } else if (!isSelected && postIndex !== -1) {
                activeDetail.posts_to_analyze.splice(postIndex, 1);
              }
            }
          },
          false,
          "setIsPostSelectedInActiveDetail"
        ),
      setPostOgDataForCurrentActiveFetched: (url, entry) =>
        set(
          (state) => {
            const postIndex = state.currentActiveFetchedPosts.findIndex(
              (p: NetworkScrap) => p.url === url
            );
            if (postIndex !== -1) {
              // Ensure ogData exists before spreading
              const existingOgData = state.currentActiveFetchedPosts[postIndex]
                .ogData || { status: "pending" };
              state.currentActiveFetchedPosts[postIndex].ogData = {
                ...existingOgData,
                ...entry,
              } as OgCacheEntry;
              // Also update in the persisted fetched_posts for the active detail
              if (
                state.search_details[state.active_search_detail_idx]
                  ?.fetched_posts
              ) {
                const persistedPostIndex = state.search_details[
                  state.active_search_detail_idx
                ].fetched_posts!.findIndex((p: NetworkScrap) => p.url === url);
                if (persistedPostIndex !== -1) {
                  const persistedExistingOgData = state.search_details[
                    state.active_search_detail_idx
                  ].fetched_posts![persistedPostIndex].ogData || {
                    status: "pending",
                  };
                  state.search_details[
                    state.active_search_detail_idx
                  ].fetched_posts![persistedPostIndex].ogData = {
                    ...persistedExistingOgData,
                    ...entry,
                  } as OgCacheEntry;
                }
              }
            }
          },
          false,
          "setPostOgDataForCurrentActiveFetched"
        ),
      resetForm: () => {
        set(initialState, false, "resetForm");
      },
    })),
    {
      name: "NewAnalysisFormStore",
      enabled: process.env.NODE_ENV === "development",
    }
  )
);
