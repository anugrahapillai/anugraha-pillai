import { firestorePosts, firestorePosters, firestoreResearch } from "@/lib/repositories/firestore-adapters";

export const revalidate = 3600; // Cache sitemap for 1 hour

export default async function sitemap() {
  const baseUrl = process.env.NEXT_PUBLIC_SITE_URL ?? "https://anugrahapillai.com";

  // Static routes
  const staticRoutes = ["", "/blogs", "/posters", "/research"].map((path) => ({
    url: `${baseUrl}${path}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "daily",
    priority: path === "" ? 1.0 : 0.8,
  }));

  try {
    // Fetch dynamic routes from Firestore in parallel
    const [postsRes, postersRes, researchRes] = await Promise.all([
      firestorePosts.list({ state: "published" }),
      firestorePosters.list({ state: "published" }),
      firestoreResearch.list({ state: "published" }),
    ]);

    const publishedPosts = (postsRes.items || []).filter((i) => i.status === "published" || !i.status);
    const publishedPosters = (postersRes.items || []).filter((i) => i.status === "published" || !i.status);
    const publishedResearch = (researchRes.items || []).filter((i) => i.status === "published" || !i.status);

    const dynamicPosts = publishedPosts
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${baseUrl}/blogs/${item.slug}`,
        lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()).toISOString(),
        changeFrequency: "weekly",
        priority: 0.6,
      }));

    const dynamicPosters = publishedPosters
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${baseUrl}/posters/${item.slug}`,
        lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()).toISOString(),
        changeFrequency: "weekly",
        priority: 0.6,
      }));

    const dynamicResearch = publishedResearch
      .filter((item) => item.slug)
      .map((item) => ({
        url: `${baseUrl}/research/${item.slug}`,
        lastModified: new Date(item.updatedAt || item.publishedAt || Date.now()).toISOString(),
        changeFrequency: "weekly",
        priority: 0.6,
      }));

    return [...staticRoutes, ...dynamicPosts, ...dynamicPosters, ...dynamicResearch];
  } catch (error) {
    console.error("Failed to generate dynamic sitemap:", error);
    return staticRoutes;
  }
}
