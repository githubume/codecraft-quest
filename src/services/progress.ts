import type { LearningRecord } from "../types";

const key = "codecraft.quest.records";

export function getRecords(): LearningRecord[] {
  const raw = window.localStorage.getItem(key);
  if (!raw) return [];
  try {
    return JSON.parse(raw) as LearningRecord[];
  } catch {
    return [];
  }
}

export function saveRecord(record: LearningRecord) {
  const records = getRecords();
  window.localStorage.setItem(key, JSON.stringify([record, ...records].slice(0, 100)));
}

export function clearRecords() {
  window.localStorage.removeItem(key);
}
