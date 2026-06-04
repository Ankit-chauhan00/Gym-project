/* eslint-disable import/no-anonymous-default-export */
import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
  stages: [
    { duration: "30s", target: 500 },
   
  ],
};

export default function () {

  const page = Math.floor(Math.random() * 10) + 1;

  const res = http.get(
    `http://localhost:3000/trainers?page=${page}`
  );

  check(res, {
    "status is 200": (r) => r.status === 200,
  });

  sleep(1);
}