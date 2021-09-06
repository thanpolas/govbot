curl -X POST localhost:6969/snapshot-webhook -H "Content-Type: application/json" -d '{"id": "proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN", "event": "proposal/start", "space": "uniswap", "expire": 1620947058}'

curl -X POST localhost:6969/snapshot-webhook -H "Content-Type: application/json" -d '{"id": "proposal/QmQbcxLpGENeDauCAsh3BXy9H9fiiK46JEfnLqG3s8iMbN", "event": "proposal/end", "space": "uniswap", "expire": 1620947058}'
