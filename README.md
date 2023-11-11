# libsql-stateless

> Thin libSQL stateless HTTP driver for TypeScript and JavaScript for the edge 🚀
- ✅ **Supported runtime environments:** Web API (browser, serverless), Bun, Node.js (>=18)
- ✅ **Extremely thin:** Has no dependency, only has a few functions that implement the [`Hrana v3 HTTP`](https://github.com/tursodatabase/libsql/blob/main/libsql-server/docs/HRANA_3_SPEC.md) protocol from scratch, and has no classes (tend to duplicate memory and/or perform long memory traversals).
- ✅ **Does no extra computation.**
- ✅ **Has no premature optimizations.**
- ✅ **Is built for:** Quick stateless query execution. (Mainly for serverless and edge functions.)
- ⚠️ Supports everything in `@libsql/client` **except (explicit) `transactions` and local or in-memory DBs.**
- ⚠️ **The API provided by `libsql-stateless` is raw and explicit** for reducing (computational and memory) overheads.
- ✅ **For easier DX, consider using [`libsql-stateless-easy`](https://github.com/DaBigBlob/libsql-stateless-easy)** however this comes at the cost of non-zero-dependency and (computational and memory) overheads potentially unneeded by you. But is still very very very slim compared to `@libsql/client`.

# Why not just use `@libsql/client`?
1. Not everyone needs stateful DB connection or the overheads that come with it.
2. To provide a simpler API, `@libsql/client` does a lot of, I'd argue, unnecessary computation under the hood.\
    Many people would rather use a more complex API than have worse performance.

# Installation
```sh
$ npm i libsql-stateless
# or
$ bun add libsql-stateless
```

# Goto [`WIKI`](https://github.com/DaBigBlob/libsql-stateless/wiki) for  Specifications and Examples

# TODO
- Switch to protobuf from json? (not really needed if not reading thousands of rows/s)
- Finding the purpose of my existence.

# Special Thanks
- The Voices in my Head