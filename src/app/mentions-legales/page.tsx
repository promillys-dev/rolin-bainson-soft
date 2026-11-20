import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { EditorialLayout } from '@/components/editorial/EditorialLayout'
import { getEditorialPage } from '@/data/editorial'

const page = getEditorialPage('mentions-legales')

export const metadata: Metadata = {
  title: page?.name,
  description: page?.metaDescription,
}

export default function Page() {
  if (!page) notFound()
  return <EditorialLayout page={page} />
}
