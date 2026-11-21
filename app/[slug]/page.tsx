import { notFound } from "next/navigation";
import { DocumentPage } from "@/components/document";
import { documentAt, documents } from "@/lib/content";
import { documentMetadata } from "@/lib/metadata";

export const dynamicParams = false;
export function generateStaticParams() {
  return documents
    .filter(
      (document) =>
        document.path !== "/" && document.path.slice(1).indexOf("/") === -1,
    )
    .map((document) => ({ slug: document.path.slice(1) }));
}
export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const document = documentAt(`/${(await params).slug}`);
  return document ? documentMetadata(document) : {};
}
export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const document = documentAt(`/${(await params).slug}`);
  if (!document) notFound();
  return <DocumentPage document={document} />;
}
