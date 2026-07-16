import { InternalLayout } from "@/components/internal-layout"

export default function InternoLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return <InternalLayout>{children}</InternalLayout>
}
