// Computes pace (time per unit distance) from raw stored metrics —
// independent of the user's display unit preference, so it stays
// consistent even if they change settings later.
// Lower is better: lets us compare speed across different distances,
// unlike comparing raw duration only when the distance happens to match.
export function estimatePace(distance, duration) {
  if (distance == null || duration == null || distance <= 0 || duration <= 0) {
    return null;
  }

  return duration / distance;
}