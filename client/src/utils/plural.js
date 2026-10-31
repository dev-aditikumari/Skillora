// plural(1, "lecture") -> "1 lecture", plural(2, "lecture") -> "2 lectures"
export const plural = (count, word) => `${count} ${word}${count === 1 ? "" : "s"}`;
