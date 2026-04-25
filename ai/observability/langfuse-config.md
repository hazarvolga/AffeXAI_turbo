# Langfuse Self-Hosted Configuration
# This file provides deployment configuration for Langfuse observability.
# Deploy via: docker compose -f ai/observability/docker-compose.langfuse.yml up -d

version: "3.8"

# NOTE: Langfuse is already included in infra/compose/docker-compose.dev.yml
# This file provides additional configuration for production deployment.

# Environment variables for Langfuse (set in .env or Coolify):
#
# LANGFUSE_PUBLIC_KEY=pk-xxx
# LANGFUSE_SECRET_KEY=sk-xxx
# LANGFUSE_BASE_URL=http://localhost:3100
#
# For @affex/ai-core, set these in your app's .env:
# LANGFUSE_PUBLIC_KEY=${LANGFUSE_PUBLIC_KEY}
# LANGFUSE_SECRET_KEY=${LANGFUSE_SECRET_KEY}
# LANGFUSE_HOST=http://localhost:3100

# Integration with @affex/ai-core:
#
# import { createLLMClient } from "@affex/ai-core";
#
# const client = createLLMClient({
#   provider: "openai",
#   model: "gpt-4o",
#   apiKey: process.env.OPENAI_API_KEY,
#   langfuseConfig: {
#     publicKey: process.env.LANGFUSE_PUBLIC_KEY,
#     secretKey: process.env.LANGFUSE_SECRET_KEY,
#     baseUrl: process.env.LANGFUSE_HOST,
#   },
# });
#
# All LLM calls will be traced in Langfuse dashboard.

# Production Langfuse setup:
# - Use managed Postgres for Langfuse DB
# - Set LANGFUSE_HOST to your Langfuse URL
# - Configure S3 backup for trace data
# - Set up regular pg_dump for the Langfuse database