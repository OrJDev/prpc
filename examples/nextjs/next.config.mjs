import thaler from "unplugin-thaler";
import prpc from "@prpc/unplugin";

/**
 * Run `build` or `dev` with `SKIP_ENV_VALIDATION` to skip env validation.
 * This is especially useful for Docker builds.
 */
!process.env.SKIP_ENV_VALIDATION && (await import("./src/env.mjs"));

/** @type {import("next").NextConfig} */
const config = {
  reactStrictMode: false,

  /**
   * If you have the "experimental: { appDir: true }" setting enabled, then you
   * must comment the below `i18n` config out.
   *
   * @see https://github.com/vercel/next.js/issues/41980
   */
  i18n: {
    locales: ["en"],
    defaultLocale: "en",
  },
  webpack: (config, { isServer }) => {
    config.plugins.push(
      prpc.webpack({
        adapter: "react-thaler",
      })
    );
    config.plugins.push(
      thaler.webpack({
        origin: "http://localhost:3000/api",
        mode: isServer ? "server" : "client",
      })
    );
    return config;
  },
};
export default config;
