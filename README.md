# json-flattener

`json-flattener` is a tiny, single‑binary CLI written in TypeScript (Bun) that reads JSON from **stdin** or a file and prints each leaf value as a `path = value` line.

## Install (Bun)
```bash
bun install -g json-flattener
```

## Usage
```bash
# pipe JSON
cat data.json | json-flattener

# or pass a file
json-flattener data.json
```

## Features
- No runtime dependencies – compiled to a single binary.
- Fast cold‑start with Bun.
- Robust UTF‑8 string handling.
- Works on Windows, macOS, Linux.

## License
MIT
