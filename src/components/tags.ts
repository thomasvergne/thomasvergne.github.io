import type { CollectionEntry } from "astro:content";

export function getAllTags(posts: CollectionEntry<'blog'>[]) {
  const tags = new Set<string>();

  posts.forEach((post) => {
    post.data.tags.forEach((tag) => tags.add(tag));
  });

  return Array.from(tags);
}