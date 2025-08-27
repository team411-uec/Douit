import { Box, Flex, Heading, Button, Text, Select, ScrollArea, Container } from "@radix-ui/themes";
import { QuestionMarkIcon, CheckIcon, FaceIcon, PaperPlaneIcon } from "@radix-ui/react-icons";
import Header from "../../../components/Header";

type EditData = {
  title: string;
  version: string;
  content: string;
  selectedText: string;
};

// テストデータ（後でAPIから取得に置き換え）
const editData: EditData = {
  title: "PrivacyPolicy for Website",
  version: "v1", 
  content: `[PROVIDER]は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。

第1条（個人情報）
「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。

第2条（個人情報の収集方法）
当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下、「提携先」といいます。）などから収集することがあります。

第3条（個人情報を収集・利用する目的）
当社が個人情報を収集・利用する目的は、以下のとおりです。

当社サービスの提供・運営のため
ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）
ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため
メンテナンス、重要なお知らせなど必要に応じたご連絡のため
利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため`,
  selectedText: `[PROVIDER]は、本ウェブサイト上で提供するサービス（以下、「本サービス」といいます。）における、ユーザーの個人情報の取扱いについて、以下のとおりプライバシーポリシー（以下、「本ポリシー」といいます。）を定めます。

第1条（個人情報）
「個人情報」とは、個人情報保護法にいう「個人情報」を指すものとし、生存する個人に関する情報であって、当該情報に含まれる氏名、生年月日、住所、電話番号、連絡先その他の記述等により特定の個人を識別できる情報及び容貌、指紋、声紋にかかるデータ、及び健康保険証の保険者番号などの当該情報単体から特定の個人を識別できる情報（個人識別情報）を指します。

第2条（個人情報の収集方法）
当社は、ユーザーが利用登録をする際に氏名、生年月日、住所、電話番号、メールアドレス、銀行口座番号、クレジットカード番号、運転免許証番号などの個人情報をお尋ねすることがあります。また、ユーザーと提携先などとの間でなされたユーザーの個人情報を含む取引記録や決済に関する情報を、当社の提携先（情報提供元、広告主、広告配信先などを含みます。以下、「提携先」といいます。）などから収集することがあります。

第3条（個人情報を収集・利用する目的）
当社が個人情報を収集・利用する目的は、以下のとおりです。

当社サービスの提供・運営のため
ユーザーからのお問い合わせに回答するため（本人確認を行うことを含む）
ユーザーが利用中のサービスの新機能、更新情報、キャンペーン等及び当社が提供する他のサービスの案内のメールを送付するため
メンテナンス、重要なお知らせなど必要に応じたご連絡のため
利用規約に違反したユーザーや、不正・不当な目的でサービスを利用しようとするユーザーの特定をし、ご利用をお断りするため`
};

export default function EditFragmentPage({ 
  params 
}: { 
  params: { fragmentid: string } 
}) {
  return (
    <Box className="min-h-screen">
      <Header showUserIcon={true} />
      
      <Container size="1" px="4" py="6">
        {/* Header with title and version */}
        <Flex align="center" justify="between" className="mb-6">
          <Heading size="6" color="gray" className="flex-1">
            {editData.title}
          </Heading>
          <Select.Root defaultValue={editData.version}>
            <Select.Trigger className="w-20" />
            <Select.Content>
              <Select.Item value="v1">v1</Select.Item>
              <Select.Item value="v2">v2</Select.Item>
            </Select.Content>
          </Select.Root>
        </Flex>

        {/* Content with highlighted selection */}
        <ScrollArea className="h-96 mb-6">
          <Box className="pr-4">
            <Box 
              className="p-3 border-2 border-dashed border-violet-400 rounded-lg bg-violet-50"
            >
              <Text size="3" className="leading-relaxed text-gray-900 whitespace-pre-line">
                {editData.selectedText}
              </Text>
            </Box>
          </Box>
        </ScrollArea>

        {/* Send Edit Button */}
        <Button 
          size="3" 
          variant="solid"
          color="gray"
          className="w-full mb-8"
        >
          <PaperPlaneIcon width="16" height="16" />
          編集を送信
        </Button>

        {/* Bottom Action Buttons */}
        <Flex justify="center" gap="6">
          <Button 
            variant="ghost" 
            size="3"
            className="text-[#00ADB5]"
          >
            <Box className="text-center">
              <QuestionMarkIcon width="20" height="20" />
              <br />
              <Text size="2">知らない</Text>
            </Box>
          </Button>
          <Button 
            variant="ghost" 
            size="3"
            color="gray"
          >
            <CheckIcon width="20" height="20" />
            <Text size="2">理解した</Text>
          </Button>
          <Button 
            variant="ghost" 
            size="3"
            className="text-[#00ADB5]"
          >
            <FaceIcon width="20" height="20" />
          </Button>
        </Flex>
      </Container>
    </Box>
  );
}
