/* eslint-disable import/no-anonymous-default-export */
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 50 },
    { duration: "1m", target: 100 },
    { duration: "1m", target: 200 },
    { duration: "30s", target: 0 },
  ],
};

export default function () {

  // Get CSRF token
  const csrfRes = http.get(
    "http://localhost:3000/api/auth/csrf"
  );

  const csrfToken = JSON.parse(csrfRes.body as string).csrfToken;
  // Extract cookies
  const csrfCookie =
  csrfRes.cookies["authjs.csrf-token"]?.[0]?.value;

  // Form payload
  const payload = {
    email: "admin@test.com",
    password: "123456",
    csrfToken: csrfToken,
    callbackUrl: "http://localhost:3000",
    json: "true",
  };

  const res = http.post(
  "http://localhost:3000/api/auth/callback/credentials",
  payload,
  {
    cookies: {
      "authjs.csrf-token": csrfCookie || "",
    },

    headers: {
      "Content-Type":
        "application/x-www-form-urlencoded",
    },
  }
);

  check(res, {
    "login successful": (r) =>
      r.status === 200 ||
      r.status === 302 ||
      r.status === 307,
  });

  sleep(1);
}