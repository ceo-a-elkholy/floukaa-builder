import { createServerFn } from '@tanstack/react-start'
import { z } from 'zod'
import type { ShopifyProduct } from './shopify'

export type RecommendResult = {
  intro: string
  items: Array<{ product: ShopifyProduct; reason: string }>
  error?: string
}

export const recommendProducts = createServerFn({ method: 'POST' })
  .inputValidator((input: unknown) => z.object({ request: z.string().trim().min(2).max(500) }).parse(input))
  .handler(async (): Promise<RecommendResult> => ({
    intro: '',
    items: [],
    error: 'مساعدة التسوق غير متاحة حاليًا.',
  }))