import { writeFile } from "node:fs";
import { getSanity } from "./functions";
import "dotenv/config";

interface Link {
	path: string;
	url: string;
}

const generateRedirects = async () => {
	const sanity = getSanity(process.env.SANITY_PROJECT_ID, process.env.SANITY_TOKEN);
	let redirectFileString = ``;
	
	const allLinks: Link[] = await sanity.fetch(
		`*[_type == "link" && public != false] { path, url }`
	);

	for (const link of allLinks) {
		redirectFileString += `${link.path}	${link.url}	302\n`;
	}

	await writeFile("src/_redirects", redirectFileString, (err) => {
		if (err) {
			console.error(err);
		}
	});
};

generateRedirects();