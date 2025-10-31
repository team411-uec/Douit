"use client";

import { Container } from "@radix-ui/themes";
import { useState } from "react";
import { updateTermFragment } from "@/features/fragment/services/fragmentService";
import { useAuth } from "@/features/auth/contexts/AuthContext";
import FragmentHeader from "./FragmentHeader";
import EditableFragmentContent from "./EditableFragmentContent";
import SaveFragmentButton from "./SaveFragmentButton";
import { TermFragment } from "@/types";

type EditFragmentProps = {
  fragmentId: string;
  fragmentData: TermFragment;
  refetch: () => void;
};

export default function EditFragment({ fragmentId, fragmentData, refetch }: EditFragmentProps) {
  const { user } = useAuth();
  const [editedContent, setEditedContent] = useState(fragmentData.content);
  const [isSaving, setIsSaving] = useState(false);

  const handleSaveEdit = async () => {
    if (!user || !editedContent.trim()) return;

    setIsSaving(true);
    try {
      await updateTermFragment(
        fragmentId,
        fragmentData.title,
        editedContent.trim(),
        fragmentData.tags,
        fragmentData.parameters || []
      );

      await refetch();

      console.log("規約片の更新が完了しました");
    } catch (error) {
      console.error("規約片の更新に失敗しました:", error);
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <Container size="1" px="4" py="6">
      <FragmentHeader fragmentData={fragmentData} />
      <EditableFragmentContent editedContent={editedContent} onContentChange={setEditedContent} />
      <SaveFragmentButton
        isSaving={isSaving}
        isDisabled={isSaving || !editedContent.trim() || editedContent === fragmentData.content}
        onSave={handleSaveEdit}
      />
    </Container>
  );
}
