import React, { useState } from "react";
import Head from "next/head";
import { Inter } from "next/font/google";
import styles from "@/styles/Home.module.css";
import axios from "axios";

const inter = Inter({ subsets: ["latin"] });

export default function Home() {
	const [view, setView] = useState("novel");
	const [novelId, setNovelId] = useState("");
	const [genre, setGenre] = useState("harem");
	const NovelComp = () => {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const id = (document.getElementById("id") as HTMLInputElement).value;
					const title = (document.getElementById("title") as HTMLInputElement).value;
					const author = (document.getElementById("author") as HTMLInputElement).value;
					const imageUrl = (document.getElementById("image-url") as HTMLInputElement).value;
					const description = (document.getElementById("description") as HTMLInputElement).value;
					const genrePick = genre;
					const data = { id, title, author, imageUrl, description, genre: genrePick };

					axios
						.post("https://novel-app-server.vercel.app/api/v1/novels", data)
						.then((res) => {
							setNovelId(res.data._id);
							console.log(res);
						})
						.catch((e) => {
							console.log(e);
						});
				}}
			>
				<section className={styles.section}>
					<h1>Genre</h1>
					<select name='genre' id='genre' onChange={(e) => setGenre(e.target.value)}>
						<option value='harem'>Harem</option>
						<option value='green'>Green</option>
					</select>
				</section>
				<section className={styles.section}>
					<h1>Id</h1>
					<input type='text' id='id' name='id' className={styles.input} />
				</section>
				<section className={styles.section}>
					<h1>Title</h1>
					<input type='text' id='title' name='title' className={styles.input} />
				</section>
				<section className={styles.section}>
					<h1>Author</h1>
					<input type='text' id='author' name='author' className={styles.input} />
				</section>
				<section className={styles.section}>
					<h1>Image Url</h1>
					<input type='text' id='image-url' name='image-url' className={styles.input} />
				</section>
				<section className={styles.section}>
					<h1>Description</h1>
					<input type='text' id='description' name='description' className={styles.input} />
				</section>
				<button type='submit' className={styles.button}>
					Submit
				</button>
			</form>
		);
	};

	const ChapterComp = () => {
		return (
			<form
				onSubmit={(e) => {
					e.preventDefault();
					const novel_id = (document.getElementById("novel-id") as HTMLInputElement).value;
					const title = (document.getElementById("title") as HTMLInputElement).value;
					const content = (document.getElementById("content") as HTMLInputElement).value;

					function stringToArrayWithNewline(largeString: string) {
						// Normalize spaces
						const normalizedString = largeString.replace(/\u3000/g, " ");

						// Split the string into paragraphs
						const paragraphs = normalizedString.split(/\n\s*\n/);

						// Process each paragraph
						return paragraphs.flatMap((paragraph, index) => {
							// Trim each paragraph to remove leading/trailing whitespace
							paragraph = paragraph.trim();

							if (paragraph === "") {
								return ["\n"];
							}

							// Split dialogue and narrative
							const parts = paragraph.split(/(".*?")/).filter(Boolean);

							return parts.flatMap((part) => {
								if (part.startsWith('"') && part.endsWith('"')) {
									return [part.trim() + "\n"];
								} else {
									// Narrative: split into sentences, accounting for multiple space types
									const sentences = part
										.split(/(?<=[.!?])\s+(?=[A-Z])/)
										.map((sentence) => sentence.trim())
										.filter((sentence) => sentence !== "")
										.map((sentence) => sentence + "\n");
									return sentences;
								}
							});
						});
					}

					function stringToArrayOfStrings(inputString: string) {
						return [inputString];
					}

					const data = {
						novel_id,
						h4_content: stringToArrayOfStrings(title),
						p_content: stringToArrayWithNewline(content),
					};

					axios
						.post("https://novel-app-server.vercel.app/api/v1/chapters", data)
						.then((res) => {
							console.log(res);
						})
						.catch((e) => {
							console.log(e);
						});
				}}
			>
				<section className={styles.section}>
					<h1>Novel Id</h1>
					<input type='text' id='novel-id' name='novel-id' className={styles.input} />
				</section>
				<section className={styles.section}>
					<h1>Title</h1>
					<input type='text' id='title' name='title' className={styles.input} />
				</section>
				<section className={styles.section}>
					<h1>Content</h1>
					<input type='text' id='content' name='content' className={styles.input} />
				</section>
				<button type='submit' className={styles.button}>
					Submit
				</button>
			</form>
		);
	};
	return (
		<>
			<Head>
				<title>Create Next App</title>
				<meta name='description' content='Generated by create next app' />
				<meta name='viewport' content='width=device-width, initial-scale=1' />
				<link rel='icon' href='/favicon.ico' />
			</Head>
			<main className={styles.main}>
				<button onClick={() => setView("novel")}>Create Novel</button>
				<button onClick={() => setView("chapter")}>Create Chapter</button>
				<h1>{novelId}</h1>
				{view === "novel" ? <NovelComp /> : <ChapterComp />}
			</main>
		</>
	);
}
