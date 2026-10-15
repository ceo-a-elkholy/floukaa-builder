<!-- LOVABLE:BEGIN -->
> [!IMPORTANT]
> This project is connected to [Lovable](https://lovable.dev). Avoid rewriting
> published git history — force pushing, or rebasing/amending/squashing commits
> that are already pushed — as it rewrites history on Lovable's side and the
> user will likely lose their project history.
>
> Commits you push to the connected branch sync back to Lovable and show up in
> the editor, so keep the branch in a working state.
<!-- LOVABLE:END -->

- Products, cart and checkout come from the Shopify Storefront API (src/lib/shopify.ts); wishlist is local to the browser. Why: Shopify is the store backend carried over from the GitHub project.

- Uploaded storefront presentation uses shared Motion helpers and catalog controls; data adapters must keep the Shopify cart and checkout intact. Why: preserve complete multi-item payment behavior.
- Shopping recommendations execute through a server function and use only actual Shopify catalog handles. Why: keep credentials private and prevent invented products.
