---
source: Context7 API + Official docs
library: canvas-confetti
package: canvas-confetti
topic: reduced-motion compatibility and user-action bursts
fetched: 2026-02-06T00:00:00Z
official_docs: https://github.com/catdad/canvas-confetti/blob/master/README.md
---

## Reduced-motion compatibility

- Use `disableForReducedMotion: true` to disable confetti for users with `prefers-reduced-motion`.
- Default is currently `false`; maintainer notes this may change in a future major release.
- When disabled for reduced motion, the returned confetti promise resolves immediately.

```ts
confetti({
  particleCount: 120,
  spread: 70,
  origin: { y: 0.7 },
  disableForReducedMotion: true,
});
```

## Triggering bursts on user actions (Astro)

- Attach handlers to explicit user actions (e.g., button click) in a client `<script>`.
- Dynamic import is useful if confetti is only needed after interaction.

```astro
<button data-celebrate>Celebrate</button>

<script>
  const button = document.querySelector("[data-celebrate]");

  button?.addEventListener("click", async () => {
    const { default: confetti } = await import("canvas-confetti");

    confetti({
      particleCount: 90,
      spread: 60,
      startVelocity: 35,
      origin: { y: 0.7 },
      disableForReducedMotion: true,
    });
  });
</script>
```

## Caveats

- High particle counts and long-running loops can impact performance on low-end devices.
- If using `confetti.create(canvas, { useWorker: true })`, do not reuse that canvas on the main thread.
- For repetitive bursts, tune `particleCount`/`spread` conservatively instead of continuous high-frequency firing.

Sources:

- https://context7.com/api/v2/context?libraryId=/catdad/canvas-confetti
- https://raw.githubusercontent.com/catdad/canvas-confetti/master/README.md
