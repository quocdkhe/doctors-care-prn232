"use server";

import { revalidateTag } from "next/cache";

/**
 * Server action to revalidate one or more Next.js cache tags.
 * Use this from client components after successful data mutations (create/update/delete).
 * 
 * @param tags A single tag string or an array of tag strings to revalidate.
 */
export async function revalidateTagsAction(tags: string | string[]) {
  if (Array.isArray(tags)) {
    tags.forEach((tag) => revalidateTag(tag, "max"));
  } else {
    revalidateTag(tags, "max");
  }
}
