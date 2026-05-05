# Sequence Diagram - JWT Authenticated Action

End-to-end flow of a single score-earning action: from the client's
HTTP request through validation, durability, ranking update, and the
conditional WebSocket broadcast to other connected clients.

The user is already authenticated; the JWT is in hand from a prior
auth flow (out of scope for this module).

[View on Mermaid Chart](https://mermaid.ai/d/f6cf2825-2c9a-4df5-a832-e33e17f3911f)

## What the diagram shows

- **Steps 1-2:** Client posts the action; API server verifies the JWT
  locally with a cached public key.
- **Step 3-4:** Rate-limit check on Redis. Excess submissions short-
  circuit with `429 RATE_LIMITED`.
- **Steps 5-7:** Insert into `score_events` with the
  `(user_id, idempotency_key)` unique constraint. Replays return
  `409 DUPLICATE_REQUEST`.
- **Steps 8-9:** Server resolves `actionType → points` from a
  server-side mapping. The client never supplies a numeric score.
- **Steps 10-12:** Snapshot top-10, apply `ZINCRBY`, snapshot again.
- **Step 13:** Respond `200` to the original request.
- **Steps 14-16:** Only when the top-10 actually changed, publish to
  Redis pub/sub. The WebSocket server consumes the message, debounces
  bursts within a 200 ms window, and broadcasts `leaderboard:update`
  to every connected client.
