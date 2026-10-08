import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Heart, Minus, Plus, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { formatCurrency, getProduct, type ShopifyProduct } from "@/lib/shopify";
import { useCart } from "@/stores/cart";
import { useWishlist } from "@/stores/wishlist";

export const Route = createFileRoute("/product/$handle")({
  head: () => ({
    meta: [
      { title: "منتج — Floukaa" },
      { name: "description", content: "تفاصيل المنتج من فلوكة للإكسسوارات والهدايا." },
      { property: "og:title", content: "منتج — Floukaa" },
      { property: "og:description", content: "تفاصيل المنتج من فلوكة للإكسسوارات والهدايا." },
    ],
  }),
  component: ProductPage,
});

function ProductPage() {
  const { handle } = Route.useParams();
  const [p, setP] = useState<ShopifyProduct | null | undefined>(undefined);
  const [img, setImg] = useState(0);
  const [vi, setVi] = useState(0);
  const [qty, setQty] = useState(1);
  const add = useCart((s) => s.addItem);
  const busy = useCart((s) => s.busy);
  const wish = useWishlist();

  useEffect(() => {
    setP(undefined);
    void getProduct(handle).then(setP).catch(() => setP(null));
  }, [handle]);

  if (p === undefined)
    return <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 md:grid-cols-2"><div className="aspect-square animate-pulse bg-muted" /><div className="h-64 animate-pulse bg-muted" /></div>;
  if (!p)
    return <div className="py-24 text-center"><p className="text-muted-foreground">المنتج غير موجود.</p><Link to="/shop" className="mt-4 inline-block font-bold text-accent">رجوع للمتجر</Link></div>;

  const variants = p.variants.edges.map((e) => e.node);
  const v = variants[vi];
  const images = p.images.edges.map((e) => e.node);
  const liked = wish.items.some((i) => i.id === p.id);

  return (
    <div className="mx-auto grid max-w-[1200px] gap-10 px-4 py-10 sm:px-6 md:grid-cols-2">
      <div>
        <div className="aspect-square overflow-hidden bg-muted">
          {images[img] && <img src={images[img].url} alt={images[img].altText ?? p.title} className="size-full object-cover" />}
        </div>
        {images.length > 1 && (
          <div className="mt-3 flex gap-2">
            {images.map((im, i) => (
              <button key={im.url} onClick={() => setImg(i)} className={`size-20 overflow-hidden border-2 ${i === img ? "border-accent" : "border-transparent"}`}>
                <img src={im.url} alt="" className="size-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>
      <div>
        <p className="text-xs font-bold text-accent">{p.productType || "إكسسوارات"}</p>
        <h1 className="mt-2 text-3xl font-black">{p.title}</h1>
        <p className="mt-4 text-2xl font-extrabold">{v ? formatCurrency(v.price) : formatCurrency(p.priceRange.minVariantPrice)}</p>
        {variants.length > 1 && (
          <div className="mt-6 flex flex-wrap gap-2">
            {variants.map((x, i) => (
              <Button key={x.id} variant={i === vi ? "default" : "outline"} size="sm" onClick={() => setVi(i)}>{x.title}</Button>
            ))}
          </div>
        )}
        <div className="mt-8 flex gap-3">
          <div className="flex items-center border border-border">
            <Button size="icon" variant="ghost" onClick={() => setQty(qty + 1)} aria-label="زيادة"><Plus className="size-4" /></Button>
            <span className="w-8 text-center font-bold">{qty}</span>
            <Button size="icon" variant="ghost" onClick={() => setQty(Math.max(1, qty - 1))} aria-label="تقليل"><Minus className="size-4" /></Button>
          </div>
          <Button variant="accent" className="flex-1" disabled={!v || busy || !v.availableForSale}
            onClick={() => v && add({ product: p, variantId: v.id, variantTitle: v.title, price: v.price, quantity: qty, selectedOptions: v.selectedOptions })}>
            {v?.availableForSale === false ? "غير متوفر" : "أضيفي للسلة"}
          </Button>
          <Button size="icon" variant="outline" onClick={() => wish.toggle(p)} aria-label="المفضلة">
            <Heart className={liked ? "size-5 fill-accent text-accent" : "size-5"} />
          </Button>
        </div>
        <p className="mt-6 flex items-center gap-2 text-sm text-muted-foreground"><Truck className="size-4" /> شحن لجميع محافظات مصر</p>
        {p.description && <p className="mt-8 leading-8 text-muted-foreground">{p.description}</p>}
      </div>
    </div>
  );
}
