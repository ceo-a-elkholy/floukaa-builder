import { PRODUCT_FIELDS, storefrontApi, type ShopifyProduct } from './shopify'

export type CatalogParams = { page: number; perPage: number; sort: string; base?: string; category?: string; onSale?: boolean; minPrice?: number; maxPrice?: number; search?: string }

export async function fetchCatalog({ data: p }: { data: CatalogParams }) {
  const query = [p.base, p.category ? `tag:${JSON.stringify(p.category)}` : '', p.onSale ? 'tag:sale' : '', p.minPrice != null ? `variants.price:>=${p.minPrice}` : '', p.maxPrice != null ? `variants.price:<=${p.maxPrice}` : '', p.search ? p.search : ''].filter(Boolean).join(' AND ')
  const sortKey = p.sort === 'popular' ? 'BEST_SELLING' : p.sort === 'title' ? 'TITLE' : p.sort.startsWith('price') ? 'PRICE' : 'CREATED_AT'
  const reverse = p.sort === 'new' || p.sort === 'price-desc'
  const products: ShopifyProduct[] = []
  let after: string | null = null
  for (;;) {
    const d: { products: { edges: Array<{ node: ShopifyProduct }>; pageInfo: { hasNextPage: boolean; endCursor: string | null } } } | undefined = await storefrontApi(`query($query:String,$after:String,$sortKey:ProductSortKeys!,$reverse:Boolean!){products(first:250,query:$query,after:$after,sortKey:$sortKey,reverse:$reverse){edges{node{${PRODUCT_FIELDS}}}pageInfo{hasNextPage endCursor}}}`, { query, after, sortKey, reverse })
    if (!d) throw new Error('تعذر تحميل المنتجات')
    products.push(...d.products.edges.map(e => e.node))
    if (!d.products.pageInfo.hasNextPage || !d.products.pageInfo.endCursor) break
    after = d.products.pageInfo.endCursor
  }
  return { products: products.slice((p.page - 1) * p.perPage, p.page * p.perPage), total: products.length, totalPages: Math.max(1, Math.ceil(products.length / p.perPage)) }
}