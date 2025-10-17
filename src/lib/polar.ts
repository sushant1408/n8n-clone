import { Polar } from "@polar-sh/sdk";

const server = process.env.POLAR_SERVER as "production" | "sandbox" | undefined;

export const polarClient = new Polar({
  accessToken: process.env.POLAR_ACCESS_TOKEN,
  server,
});
