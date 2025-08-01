// src/Blog.jsx
import React from 'react';
import { Link } from 'react-router-dom';

// This special Vite function finds and imports all your .mdx files
const posts = import.meta.glob('../content/posts/*.mdx', { eager: true });

export default function Blog() {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-6">Blog Posts</h1>
      <div className="space-y-6">
        {Object.entries(posts).map(([path, post]) => {
          // This gets the filename (e.g., 'first-post') to use in the URL
          const slug = path.split('/').pop().replace('.mdx', '');

          return (
            <div key={slug}>
              <Link to={`/blog/${slug}`} className="text-2xl font-semibold text-primary hover:underline">
                {post.frontmatter.title}
              </Link>
              <p className="text-sm text-text-secondary mt-1">
                Published on: {new Date(post.frontmatter.date).toLocaleDateString()}
              </p>
            </div>
          );
        })}
      </div>
    </div>
  );
}