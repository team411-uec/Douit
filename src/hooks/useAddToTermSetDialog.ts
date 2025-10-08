import { useState, useCallback } from "react";
import { addFragmentToSet } from "@/functions/termSetService";
import { TermFragment } from "@/types";

interface UseAddToTermSetDialogReturn {
  showAddDialog: boolean;
  selectedTermSet: string;
  parameterValues: Record<string, string>;

  openDialog: (fragmentData: TermFragment) => void;
  closeDialog: () => void;
  setSelectedTermSet: (termSetId: string) => void;
  updateParameterValue: (param: string, value: string) => void;
  confirmAdd: (fragmentId: string, userId: string) => Promise<void>;
}

export function useAddToTermSetDialog(): UseAddToTermSetDialogReturn {
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [selectedTermSet, setSelectedTermSet] = useState<string>("");
  const [parameterValues, setParameterValues] = useState<Record<string, string>>({});

  const openDialog = useCallback((fragmentData: TermFragment) => {
    setShowAddDialog(true);
    if (fragmentData?.templateParams) {
      const initialParams: Record<string, string> = {};
      fragmentData.templateParams.forEach(param => {
        initialParams[param] = "";
      });
      setParameterValues(initialParams);
    }
  }, []);

  const closeDialog = useCallback(() => {
    setShowAddDialog(false);
    setSelectedTermSet("");
    setParameterValues({});
  }, []);

  const updateParameterValue = useCallback((param: string, value: string) => {
    setParameterValues(prev => ({
      ...prev,
      [param]: value,
    }));
  }, []);

  const confirmAdd = useCallback(
    async (fragmentId: string, userId: string) => {
      if (!selectedTermSet || !userId) return;

      try {
        await addFragmentToSet(selectedTermSet, fragmentId, parameterValues);
        console.log("規約セットに追加しました");
        closeDialog();
      } catch (error) {
        console.error("規約セットへの追加に失敗しました:", error);
      }
    },
    [selectedTermSet, parameterValues, closeDialog]
  );

  return {
    showAddDialog,
    selectedTermSet,
    parameterValues,
    openDialog,
    closeDialog,
    setSelectedTermSet,
    updateParameterValue,
    confirmAdd,
  };
}
