import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { ServiceLayout } from '@/components/editorial/ServiceLayout'
import { getServicePage } from '@/data/services'

const page = getServicePage('gestion-immobiliere')

export const metadata: Metadata = {
  title: page?.name,
  description: page?.description,
}

export default function Page() {
  if (!page) notFound()
  return <ServiceLayout page={page} />
}
