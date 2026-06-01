/* eslint-disable import/no-anonymous-default-export */
import http from "k6/http";
import { check, sleep } from "k6";


export const options = {
  vus: 2000,
  duration: "30s",
};

export default function () {
  const random = Math.floor(Math.random() * 1000) + 1;

  const payload = JSON.stringify({
    email: `user${random}@test.com`,
    password: "123456",
  });

  const params = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const res = http.post(
    "http://localhost:3000/api/auth/signin",
    payload,
    params
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}