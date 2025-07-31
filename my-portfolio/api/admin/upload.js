// api/admin/upload.js
import { Octokit } from '@octokit/rest';
import jwt from 'jsonwebtoken';
import busboy from 'busboy';

// Same JWT helper from posts.js
const authenticate = (req) => { /* ... */ };

// Vercel requires this config to handle streams
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req, res) {
  if (!authenticate(req)) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  const bb = busboy({ headers: req.headers });

  bb.on('file', (fieldname, file, { filename, mimeType }) => {
    const fileBuffers = [];
    file.on('data', (data) => {
      fileBuffers.push(data);
    });

    file.on('end', async () => {
      const finalBuffer = Buffer.concat(fileBuffers);
      const path = `public/uploads/${Date.now()}-${filename}`;

      try {
        const octokit = new Octokit({ auth: process.env.GITHUB_PAT });
        await octokit.rest.repos.createOrUpdateFileContents({
          owner: 'LucasKronenfeld',
          repo: 'website-portfolio',
          branch: 'feature/cms-refactor',
          path,
          message: `feat: upload image ${filename}`,
          content: finalBuffer.toString('base64'),
        });
        // Return the public URL of the image
        return res.status(201).json({ url: `/${path.replace('public/', '')}` });
      } catch (error) {
        console.error(error);
        return res.status(500).json({ message: 'Error uploading file to GitHub.' });
      }
    });
  });

  req.pipe(bb);
}