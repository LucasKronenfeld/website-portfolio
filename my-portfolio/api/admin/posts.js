import { Octokit } from '@octokit/rest';
import jwt from 'jsonwebtoken';

// Helper to verify JWT from the Authorization header
const authenticate = (req) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    if (!token || !process.env.JWT_SECRET) return false;
    jwt.verify(token, process.env.JWT_SECRET);
    return true;
  } catch (error) {
    return false;
  }
};

export default async function handler(req, res) {
  if (!authenticate(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
  const owner = 'LucasKronenfeld';
  const repo = 'website-portfolio';
  const branch = 'featuresAdmin';

  const postsPath = 'content/posts';

  if (req.method === 'GET') {
    try {
      const { slug } = req.query;
      if (slug) {
        const { data } = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: `${postsPath}/${slug}.mdx`,
          ref: branch,
        });
        const content = Buffer.from(data.content, 'base64').toString('utf8');
        return res.status(200).json({ content });
      }

      const { data } = await octokit.rest.repos.getContent({
        owner,
        repo,
        path: postsPath,
        ref: branch,
      });
      const posts = [];
      for (const file of data) {
        if (file.type !== 'file') continue;
        const slugName = file.name.replace('.mdx', '');
        const fileData = await octokit.rest.repos.getContent({
          owner,
          repo,
          path: file.path,
          ref: branch,
        });
        const raw = Buffer.from(fileData.data.content, 'base64').toString('utf8');
        const match = raw.match(/title:\s*"([^"]+)"/);
        const title = match ? match[1] : slugName;
        posts.push({ slug: slugName, title });
      }
      return res.status(200).json({ posts });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error fetching posts' });
    }
  }

  if (req.method === 'POST') {
    // Logic for creating a new post
    const { title, content } = req.body;
    if (!title || !content) {
      return res.status(400).json({ message: 'Title and content are required.' });
    }

    // Sanitize title to create a URL-friendly slug
    const slug = title.toLowerCase().replace(/\s+/g, '-').replace(/[^a-z0-9-]/g, '');
    const path = `content/posts/${slug}.mdx`;

    // Create MDX content with frontmatter
    const fileContent = `---
title: "${title}"
date: "${new Date().toISOString()}"
---

${content}`;

    try {
      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        branch,
        path,
        message: `feat: add new post '${title}'`,
        content: Buffer.from(fileContent).toString('base64'),
      });

      // Optional: Trigger a Vercel rebuild
      if (process.env.VERCEL_DEPLOY_HOOK) {
        fetch(process.env.VERCEL_DEPLOY_HOOK, { method: 'POST' });
      }

      return res.status(201).json({ message: 'Post created successfully!', path });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error committing file to GitHub.' });
    }
  }

  if (req.method === 'PUT') {
    const { slug, title, content } = req.body;
    if (!slug || !title || !content) {
      return res.status(400).json({ message: 'Slug, title and content are required.' });
    }

    const path = `${postsPath}/${slug}.mdx`;

    try {
      const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });
      const fileContent = `---\ntitle: "${title}"\ndate: "${new Date().toISOString()}"\n---\n\n${content}`;

      await octokit.rest.repos.createOrUpdateFileContents({
        owner,
        repo,
        branch,
        path,
        sha: data.sha,
        message: `feat: update post '${title}'`,
        content: Buffer.from(fileContent).toString('base64'),
      });

      if (process.env.VERCEL_DEPLOY_HOOK) {
        fetch(process.env.VERCEL_DEPLOY_HOOK, { method: 'POST' });
      }

      return res.status(200).json({ message: 'Post updated successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error updating post' });
    }
  }

  if (req.method === 'DELETE') {
    const { slug } = req.query;
    if (!slug) {
      return res.status(400).json({ message: 'Slug is required.' });
    }

    const path = `${postsPath}/${slug}.mdx`;

    try {
      const { data } = await octokit.rest.repos.getContent({ owner, repo, path, ref: branch });

      await octokit.rest.repos.deleteFile({
        owner,
        repo,
        branch,
        path,
        sha: data.sha,
        message: `feat: delete post '${slug}'`,
      });

      if (process.env.VERCEL_DEPLOY_HOOK) {
        fetch(process.env.VERCEL_DEPLOY_HOOK, { method: 'POST' });
      }

      return res.status(200).json({ message: 'Post deleted successfully!' });
    } catch (error) {
      console.error(error);
      return res.status(500).json({ message: 'Error deleting post' });
    }
  }

  return res.status(405).json({ message: 'Method Not Allowed' });
}