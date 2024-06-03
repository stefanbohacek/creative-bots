import fetch from "node-fetch";

export default async (query) => {
  const apiUrl = `https://query.wikidata.org/sparql?query=${encodeURIComponent(
    query
  )}&format=json`;
  const resp = await fetch(apiUrl);
  const respJSON = await resp.json();
  let items = respJSON?.results?.bindings || [];

  if (items && items.length) {
    items = items
      .map((item) => {
        const wikidataId = item.item.value.split("/entity/")[1];
        const wikipediaUrl =
          item?.article?.value || `https://www.wikidata.org/wiki/${wikidataId}`;

        let image = "";
        let imageUrl = "";

        if (item?.image?.value) {
          image = item.image.value.split(
            "http://commons.wikimedia.org/wiki/Special:FilePath/"
          )[1];
          imageUrl = `https://commons.wikimedia.org/w/index.php?title=Special:Redirect/file/${image}&width=410`;
        }

        return {
          label: item.itemLabel.value || "",
          description: item.itemDescription.value || "",
          wikipediaUrl: wikipediaUrl,
          image: imageUrl,
          lat: item?.lat?.value || "",
          long: item?.lon?.value || "",
        };
      })
      .filter((item) => item.image && (item.label || item.description));
  }
  return items;
};
