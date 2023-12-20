import { createClient } from "@sanity/client"

export interface Env {
	SANITY_PROJECT_ID: string
	SANITY_TOKEN: string
}

export const getSanity = (SANITY_PROJECT_ID, SANITY_TOKEN) => {
	return createClient({
		projectId: SANITY_PROJECT_ID,
		dataset: "production",
		useCdn: true,
		token: SANITY_TOKEN,
		perspective: "published",
		apiVersion: "2022-03-07",
	})
}

export const onRequest: PagesFunction<Env> = async (ctx) => {
	const sanityClient = getSanity(ctx.env.SANITY_PROJECT_ID, ctx.env.SANITY_TOKEN);
	const allLinks = await sanityClient.fetch(
		`*[_type == "link" && public != false] { path, url }`
	);
	const links = allLinks.sort(() => Math.random() - 0.5).slice(0, 10);

	const response = await ctx.next();

	const html = await response.text();

	const newHtml = html.replace("<!--links-->", links.map((link) => `<a class="path" target="_blank" href="${link.url}">${link.path.slice(1)}</a>`).join("") + `<a class="path" target="_blank" href="${links[0].url}">${links[0].path.slice(1)}</a>` + `<a class="path" target="_blank" href="${links[1].url}">${links[1].path.slice(1)}</a>`);

	return new Response(newHtml, response);
}