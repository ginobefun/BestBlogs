# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

BestBlogs.dev is a content aggregation platform that curates high-quality articles from the fields of software development, artificial intelligence, product management, design, business technology, and personal growth. The platform uses AI-powered analysis to evaluate, summarize, and enhance content from 380+ RSS sources.

### Core Features
- Intelligent article analysis and scoring using large language models
- Multi-language support (Chinese/English) with automatic translation
- RSS aggregation from diverse tech sources (articles, podcasts, Twitter feeds)
- Weekly newsletter curation
- Open API for content access

## Repository Structure

This repository contains documentation and configuration files for the BestBlogs.dev platform:

- **Documentation**: Main README.md provides comprehensive project overview
- **RSS Sources**: OPML files containing subscription source lists
  - `BestBlogs_RSS_ALL.opml` - All 380 RSS sources
  - `BestBlogs_RSS_Articles.opml` - Article sources (200)
  - `BestBlogs_RSS_Podcasts.opml` - Podcast sources (30)
  - `BestBlogs_RSS_Twitters.opml` - Twitter sources (150)
- **API Documentation**: `BestBlogs_OpenAPI_Doc.md` - Complete OpenAPI specification
- **RSS Guide**: `BestBlogs_RSS_Doc.md` - RSS subscription parameters and usage
- **Implementation Details**: `/flows/Dify/` - Detailed analysis workflows and DSL files
- **Process Documentation**: `/docs/` - Technical implementation explanations

## Key Workflows

### Article Analysis Pipeline
The platform uses Dify Workflows for intelligent content processing:

1. **Article Crawling**: RSS-based content collection with full-text extraction
2. **Initial Filtering**: Language and quality-based preliminary scoring
3. **Deep Analysis**: AI-powered comprehensive analysis including:
   - One-sentence summaries
   - Detailed abstracts
   - Key point extraction
   - Quote identification
   - Domain classification
   - Quality scoring (0-100)
4. **Multi-language Translation**: Automatic content translation with optimization

### Content Categories
- `Artificial_Intelligence`: AI models, development, products, news
- `Business_Tech`: Business technology and market analysis
- `Programming_Technology`: Software development and engineering
- `Product_Development`: Product design and management

## API Integration

The platform provides comprehensive OpenAPI endpoints for:
- Source management (`/openapi/v1/source/*`)
- Newsletter management (`/openapi/v1/newsletter/*`) 
- Resource content (`/openapi/v1/resource/*`)

All endpoints require API key authentication via `X-API-KEY` header.

## Technical Stack

- **AI Processing**: Dify Workflow platform with GPT-4o integration
- **Content Sources**: 380+ RSS feeds across technology domains
- **Languages**: Chinese and English with automatic translation
- **Output Formats**: RSS feeds, newsletters, API responses

## Development Notes

Since this is primarily a documentation and configuration repository:
- No build commands are required
- Content is managed through markdown files and OPML configurations
- Changes to RSS sources should update the corresponding OPML files
- API documentation changes should be reflected in the OpenAPI specification
- Workflow modifications should update DSL files in `/flows/Dify/dsl/`

## Content Management

When updating content:
- Follow the established documentation structure
- Maintain consistency between Chinese and English versions
- Update relevant OPML files when adding/removing RSS sources
- Ensure API documentation stays synchronized with actual implementation