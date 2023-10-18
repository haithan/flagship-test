import "@shopify/shopify-api/adapters/node";
import { shopifyApi, ApiVersion } from "@shopify/shopify-api";
import { restResources } from "@shopify/shopify-api/rest/admin/2023-04";

const shopify = shopifyApi({
  apiSecretKey: 'a7c1f804fdfea415d1442d32a6cce662',
  apiVersion: ApiVersion.October23,
  isCustomStoreApp: true,
  adminApiAccessToken: "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",
  isEmbeddedApp: false,
  hostName: "bundle-hobby.myshopify.com",
  restResources,
});

const productId = '8768806813991';
const owner_id = '8768868942119';
const namespace = 'global';
const key = 'test';

async function main() {
  try {
    const session = shopify.session.customAppSession("bundle-hobby.myshopify.com");

    const metafields = await shopify.rest.Metafield.all({
      session: session,
      metafield: {"owner_id": owner_id, "owner_resource": "product"},
    });

    if(metafields.data.length > 0) {
      const metafield = metafields.data[0];

      const updateMetafield = new shopify.rest.Metafield({session: session});
      updateMetafield.product_id = productId;
      updateMetafield.id = metafield.id;
      updateMetafield.value = Number(metafield.value) + 1;
      await updateMetafield.save({
        update: true,
      });
      console.log(`Updated metafield for product ${productId}`);
    } else {
      const newMetafield = new shopify.rest.Metafield({session: session});
      newMetafield.product_id = productId;
      newMetafield.namespace = namespace;
      newMetafield.key = key;
      newMetafield.type = "integer";
      newMetafield.value = "0";
      await newMetafield.save({
        update: true,
      });
      console.log(`Created metafield for product ${productId}`);
    }
  } catch (error) {
    console.error(error);
  }
}

main();