'use client';

export function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 p-2">
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_0ms]" />
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_200ms]" />
      <div className="w-2 h-2 rounded-full bg-blue-500 animate-[bounce_1s_infinite_400ms]" />
    </div>
  );
}
