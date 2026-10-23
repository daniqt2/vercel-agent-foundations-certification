import { Sandbox } from "@vercel/sandbox";

export const SANDBOX_NAME = "admin-agent-sandbox";

export const createOrGetSandbox = async (name: string) => {
  try {
    const sandbox = await Sandbox.get({ name });
    return sandbox;
  } catch {
    const sandbox = await Sandbox.create({
      name,
      // persistent: true is the beta default; auto-snapshots on stop, auto-resumes on next get
      snapshotExpiration: 7 * 24 * 60 * 60 * 1000, // 7 days
      timeout: 2700000, // 45 minutes
    });
    return sandbox;
  }
};

// Manual snapshot test
export const createSandboxFromSnapshot = async (snapshotId: string) => {
  const sandbox = await Sandbox.create({
    source: { type: "snapshot", snapshotId },
    persistent: false, // throwaway: don't auto-snapshot when it stops
    timeout: 5 * 60 * 1000, // 5 minutes
  });
  return sandbox;
};
