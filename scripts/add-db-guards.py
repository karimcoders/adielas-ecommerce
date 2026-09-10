#!/usr/bin/env python3
"""Insert requireDb() guard at the top of every DB-touching API handler."""
import re, pathlib

BASE = pathlib.Path("/home/z/my-project/src/app/api")

# route file -> list of handler names to guard
TARGETS = {
    "auth/login/route.ts": ["POST"],
    "auth/register/route.ts": ["POST"],
    "auth/me/route.ts": ["GET"],
    "orders/route.ts": ["POST", "GET"],
    "orders/[id]/route.ts": ["GET", "PATCH"],
    "coupons/route.ts": ["GET", "POST"],
    "coupons/[id]/route.ts": ["PATCH", "DELETE"],
    "coupons/validate/route.ts": ["POST"],
    "admin/products/route.ts": ["POST", "GET"],
    "admin/products/[id]/route.ts": ["PATCH", "DELETE"],
    "admin/customers/route.ts": ["GET"],
    "admin/stats/route.ts": ["GET"],
    "account/addresses/route.ts": ["GET", "POST"],
    "account/addresses/[id]/route.ts": ["PATCH", "DELETE"],
    "account/profile/route.ts": ["PATCH"],
    "cms/route.ts": ["PATCH", "DELETE"],  # GET stays open (defaults fallback)
}

GUARD = (
    "  const denied = requireDb();\n"
    "  if (denied) return denied;\n\n"
)
IMPORT = 'import { requireDb } from "@/lib/api-guard";\n'

fn_re = re.compile(r"(export async function (\w+)\([^)]*\) \{\n)")

for rel, handlers in TARGETS.items():
    path = BASE / rel
    src = path.read_text()
    changed = []

    def repl(m):
        name = m.group(2)
        if name in handlers and "requireDb()" not in m.group(1):
            changed.append(name)
            return m.group(1) + GUARD
        return m.group(0)

    out = fn_re.sub(repl, src)
    if changed and IMPORT not in out:
        out = IMPORT + out
    path.write_text(out)
    print(f"{rel}: guarded {changed}")
