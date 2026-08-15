import { json, type LoaderFunctionArgs } from "@remix-run/node";
import { GITHUB_USERNAME, parseContributionsHtml } from "~/lib/gitContributions";

export const loader = async ({ request }: LoaderFunctionArgs) => {
  const url = new URL(request.url);
  const username = url.searchParams.get("user") || GITHUB_USERNAME;

  const res = await fetch(`https://github.com/users/${username}/contributions`, {
    headers: {
      "user-agent": "tirsonavarro.dev-terminal",
    },
  });

  if (!res.ok) {
    throw new Response(`Failed to load GitHub contributions (${res.status})`, { status: 502 });
  }

  const html = await res.text();
  const days = parseContributionsHtml(html);

  return json(
    { username, days },
    {
      headers: {
        "cache-control": "public, max-age=300, s-maxage=300",
      },
    },
  );
};