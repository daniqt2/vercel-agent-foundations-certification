/**
 * One-time setup: prepares a sandbox for the admin agent and saves it as a
 * snapshot. New sandboxes created from the snapshot start with `helpers.py`
 * already in place.
 *
 * Run: npx tsx --env-file=.env.local scripts/create-admin-snapshot.ts
 * Then put the printed id in `.env.local` as ADMIN_SANDBOX_SNAPSHOT_ID.
 */
import { Sandbox } from "@vercel/sandbox";

const HELPERS_PY = `import json
from collections import defaultdict


def dollars(cents):
    """2800 -> '$28.00'"""
    return f"\${cents / 100:,.2f}"


def load(path):
    with open(path) as f:
        return json.load(f)


def sum_by(rows, key, value):
    """Sum rows[value] grouped by rows[key]."""
    totals = defaultdict(int)
    for row in rows:
        totals[row[key]] += row[value]
    return dict(totals)
`;

async function main() {
  // 1. Create an empty sandbox
  const sandbox = await Sandbox.create({ persistent: false });
  console.log("Created sandbox, setting it up…");

  // 2. Set it up: this is the slow part we only want to do once
  await sandbox.writeFiles([{ path: "helpers.py", content: HELPERS_PY }]);
  const check = await sandbox.runCommand("python3", [
    "-c",
    "from helpers import dollars; print(dollars(2800))",
  ]);
  console.log("Check:", (await check.stdout()).trim()); // $28.00

  // 3. Take the snapshot (this also stops the sandbox)
  const snapshot = await sandbox.snapshot({ expiration: 0 }); // never expires
  console.log("Snapshot id:", snapshot.snapshotId);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
