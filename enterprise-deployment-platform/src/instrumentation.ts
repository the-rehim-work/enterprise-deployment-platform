export async function register() {
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("[instrumentation] Server starting");
  }
}