import '@testing-library/jest-dom';
// Mock Request/Response/Headers for Next.js API tests in Node/JSDOM
// @ts-expect-error Polyfilling global
global.Headers = class Headers {
  private map: Record<string, string> = {};
  constructor(init?: Record<string, string>) {
    if (init) Object.assign(this.map, init);
  }
  append(name: string, value: string) { this.map[name.toLowerCase()] = value; }
  get(name: string) { return this.map[name.toLowerCase()] || null; }
  set(name: string, value: string) { this.map[name.toLowerCase()] = value; }
  has(name: string) { return name.toLowerCase() in this.map; }
  delete(name: string) { delete this.map[name.toLowerCase()]; }
  getSetCookie(): string[] { return []; }
  forEach(cb: (value: string, key: string) => void) {
    for (const [k, v] of Object.entries(this.map)) cb(v, k);
  }
  entries() { return Object.entries(this.map)[Symbol.iterator](); }
  keys() { return Object.keys(this.map)[Symbol.iterator](); }
  values() { return Object.values(this.map)[Symbol.iterator](); }
};

// @ts-expect-error Polyfilling global
global.Request = class Request {
  public url: string;
  public method: string;
  public headers: InstanceType<typeof Headers>;
  private _body: unknown;
  constructor(input: string, init?: Record<string, unknown>) {
    this.url = input;
    this.method = (init?.method as string) || 'GET';
    this.headers = new global.Headers(init?.headers as Record<string, string>);
    this._body = init?.body;
  }
  async json() { return typeof this._body === 'string' ? JSON.parse(this._body) : this._body; }
};

// @ts-expect-error Polyfilling global
global.Response = class Response {
  public status: number;
  public ok: boolean;
  private _data: unknown;
  constructor(body?: unknown, init?: Record<string, unknown>) {
    this._data = body;
    this.status = (init?.status as number) || 200;
    this.ok = this.status >= 200 && this.status < 300;
  }
  static json(data: unknown, init?: Record<string, unknown>) {
    return new Response(JSON.stringify(data), init);
  }
  async json() { return typeof this._data === 'string' ? JSON.parse(this._data) : this._data; }
};

// Global mocks
global.ResizeObserver = class ResizeObserver {
  observe() {}
  unobserve() {}
  disconnect() {}
};

global.IntersectionObserver = class IntersectionObserver {
  root = null;
  rootMargin = '';
  thresholds = [];
  observe() {}
  unobserve() {}
  disconnect() {}
  takeRecords() { return []; }
};

// Mock next/navigation
jest.mock('next/navigation', () => ({
  useRouter() {
    return {
      push: jest.fn(),
      replace: jest.fn(),
      prefetch: jest.fn(),
    };
  },
  useSearchParams() {
    return {
      get: jest.fn(),
    };
  },
  useParams() {
    return {};
  },
}));

// Mock next/server — NextResponse uses @edge-runtime/cookies which requires
// Headers.getSetCookie() not available in JSDOM. Use our polyfill Response instead.
jest.mock('next/server', () => ({
  NextResponse: {
    json(data: unknown, init?: Record<string, unknown>) {
      return new global.Response(JSON.stringify(data), init);
    },
  },
}));

if (typeof window !== 'undefined') {
  Object.defineProperty(window, 'matchMedia', {
    writable: true,
    value: jest.fn().mockImplementation(query => ({
      matches: false,
      media: query,
      onchange: null,
      addListener: jest.fn(),
      removeListener: jest.fn(),
      addEventListener: jest.fn(),
      removeEventListener: jest.fn(),
      dispatchEvent: jest.fn(),
    })),
  });
}
