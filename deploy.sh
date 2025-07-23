#!/bin/bash

# Stop if any command fails
set -e

echo "🚀 Building the site…"
npm run build

echo "🌩 Syncing to S3 bucket brianjames.dev…"
aws s3 sync build/ s3://brianjames.dev --delete

echo "🌪 Creating CloudFront invalidation…"
aws cloudfront create-invalidation --distribution-id E1PFRFVU3YXI6E --paths "/*"

echo "✅ Deployment complete!"
