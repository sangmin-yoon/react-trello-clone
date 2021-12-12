import { atom } from "recoil";

interface IToDoState {
  [key: string]: string[];
}

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: {
    " to Do": ["a", "b"],
    doing: ["c", "d", "e"],
    done: ["f", "g", "h"],
  },
});
