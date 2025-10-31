import { Box, ScrollArea, TextArea } from "@radix-ui/themes";

type EditableFragmentContentProps = {
  editedContent: string;
  onContentChange: (content: string) => void;
};

export default function EditableFragmentContent({
  editedContent,
  onContentChange,
}: EditableFragmentContentProps) {
  return (
    <ScrollArea className="h-96 mb-6">
      <Box className="pr-4">
        <TextArea
          value={editedContent}
          onChange={e => onContentChange(e.target.value)}
          className="w-full h-full p-4 border border-gray-200 rounded-lg resize-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          placeholder="規約片の内容を入力してください..."
          style={{ minHeight: "350px" }}
        />
      </Box>
    </ScrollArea>
  );
}
