import fs from "fs";
import path from "path";
import { SkeletonTransformer } from "./generateSkeleton.js";
import readline from "readline";  

const promptUser = (question) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  });

  return new Promise((resolve) => {
    rl.question(question, (answer) => {
      rl.close();
      resolve(answer);
    });
  });
}

const main = async() => {
  const sourcePath = await promptUser("변환할 React 컴포넌트 경로 입력: ");

  const currentDir = process.cwd();
  const absoluteSourcePath = path.isAbsolute(sourcePath) 
    ? sourcePath 
    : path.resolve(currentDir, sourcePath);

  if (!fs.existsSync(absoluteSourcePath)) {
    console.error(`[오류] 소스 파일 '${absoluteSourcePath}'을 찾을 수 없습니다.`);
    process.exit(1);
  }
  
  const absoluteTargetPathDefault = path.join(
    path.dirname(absoluteSourcePath),
    `Skeleton${path.basename(sourcePath)}`
  );
  
  const transformer = new SkeletonTransformer(absoluteSourcePath, absoluteTargetPathDefault);
  transformer.generate();

  console.log("🎉 스켈레톤 컴포넌트 생성 완료 🎉");
}

main().catch(error => {
  console.error("예상치 못한 오류 발생", error);
  process.exit(1);
});