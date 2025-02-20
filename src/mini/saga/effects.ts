import { IO } from "./symbol";

const effectTypes = {
  TAKE: "TAKE",
  PUT: "PUT",
  ALL: "ALL",
  RACE: "RACE",
  CALL: "CALL",
  CPS: "CPS",
  FORK: "FORK",
  JOIN: "JOIN",
  CANCEL: "CANCEL",
  SELECT: "SELECT",
  ACTION_CHANNEL: "ACTION_CHANNEL",
  CANCELLED: "CANCELLED",
  FLUSH: "FLUSH",
  GET_CONTEXT: "GET_CONTEXT",
  SET_CONTEXT: "SET_CONTEXT",
} as const;

function makeEffect(type: keyof typeof effectTypes, payload) {
  return {
    type,
    payload,
    [IO]: IO,
  };
}

export function take(pattern) {
  return makeEffect(effectTypes.TAKE, { pattern });
}
export function put(action) {
  return makeEffect(effectTypes.PUT, { action });
}
export function call(fn, ...args) {
  return makeEffect(effectTypes.CALL, { fn, args });
}
export function fork(fn, ...args) {
  return makeEffect(effectTypes.FORK, { fn, args });
}

export function all(effects) {
  return makeEffect(effectTypes.ALL, { effects });
}
