import { LegalDocumentLayout } from "@/components/legal/legal-document-layout";

type Props = {
  title: string;
  children: React.ReactNode;
};

export function LegalPage({ title, children }: Props) {
  return <LegalDocumentLayout title={title}>{children}</LegalDocumentLayout>;
}
