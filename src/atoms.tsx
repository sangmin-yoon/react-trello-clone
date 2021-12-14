import { atom, selector } from "recoil";

export interface ITodo {
  id: number;
  text: string;
}

interface IToDoState {
  [key: string]: ITodo[];
}

const getToDos = JSON.parse(localStorage.getItem("todo")!);

console.log(getToDos);

export const toDoState = atom<IToDoState>({
  key: "toDo",
  default: getToDos
    ? { ...getToDos }
    : {
        " To Do": [],
        doing: [],
        done: [],
      },
});
