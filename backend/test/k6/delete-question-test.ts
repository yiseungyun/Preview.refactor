import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 100, // 100명의 사용자
    duration: "5s", // 5초 동안 동시 요청을 실행
};

const BASE_URL = "http://localhost:3000";
const COOKIE =
    "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiY2FtcGVyXzEwMTYzODkyMyIsImxvZ2luVHlwZSI6ImxvY2FsIiwiaWF0IjoxNzMzMzI2NTIzfQ.OA9o0twIqKUNdTJhnHZkSKytoUvp052VsywKdYvSn30; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQxOTA1MjM5MDgsImlhdCI6MTczMzMyNjUyMywiYXVkIjoiMSJ9.ZXYCwUL8EOjc1xJ3BJ_bHCLQHa20_qxf1FYqolgxP4I";

export default function () {
    const questionListId = 27;
    const questionId = 66176 + (__VU - 1) * 10 + __ITER;
    console.log(questionId);

    const url = `${BASE_URL}/question-list/${questionListId}/question/${questionId}`;
    const params = {
        headers: {
            Cookie: `${COOKIE}`,
        },
    };

    const response = http.del(url, null, params);

    check(response, {
        "is status 200": (r) => r.status === 200,
    });

    sleep(1);
}
