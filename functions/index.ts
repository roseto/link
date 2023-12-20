import { PagesFunction } from "@cloudflare/workers-types";

export const onRequest: PagesFunction = (ctx) => {
	const value = new URL(ctx.request.url).searchParams.get("value");

	return new Response(`Hello ${value}!`, {
		headers: { "content-type": "text/plain" },
	});
};