import { prisma } from './prisma';
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

// export async function loadDataToRedis() {
//   try {
//     const isInitialized = await redisClient.get('cache_initialized');
//     if (isInitialized) return;
//     const rows = await prisma.click.findMany();
//     const pipeline = redisClient.multi();
//     rows.forEach((row) => {
//       const key = `user:${row.userId}:${row.secretId}:clicks`;
//       pipeline.set(key, row.clickCount);
//     });
//     await pipeline.exec();
//     console.log('레디스 초기화에 성공했습니다.');
//     await redisClient.set('cache_initialized', 'true');
//   } catch (error) {
//     console.error('레디스 초기화 중 에러가 발생했습니다.', error);
//   }
// }

export async function syncRedis() {
  let cursor = 0;
  do {
    const clicks = [];
    const result = await redisClient.scan(cursor, {
      MATCH: '*',
      COUNT: 100,
    });

    cursor = +result.cursor;

    for (const key of result.keys) {
      const value = await redisClient.get(key);
      const [, userId, secretId] = key.split(':');
      if (value) {
        clicks.push({ userId, secretId, clickCount: +value });
      }
    }

    const upsertOperations = clicks.map((data) =>
      prisma.click.upsert({
        where: {
          secretId_userId: {
            secretId: data.secretId,
            userId: +data.userId,
          },
        },
        update: {
          clickCount: data.clickCount,
        },
        create: {
          secretId: data.secretId,
          userId: +data.userId,
          clickCount: data.clickCount,
        },
      })
    );
    await prisma.$transaction(upsertOperations);
  } while (cursor !== 0);
}
