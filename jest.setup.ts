import "@testing-library/jest-dom";

// Node (Jest) 環境では global.fetch が存在しないため簡易 polyfill を提供。
// ネットワークリクエストを行う実装はモックすべきだが、最低限の互換性を保つ。
// jest.fn() を使用することで、テストごとにモックを上書きできるようにしている。
if (typeof (global as any).fetch === "undefined") {
  (global as any).fetch = jest.fn(() =>
    Promise.resolve({
      ok: true,
      json: async () => ({}),
    })
  );
}
