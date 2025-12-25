/* eslint-disable @typescript-eslint/no-unused-vars */
import { Message, realtime } from "@/lib/realtime";
import { redis } from "@/lib/redis";
import { Elysia } from "elysia";
import { nanoid } from "nanoid";
import { z } from "zod";
import { authMiddleware } from "./auth";

const DEFAULT_ROOM_TTL_SECONDS = 60 * 10; // 10 minutes
const MAX_ROOM_TTL_SECONDS = 60 * 60 * 24; // 24 hours

const rooms = new Elysia({ prefix: "/room" })
  .post(
    "/create",
    async ({ body }) => {
      const roomId = nanoid();

      // Get custom TTL from request body, default to 10 minutes
      const customTtl = body?.ttl
        ? Math.min(body.ttl, MAX_ROOM_TTL_SECONDS)
        : DEFAULT_ROOM_TTL_SECONDS;

      await redis.hset(`meta:${roomId}`, {
        connected: [],
        createdAt: Date.now(),
      });

      await redis.expire(`meta:${roomId}`, customTtl);
      await redis.hset(`meta:${roomId}`, { initialTtl: customTtl }); // Store the initial TTL

      return { roomId };
    },
    {
      body: z
        .object({
          ttl: z
            .number()
            .min(60)
            .max(MAX_ROOM_TTL_SECONDS)
            .optional(), // TTL in seconds, min 1 minute
        })
        .optional(),
    }
  )
  .use(authMiddleware)
  .get(
    "/ttl",
    async ({ auth }) => {
      const ttl = await redis.ttl(`meta:${auth.roomId}`);
      const meta = await redis.hgetall<{
        createdAt: number;
        initialTtl: number;
      }>(`meta:${auth.roomId}`);
      return {
        ttl: ttl > 0 ? ttl : 0,
        initialTtl: meta?.initialTtl || ttl > 0 ? ttl : 0, // Return the initial TTL that was set when the room was created
        createdAt: meta?.createdAt || Date.now(),
      };
    },
    { query: z.object({ roomId: z.string() }) }
  )
  .delete(
    "/",
    async ({ auth }) => {
      await realtime
        .channel(auth.roomId)
        .emit("chat.destroy", { isDestroyed: true });

      await Promise.all([
        redis.del(auth.roomId),
        redis.del(`meta:${auth.roomId}`),
        redis.del(`messages:${auth.roomId}`),
      ]);
    },
    { query: z.object({ roomId: z.string() }) }
  );

const messages = new Elysia({ prefix: "/messages" })
  .use(authMiddleware)
  .post(
    "/",
    async ({ body, auth }) => {
      const { sender, text } = body;
      const { roomId } = auth;

      const roomExists = await redis.exists(`meta:${roomId}`);

      if (!roomExists) {
        throw new Error("Room does not exist");
      }

      const message: Message = {
        id: nanoid(),
        sender,
        text,
        timestamp: Date.now(),
        roomId,
      };

      // add message to history
      await redis.rpush(`messages:${roomId}`, {
        ...message,
        token: auth.token,
      });
      await realtime.channel(roomId).emit("chat.message", message);

      // housekeeping
      const remaining = await redis.ttl(`meta:${roomId}`);

      await redis.expire(`messages:${roomId}`, remaining);
      await redis.expire(`history:${roomId}`, remaining);
      await redis.expire(roomId, remaining);
    },
    {
      query: z.object({ roomId: z.string() }),
      body: z.object({
        sender: z.string().max(100),
        text: z.string().max(1000),
      }),
    }
  )
  .get(
    "/",
    async ({ auth }) => {
      const messages = await redis.lrange<Message>(
        `messages:${auth.roomId}`,
        0,
        -1
      );

      return {
        messages: messages.map((m) => ({
          ...m,
          token: m.token === auth.token ? auth.token : undefined,
        })),
      };
    },
    { query: z.object({ roomId: z.string() }) }
  );

const app = new Elysia({ prefix: "/api" }).use(rooms).use(messages);

export const GET = app.fetch;
export const POST = app.fetch;
export const DELETE = app.fetch;

export type App = typeof app;
