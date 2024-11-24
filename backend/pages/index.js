import fs from "fs";
import path from "path";
import Link from "next/link";

export default function Home({ articles }) {
  return (
    <div>
      <h1>Articles</h1>
      <ul>
        {articles.map((article) => (
          <li key={article.slug}>
            <Link href={`/markdown/${article.slug}`}>{article.title}</Link>
          </li>
        ))}
      </ul>
    </div>
  );
}

export async function getStaticProps() {
  const markdownDir = path.join(process.cwd(), "markdowns");
  const filenames = fs.readdirSync(markdownDir);

  const articles = filenames.map((filename) => ({
    slug: filename.replace(/\.md$/, ""),
    title: filename.replace(/\.md$/, "").replace(/-/g, " "),
  }));

  return {
    props: {
      articles,
    },
  };
}
