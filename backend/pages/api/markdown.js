import fs from "fs";
import path from "path";
import matter from "gray-matter";

export default function handler(req, res) {
  const { slug } = req.query; // 读取 slug 参数

  if (!slug) {
    return res.status(400).json({ error: "Missing slug parameter" });
  }

  const filePath = path.join(process.cwd(), "markdowns", `${slug}.md`);
  if (!fs.existsSync(filePath)) {
    return res.status(404).json({ error: "Markdown file not found" });
  }

  const fileContent = fs.readFileSync(filePath, "utf-8");
  const { data: metadata, content } = matter(fileContent); // 解析元数据和正文

  res.status(200).json({
    slug,
    metadata, // 返回元数据
    content,  // 返回正文
  });
}
