# libsql-stateless

> Thin libSQL stateless HTTP driver for TypeScript and JavaScript for the edge 🚀
- ✅ **Supported runtime environments:** Web API (browser, serverless), Bun, Node.js (>=18)
- ✅ **Extremely thin:** Has no dependency, only has a few functions that implement the [`Hrana v3 HTTP`](https://github.com/tursodatabase/libsql/blob/main/libsql-server/docs/HRANA_3_SPEC.md) protocol from scratch, and has no classes (tend to duplicate memory and/or perform long memory traversals).
- ✅ **Does no extra computation.**
- ✅ **Has no premature optimizations.**
- ✅ **Is extremely light:** 1.15kB (unpacked)* / 548B (gzipped)
- ✅ Unlike `@libsql/client/web`, **every function performs complete execution in exactly 1 roundtrip.**
- ✅ **Is built for:** Quick stateless query execution. (Mainly for serverless and edge functions.)
- ✅ **Supports everything in** `@libsql/client/web`
- ⚠️ **Interactive transactions are not supported** because this lib is stateless but [`transactions`](https://github.com/DaBigBlob/libsql-stateless/wiki/transactions) are supported.
- ⚠️ **The API provided by `libsql-stateless` is raw and explicit** for reducing (computational and memory) overheads.

\* The actual js that is included with your project. (Excluding the type definitions and 2 copies of the main js for esm and cjs. (because you're gonna use one of them))
<br>

**For easier DX, consider using [`libsql-stateless-easy`](https://github.com/DaBigBlob/libsql-stateless-easy) instead**: it, however, comes with the cost of non-zero-dependency and (computational and memory) overheads potentially unneeded by you. But is still very very very slim compared to `@libsql/client`.

# Why not just use `@libsql/client/web`?
1. Not everyone needs stateful DB connection or the overheads that come with it.
2. To provide a simpler API, `@libsql/client/web` does a lot of, I'd argue unnecessary, computation under the hood.\
    Many people would rather use a more complex API than have worse performance.

# Installation
```sh
$ npm i libsql-stateless #pnpm, yarn, etc.
# or
$ bun add libsql-stateless
```

# Goto [`WIKI`](https://github.com/DaBigBlob/libsql-stateless/wiki) for  Specifications and Examples

## API Level
> NOTE: <unix_epoch_miliseconds>-HRANA_3_SPEC.md is the current API level.  
Downloaded from: https://github.com/tursodatabase/libsql/blob/main/docs/HRANA_3_SPEC.md at <unix_epoch_miliseconds>.  
Servers using older API levels may not be compatible. In that case downgrade to an earlier of this package.