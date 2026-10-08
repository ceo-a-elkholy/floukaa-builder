import { createFileRoute, Link } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { Gift, ShieldCheck, Truck } from "lucide-react";
import { Button } from "@/components/ui/button";
import { ProductCard } from "@/components/store/product-card";
import { getProducts, type ShopifyProduct } from "@/lib/shopify";
import { CATEGORIES } from "@/lib/categories";
import { meta } from "@/lib/seo";
import hero from "@/assets/hero.jpg";

export const Route = createFileRoute("/")({
  head: () => meta("Floukaa — فلوكة للإكسسوارات والهدايا", "سلاسل، أساور، حلقان وخلاخيل بتصميمات جديدة. شحن لجميع محافظات مصر."),
  component: Index,
});

const tabs = [["وصل حديثًا", "tag:new"], ["متميز", "tag:featured"], ["الكل", ""]] as const;

function Index() {
  const [tab, setTab] = useState(0);
  const [products, setProducts] = useState<ShopifyProduct[] | null>(null);
  useEffect(() => {
    setProducts(null);
    void getProducts(10, tabs[tab]?.[1] || undefined).then(setProducts).catch(() => setProducts([]));
  }, [tab]);

  return (
    <>
      <section className="relative overflow-hidden">
        <img src={hero} alt="إكسسوارات فلوكة" width={1920} height={1088} className="h-[70vh] min-h-[420px] w-full object-cover" />
        <div className="absolute inset-0 flex items-center">
          <div className="mx-auto w-full max-w-[1400px] px-6">
            <div className="max-w-md">
              <p className="text-xs font-bold tracking-[0.3em] text-accent">NEW EXCLUSIVE COLLECTION</p>
              <h1 className="mt-4 text-4xl font-black leading-tight sm:text-6xl">تشكيلة صيفية جديدة</h1>
              <p className="mt-4 text-muted-foreground">تصميمات حصرية مستوحاة من البحر، مختارة بذوق لكل مناسبة.</p>
              <Button asChild size="lg" className="mt-8"><Link to="/shop">تسوقي الآن</Link></Button>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 py-16 sm:px-6">
        <div className="mb-8 text-center">
          <p className="text-xs font-bold text-accent">تشكيلات جديدة صيفية</p>
          <h2 className="mt-2 text-3xl font-black">تسوقي حسب القسم</h2>
        </div>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {CATEGORIES.filter((c) => c.img).map((c) => (
            <Link key={c.slug} to="/category/$slug" params={{ slug: c.slug }} className="group block">
              <div className="aspect-square overflow-hidden bg-muted">
                <img src={c.img} alt={c.title} loading="lazy" className="size-full object-cover transition duration-500 group-hover:scale-105" />
              </div>
              <p className="mt-3 text-center text-lg font-black">{c.title}</p>
            </Link>
          ))}
        </div>
      </section>

      <section className="mx-auto max-w-[1400px] px-4 sm:px-6">
        <div className="mb-8 flex flex-wrap items-center justify-center gap-2">
          {tabs.map(([l], i) => (
            <Button key={l} variant={i === tab ? "default" : "ghost"} onClick={() => setTab(i)}>{l}</Button>
          ))}
        </div>
        {products === null ? (
          <div className="grid grid-cols-2 gap-4 md:grid-cols-5">{Array.from({ length: 5 }, (_, i) => <div key={i} className="aspect-[4/5] animate-pulse bg-muted" />)}</div>
        ) : (
          <div className="grid grid-cols-2 gap-x-3 gap-y-8 md:grid-cols-3 lg:grid-cols-5">{products.map((p) => <ProductCard key={p.id} product={p} />)}</div>
        )}
        <div className="mt-10 text-center"><Button asChild variant="outline"><Link to="/shop">عرض كل المنتجات</Link></Button></div>
      </section>

      <section className="mx-auto mt-20 grid max-w-[1400px] gap-6 px-4 sm:px-6 md:grid-cols-3">
        {[[Truck, "شحن لكل مصر", "توصيل لجميع المحافظات"], [Gift, "تغليف هدايا", "جاهزة تتهادى على طول"], [ShieldCheck, "استبدال سهل", "خلال 14 يوم من الاستلام"]].map(([I, t, d]) => {
          const Icon = I as typeof Truck;
          return (
            <div key={t as string} className="flex items-center gap-4 border border-border bg-card p-6">
              <Icon className="size-8 text-accent" />
              <div><p className="font-black">{t as string}</p><p className="text-sm text-muted-foreground">{d as string}</p></div>
            </div>
          );
        })}
      </section>
    </>
  );
}
