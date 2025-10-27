import { useCallback, useEffect, useState, version } from "react";
import { TermFragment } from "@/types";
import { getTermFragment } from "@/functions/termFragments";

export default function useFragment(id: string): TermFragment | null {
  const [fragment, setFragment] = useState<TermFragment | null>(null);

  useEffect(() => {
    const fetchFragment = async () => {
      try {
        const data = await getTermFragment(id);
        setFragment(data);
      } catch (error) {
        console.error("Failed to fetch fragment:", error);
      }
    };

    fetchFragment();
  }, [id]);

  return fragment;
}
