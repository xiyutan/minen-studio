import https from 'node:https';
import { Readable } from 'node:stream';

const AGNES_HOST = 'apihub.agnes-ai.com';
const AGNES_ORIGIN = `https://${AGNES_HOST}`;
const AGNES_FALLBACK_IPS = ['104.18.18.62', '104.18.19.62'];

let nextIpIndex = 0;

const agnesAgent = new https.Agent({
  keepAlive: true,
  lookup(hostname, _options, callback) {
    if (hostname !== AGNES_HOST) {
      callback(new Error(`Unexpected Agnes API host: ${hostname}`), '', 4);
      return;
    }

    const ip = AGNES_FALLBACK_IPS[nextIpIndex % AGNES_FALLBACK_IPS.length];
    nextIpIndex += 1;

    if (_options.all) {
      callback(null, [{ address: ip, family: 4 }]);
      return;
    }

    callback(null, ip, 4);
  },
});

interface AgnesRequestOptions {
  method?: 'GET' | 'POST';
  apiKey: string;
  body?: unknown;
  timeoutMs?: number;
}

interface AgnesResponse {
  status: number;
  statusText: string;
  text: () => Promise<string>;
  json: <T>() => Promise<T>;
  webStream: () => ReadableStream<Uint8Array>;
}

function readBody(stream: NodeJS.ReadableStream) {
  return new Promise<string>((resolve, reject) => {
    const chunks: Buffer[] = [];

    stream.on('data', (chunk) => {
      chunks.push(Buffer.isBuffer(chunk) ? chunk : Buffer.from(chunk));
    });
    stream.on('end', () => resolve(Buffer.concat(chunks).toString('utf8')));
    stream.on('error', reject);
  });
}

export function requestAgnes(path: string, options: AgnesRequestOptions) {
  const url = new URL(path, AGNES_ORIGIN);

  if (url.hostname !== AGNES_HOST) {
    throw new Error(`Unexpected Agnes API URL: ${url.toString()}`);
  }

  const payload = options.body === undefined ? undefined : JSON.stringify(options.body);

  return new Promise<AgnesResponse>((resolve, reject) => {
    const req = https.request(
      url,
      {
        method: options.method || 'GET',
        agent: agnesAgent,
        headers: {
          Authorization: `Bearer ${options.apiKey}`,
          ...(payload ? { 'Content-Type': 'application/json' } : {}),
        },
        timeout: options.timeoutMs || 360_000,
      },
      (res) => {
        resolve({
          status: res.statusCode || 0,
          statusText: res.statusMessage || '',
          text: () => readBody(res),
          json: async <T>() => JSON.parse(await readBody(res)) as T,
          webStream: () => Readable.toWeb(res) as ReadableStream<Uint8Array>,
        });
      }
    );

    req.on('timeout', () => {
      req.destroy(new Error('Agnes API request timed out'));
    });
    req.on('error', reject);

    if (payload) {
      req.write(payload);
    }

    req.end();
  });
}
