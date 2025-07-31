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
      const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
      const owner = 'LucasKronenfeld'; // Your GitHub username
      const repo = 'website-portfolio'; // Your repo name
      const branch = 'featuresAdmin'; // The branch you're working on

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

  return res.status(405).json({ message: 'Method Not Allowed' });
}