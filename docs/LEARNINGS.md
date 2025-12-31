# Learnings

## Liked

- Planned with Claude first and wrote to [`docs/plan.md`](plan.md) before getting started on any coding
- Felt fast (faster?) once swapping models from Haiku to Opus
- React+Vite setup had a great foundation for writing tests as we iterated along

## Learned

- When implementing feature, delegate a single worktree to a single branch to keep the slate tidy: https://github.com/francisfuzz/flipboarder/pull/1
  - This delegation especially helped when refactoring the encoding piece: https://github.com/francisfuzz/flipboarder/pull/2
- Bottleneck operation: Git commands. Delegated commit message writing to new skill, `conventional-commits`: https://github.com/francisfuzz/flipboarder/pull/3
- Adding theme toggle from scratch consumes a lot of tokens: https://github.com/francisfuzz/flipboarder/pull/4

## Lacked

- Accessible, configurable design system that already integrates with React
- More settings: configuration for timing, style of animation for flipping
- Needs more emojis 🥺

## Longed For

- A design system to use components liberally from rather than creating from scratch
- Another person to pair on and work and ideate with
