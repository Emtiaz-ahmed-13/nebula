"use client";

import { useUsername } from "@/hooks/use-username";
import { client } from "@/lib/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter, useSearchParams } from "next/navigation";
import { Suspense, useState } from "react";

const Page = () => {
  return (
    <Suspense>
      <Lobby />
    </Suspense>
  );
};

export default Page;

function Lobby() {
  const { username } = useUsername();
  const router = useRouter();
  const [roomIdInput, setRoomIdInput] = useState("");
  const [roomDuration, setRoomDuration] = useState(10); // Default to 10 minutes

  const extractRoomIdFromUrl = (input: string) => {
    // Check if input looks like a URL containing a room ID
    const urlRegex = /\/room\/([a-zA-Z0-9_-]+)/;
    const match = input.match(urlRegex);
    return match ? match[1] : null;
  };

  const sanitizeRoomId = (input: string) => {
    // First try to extract from URL, then sanitize
    const extracted = extractRoomIdFromUrl(input);
    if (extracted) return extracted;
    return input.trim().replace(/[^a-zA-Z0-9_-]/g, "");
  };

  const isRoomIdValid = () => {
    return sanitizeRoomId(roomIdInput).length > 0;
  };

  const searchParams = useSearchParams();
  const wasDestroyed = searchParams.get("destroyed") === "true";
  const error = searchParams.get("error");

  const { mutate: createRoom, isPending: isCreatingRoom } = useMutation({
    mutationFn: async () => {
      const res = await client.room.create.post({
        ttl: roomDuration * 60, // Convert minutes to seconds
      });

      if (res.status === 200) {
        router.push(`/room/${res.data?.roomId}`);
      }
    },
  });

  const joinRoom = () => {
    const sanitizedRoomId = sanitizeRoomId(roomIdInput);
    if (sanitizedRoomId) {
      router.push(`/room/${sanitizedRoomId}`);
    }
  };

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-gradient-to-br from-zinc-900 to-black">
      <div className="w-full max-w-lg space-y-8">
        <div className="text-center space-y-4">
          <div className="flex justify-center">
            <div className="bg-zinc-800 p-4 rounded-full">
              <div className="bg-gradient-to-r from-green-500 to-emerald-500 p-1 rounded-full">
                <div className="bg-zinc-900 p-3 rounded-full">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-8 w-8 text-green-500"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M18 5v8a2 2 0 01-2 2h-5l-5 4v-4H4a2 2 0 01-2-2V5a2 2 0 012-2h12a2 2 0 012 2zM7 8H5v2h2V8zm2 0h2v2H9V8zm6 0h-2v2h2V8z"
                      clipRule="evenodd"
                    />
                  </svg>
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent">
              {">"}private_chat
            </h1>
            <p className="text-zinc-400 text-base">
              Secure, private, self-destructing chat rooms
            </p>
          </div>
        </div>

        {(wasDestroyed ||
          error === "room-not-found" ||
          error === "room-full") && (
          <div
            className={`p-4 rounded-lg border text-center ${
              wasDestroyed
                ? "bg-amber-950/30 border-amber-800 text-amber-500"
                : error === "room-not-found"
                ? "bg-red-950/30 border-red-800 text-red-500"
                : "bg-red-950/30 border-red-800 text-red-500"
            }`}
          >
            <p className="font-bold">
              {wasDestroyed
                ? "ROOM DESTROYED"
                : error === "room-not-found"
                ? "ROOM NOT FOUND"
                : "ROOM FULL"}
            </p>
            <p className="text-xs mt-1 text-zinc-400">
              {wasDestroyed && "All messages were permanently deleted."}
              {error === "room-not-found" &&
                "This room may have expired or never existed."}
              {error === "room-full" && "This room is at maximum capacity."}
            </p>
          </div>
        )}

        <div className="border border-zinc-800 bg-zinc-900/70 p-6 backdrop-blur-sm rounded-xl shadow-xl">
          <div className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex flex-col gap-2">
                  <label className="text-xs text-zinc-500 flex items-center gap-1">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      className="h-3 w-3"
                      viewBox="0 0 20 20"
                      fill="currentColor"
                    >
                      <path
                        fillRule="evenodd"
                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z"
                        clipRule="evenodd"
                      />
                    </svg>
                    Room Duration
                  </label>
                  <select
                    value={roomDuration}
                    onChange={(e) => setRoomDuration(Number(e.target.value))}
                    className="bg-zinc-800 border border-zinc-700 p-2 text-sm text-zinc-300 rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                  >
                    <option value={5}>5 minutes</option>
                    <option value={10}>10 minutes (default)</option>
                    <option value={15}>15 minutes</option>
                    <option value={30}>30 minutes</option>
                    <option value={60}>1 hour</option>
                  </select>
                </div>
                <button
                  onClick={() => createRoom()}
                  disabled={isCreatingRoom}
                  className="w-full bg-gradient-to-r from-green-600 to-emerald-600 text-white p-3 text-sm font-bold hover:from-green-500 hover:to-emerald-500 transition-all cursor-pointer disabled:opacity-50 rounded-lg flex items-center justify-center gap-2"
                >
                  {isCreatingRoom ? (
                    <>
                      <svg
                        className="animate-spin h-4 w-4 text-white"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                      >
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"
                        ></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                        ></path>
                      </svg>
                      CREATING...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z"
                          clipRule="evenodd"
                        />
                      </svg>
                      CREATE SECURE ROOM
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-zinc-800"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-zinc-900 text-zinc-500 text-xs">
                  OR
                </span>
              </div>
            </div>

            <div className="space-y-3">
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-zinc-400">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-4 w-4"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path d="M10.394 2.08a1 1 0 00-.788 0l-7 3a1 1 0 000 1.84L5.25 8.051a.999.999 0 01.356-.257l4-1.714a1 1 0 11.788 1.838L7.667 9.088l1.94.831a1 1 0 00.787 0l7-3a1 1 0 000-1.838l-7-3zM3.31 9.397L5 10.12v4.102a8.969 8.969 0 00-1.05-.174 1 1 0 01-.89-.89 11.115 11.115 0 01.25-3.762zM9.3 16.573A9.026 9.026 0 007 14.935v-3.957l1.818.78a3 3 0 002.364 0l5.508-2.361a11.026 11.026 0 01.25 3.762 1 1 0 01-.89.89 8.968 8.968 0 00-5.35 2.524 1 1 0 01-1.4 0zM6 18a1 1 0 001-1v-2.065a8.935 8.935 0 00-2-.712V17a1 1 0 001 1z" />
                  </svg>
                  <span className="text-sm font-medium">
                    Join Existing Room
                  </span>
                </div>
                <div className="flex flex-col gap-2">
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={roomIdInput}
                      onChange={(e) => {
                        const inputValue = e.target.value;
                        // Check if the input looks like a URL with a room ID
                        const extracted = extractRoomIdFromUrl(inputValue);
                        if (extracted) {
                          // If it's a URL, automatically extract and set the room ID
                          setRoomIdInput(extracted);
                        } else {
                          // Otherwise, just update with the input value
                          setRoomIdInput(inputValue);
                        }
                      }}
                      placeholder="Enter room ID to join"
                      className="flex-1 bg-zinc-800/50 border border-zinc-700 p-3 text-sm text-zinc-300 font-mono rounded-lg focus:border-green-500 focus:outline-none transition-colors"
                    />
                    <button
                      onClick={joinRoom}
                      disabled={!isRoomIdValid()}
                      className="bg-zinc-800 text-zinc-300 p-3 text-sm font-bold hover:bg-zinc-700 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed rounded-lg border border-zinc-700 flex items-center gap-2"
                    >
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        className="h-4 w-4"
                        viewBox="0 0 20 20"
                        fill="currentColor"
                      >
                        <path
                          fillRule="evenodd"
                          d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-8.707l-3-3a1 1 0 00-1.414 0l-3 3a1 1 0 001.414 1.414L9 9.414V13a1 1 0 102 0V9.414l1.293 1.293a1 1 0 001.414-1.414z"
                          clipRule="evenodd"
                        />
                      </svg>
                      JOIN
                    </button>
                  </div>
                  {roomIdInput && extractRoomIdFromUrl(roomIdInput) && (
                    <p className="text-xs text-green-500 mt-1">
                      Extracted room ID:{" "}
                      <span className="font-mono">
                        {extractRoomIdFromUrl(roomIdInput)}
                      </span>
                    </p>
                  )}
                  {roomIdInput &&
                    !extractRoomIdFromUrl(roomIdInput) &&
                    roomIdInput !== sanitizeRoomId(roomIdInput) && (
                      <p className="text-xs text-amber-500 mt-1">
                        Using cleaned ID:{" "}
                        <span className="font-mono">
                          {sanitizeRoomId(roomIdInput)}
                        </span>
                      </p>
                    )}
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="text-center text-xs text-zinc-600 space-y-1">
          <p>
            Messages are encrypted and automatically deleted based on room
            duration
          </p>
          <p>No data is stored on our servers permanently</p>
        </div>
      </div>
    </main>
  );
}
