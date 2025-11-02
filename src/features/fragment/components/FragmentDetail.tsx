"use client";

import { Container, Flex } from "@radix-ui/themes";
import { useState } from "react";
import {
  addUnderstoodRecord,
  removeUnderstoodRecord,
  isFragmentUnderstood,
} from "@/features/understanding/services/understandingService";
import { addFragmentToSet } from "@/features/termSet/services/termSetService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import { useUnderstandingStatus } from "@/features/understanding/hooks/useUnderstandingStatus";
import { useUserTermSets } from "@/features/termSet/hooks/useUserTermSets";
import AddFragmentToSetDialog from "@/features/termSet/components/AddFragmentToSetDialog";
import FragmentHeader from "./FragmentHeader";
import FragmentContent from "./FragmentContent";
import FragmentActions from "./FragmentActions";
import UnderstandingControl from "@/features/understanding/components/UnderstandingControl";
import { TermFragment } from "@/types";

type FragmentDetailProps = {
  fragmentId: string;
  fragmentData: TermFragment;
};

export default function FragmentDetail({ fragmentId, fragmentData }: FragmentDetailProps) {
  const { understanding, setUnderstanding } = useUnderstandingStatus(fragmentId);
  const { data: userTermSets } = useUserTermSets();

  const [showAddDialog, setShowAddDialog] = useState(false);
  const { user } = useAuth();

  const handleUnderstandingChange = async (value: "understood" | "unknown") => {
    if (!user) return;

    if (value === understanding) return;

    if (value === "understood") {
      try {
        const alreadyUnderstood = await isFragmentUnderstood(
          user.uid,
          fragmentId,
          fragmentData.currentVersion
        );

        if (alreadyUnderstood) {
          console.log("この規約片は既に理解済みです");
          setUnderstanding("understood");
          return;
        }
      } catch (error) {
        console.error("理解状態の事前チェックに失敗しました:", error);
      }
    }

    setUnderstanding(value);

    try {
      if (value === "understood") {
        await addUnderstoodRecord(user.uid, fragmentId, fragmentData.currentVersion);
        console.log("理解記録を追加しました");
      } else if (value === "unknown") {
        await removeUnderstoodRecord(user.uid, fragmentId);
        console.log("理解記録を削除しました");
      }
    } catch (error) {
      console.error("理解記録の更新に失敗しました:", error);

      if (error instanceof Error && error.message.includes("既に理解済み")) {
        console.log("既に理解済みの規約片です");
        setUnderstanding("understood");
      } else {
        setUnderstanding(value === "understood" ? "unknown" : "understood");
      }
    }
  };

  const handleAddToTermSet = () => {
    setShowAddDialog(true);
  };

  const handleConfirmAdd = async (termSetId: string, parameterValues: Record<string, string>) => {
    if (!termSetId || !user) return;

    try {
      await addFragmentToSet(termSetId, fragmentId, parameterValues);

      console.log("規約セットに追加しました");
      setShowAddDialog(false);
    } catch (error) {
      console.error("規約セットへの追加に失敗しました:", error);
    }
  };

  return (
    <Container size="1" px="4" py="6">
      <FragmentHeader fragmentData={fragmentData} />
      <FragmentContent fragmentData={fragmentData} />
      <Flex direction="column" gap="3">
        <FragmentActions fragmentId={fragmentId} onAddToTermSet={handleAddToTermSet} />
        <UnderstandingControl
          understanding={understanding}
          onUnderstandingChange={handleUnderstandingChange}
        />
      </Flex>

      <AddFragmentToSetDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        fragmentData={fragmentData}
        userTermSets={userTermSets}
        onConfirm={handleConfirmAdd}
      />
    </Container>
  );
}
