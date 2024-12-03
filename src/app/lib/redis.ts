import { createClient, RedisClientType } from 'redis';

declare global {
  // 전역 변수에 redisClient 타입 추가
  var redisClient: RedisClientType | undefined;
}

const redisUrl = process.env.REDIS_URL || 'redis://localhost:6379';

let redisClient: RedisClientType;

if (!global.redisClient) {
  redisClient = createClient({ url: redisUrl });

  // 에러 핸들링
  redisClient.on('error', (err) => {
    console.error('Redis Client Error:', err);
  });

  // 연결 시작
  redisClient.connect().catch((err) => {
    console.error('Failed to connect to Redis:', err);
  });

  // 전역 객체에 저장
  global.redisClient = redisClient;
} else {
  redisClient = global.redisClient;
}

export default redisClient;
