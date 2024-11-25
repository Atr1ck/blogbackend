from flask import Flask, jsonify, request, render_template
import os
import frontmatter
from flask_cors import CORS

app = Flask(__name__)

CORS(app)

ARTICLES_FOLDER = "public/articles"

@app.route("/api/articles", methods=["GET"])
def list_articles():
    try:
        files = os.listdir(ARTICLES_FOLDER)
        markdown_files = [f for f in files if f.endswith(".md")]
        data = []
        for filename in markdown_files:
            with open (os.path.join(ARTICLES_FOLDER, filename), "r", encoding="UTF-8") as file:
                content = frontmatter.load(file)
                data.append(content.metadata)
        return jsonify({"articles": data}), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500
    
@app.route("/api/articles/<filename>", methods=["GET"])
def get_article(filename):
    try:
        filepath = os.path.join(ARTICLES_FOLDER, filename)
        if not os.path.exists(filepath) or not filename.endswith(".md"):
            return jsonify({"error": "File not found"}), 404
        
        # 读取 Markdown 文件
        with open(filepath, "r", encoding="utf-8") as file:
            content = frontmatter.load(file)  # 解析 Markdown 和元数据
            return jsonify({
                "metadata": content.metadata,  # 元数据部分
                "content": content.content    # Markdown 内容部分
            }), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 500

# 启动 Flask 应用
if __name__ == "__main__":
    app.run(debug=True)
