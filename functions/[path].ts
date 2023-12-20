import { Env, getSanity } from "./index.js";

const exclude_list = [
	"/style.css"
]

export const onRequest: PagesFunction<Env> = async (ctx) => {
	const { params } = ctx
	let { path } = params
	path = "/" + path;

	
	if (exclude_list.includes(path)) {
		return await ctx.next();
	}

	const sanityClient = getSanity(ctx.env.SANITY_PROJECT_ID, ctx.env.SANITY_TOKEN);
	const link = await sanityClient.fetch(
		`*[_type == "link" && path == $path]`,
		{ path }
	).then((res) => res[0]);
	
	// Redirect to page if it exists
	if (link) {
		return new Response(null, {
			status: 302,
			headers: {
				Location: link.url,
			},
		});
	} else {
		return await ctx.next();
	}
}