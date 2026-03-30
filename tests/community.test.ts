import { describe, expect, it } from "vitest";
import { parseRedditListing } from "@/src/sources/community";

describe("parseRedditListing", () => {
  it("normalizes reddit post data", () => {
    const posts = parseRedditListing({
      data: {
        children: [
          {
            data: {
              title: " New model rumor ",
              selftext: " speculative details ",
              permalink: "/r/LocalLLaMA/comments/abc123/new_model_rumor/",
              score: 321,
              created_utc: 1_711_676_800,
              subreddit: "LocalLLaMA",
              url: "https://example.com/post",
            },
          },
        ],
      },
    });

    expect(posts).toEqual([
      {
        title: "New model rumor",
        body: "speculative details",
        permalink: "https://www.reddit.com/r/LocalLLaMA/comments/abc123/new_model_rumor/",
        score: 321,
        created_at: "2024-03-29T01:46:40.000Z",
        subreddit: "LocalLLaMA",
        url: "https://example.com/post",
      },
    ]);
  });
});
