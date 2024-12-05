import http from "k6/http";
import { check, sleep } from "k6";

export const options = {
    vus: 100, // 108명의 사용자
    duration: "5s", // 5초 동안 동시 요청을 실행
};

const BASE_URL = "http://localhost:3000";
const COOKIE =
    "accessToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySWQiOjEsInVzZXJuYW1lIjoiY2FtcGVyXzEwMTYzODkyMyIsImxvZ2luVHlwZSI6ImxvY2FsIiwiaWF0IjoxNzMzMzI2NTIzfQ.OA9o0twIqKUNdTJhnHZkSKytoUvp052VsywKdYvSn30; refreshToken=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJleHAiOjE3MzQxOTA1MjM5MDgsImlhdCI6MTczMzMyNjUyMywiYXVkIjoiMSJ9.ZXYCwUL8EOjc1xJ3BJ_bHCLQHa20_qxf1FYqolgxP4I";

const questionListData = {
    title: "Sample Question List for Test",
    contents: [
        "This is 1st question!",
        "This is 2nd question!",
        "This is 3rd question!",
        "This is 4th question!",
        "This is 5th question!",
        "This is 6th question!",
        "This is 7th question!",
        "This is 8th question!",
        "This is 9th question!",
        "This is 10th question!",
    ],
    categoryNames: ["보안", "네트워크", "자료구조"],
    isPublic: true,
};

export default function () {
    const url = `${BASE_URL}/question-list`;
    const params = {
        headers: {
            Cookie: `${COOKIE}`,
            "Content-Type": "application/json",
        },
    };

    const response = http.post(url, JSON.stringify(questionListData), params);

    check(response, {
        "is status 200": (r) => r.status === 200,
    });

    sleep(1);
}
