// lib/db.ts
import { PrismaClient } from "@prisma/client";
import { PrismaNeon } from "@prisma/adapter-neon";

// ------------------------------
// ⚙️ 1. Neon Adapter
// ------------------------------
const connectionString = process.env.DATABASE_URL as string;
const adapter = new PrismaNeon({ connectionString });

// ------------------------------
// ⚙️ 2. Prisma Client Singleton
// ------------------------------
const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    adapter,
    log: ["error", "warn"], // Only errors and warnings
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}

// ------------------------------
// ⚙️ 3. Simple Retry + Timeout Wrapper
// ------------------------------
async function retryOperation<T>(
  fn: () => Promise<T>,
  retries = 2,
): Promise<T> {
  try {
    return await fn();
  } catch (err: any) {
    if (retries > 0 && err?.message?.includes("deadlock")) {
      console.warn("Deadlock detected — retrying...");
      return retryOperation(fn, retries - 1);
    }
    throw err;
  }
}

// ------------------------------
// ⚙️ 5. Timeout Handler
// ------------------------------
function timeout<T>(promise: Promise<T>, ms = 5000): Promise<T> {
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error("DB_TIMEOUT")), ms);
    promise.then(
      (res) => {
        clearTimeout(timer);
        resolve(res);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      },
    );
  });
}

// ------------------------------
// ⚙️ 4. DB Proxy Wrapper (Optional)
// ------------------------------
export const db = new Proxy(prisma, {
  get(target, prop) {
    const original = (target as any)[prop];
    if (typeof original !== "function") return original;

    return async (...args: any[]) => {
      try {
        const result = await retryOperation(() =>
          timeout(original.apply(target, args)),
        );
        return result;
      } catch (err) {
        const msg = (err as any)?.message || "";
        if (msg.includes("deadlock")) throw new Error("DB_DEADLOCK");
        if (msg.includes("timeout") || msg.includes("DB_TIMEOUT"))
          throw new Error("DB_TIMEOUT");
        return err;
      }
    };
  },
});
