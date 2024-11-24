import { useRouter } from "next/router";
import fs from "fs";
import path from "path";

const baseUrl =
  process.env.NEXT_PUBLIC_API_BASE_URL || `https://${process.env.VERCEL_URL}`;

export default function MarkdownPage({ html, slug }) {
  const router = useRouter();

  if (router.isFallback) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h1>{slug}</h1>
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </div>
  );
}

export async function getStaticPaths() {
  const markdownDir = path.join(process.cwd(), "markdowns");
  const filenames = fs.readdirSync(markdownDir);
  const paths = filenames.map((filename) => ({
    params: { slug: filename.replace(/\.md$/, "") },
  }));

  return {
    paths,
    fallback: true, // 如果未预渲染的路径会进入 fallback 模式
  };
}

export async function getStaticProps({ params }) {
  const res = await fetch(`${baseUrl}/api/markdown?slug=${params.slug}`);
  const data = await res.json();

  if (!data.html) {
    return {
      notFound: true,
    };
  }

  return {
    props: {
      slug: params.slug,
      html: data.html,
    },
  };
}
