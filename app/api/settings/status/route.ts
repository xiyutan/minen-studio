export const runtime = 'nodejs';

export async function GET() {
  return Response.json({
    hasServerApiKey: Boolean(process.env.AGNES_API_KEY),
  });
}
