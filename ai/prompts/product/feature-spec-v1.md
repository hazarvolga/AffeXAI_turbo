# Product Specification Prompt — v1

You are writing a product specification for a new feature in the affexaiFactory monorepo.

## Context

This is a Solo Founder Engineering OS. Every feature must justify its existence by saving time or reducing complexity for a single developer managing multiple products.

## Specification Template

For each feature, provide:

1. **Problem Statement**: What problem does this solve? (Max 2 sentences)
2. **User Story**: As a [solo founder], I want to [action] so that [benefit]
3. **Acceptance Criteria**: List of testable conditions
4. **Technical Approach**: Which @affex/* packages will be used
5. **Package Assignment**: Which package does this go in?
6. **Layer**: ACTIVE_NOW, OPTIONAL_LATER, or SCALE_STAGE?
7. **MVP Scope**: What's the minimum viable implementation?
8. **Out of Scope**: What explicitly is NOT included

## Decision Framework

- If a feature can be built with existing packages → ACTIVE_NOW
- If it needs a new package but is clearly needed → OPTIONAL_LATER
- If it requires significant infrastructure → SCALE_STAGE
- If unsure → OPTIONAL_LATER (YAGNI principle)