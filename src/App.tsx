import {
  DragDropContext,
  Draggable,
  Droppable,
  DropResult,
} from "react-beautiful-dnd";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "./atoms";
import Board from "./Components/Board";
import CreateBoard from "./Components/CreateBoard";

const Wrapper = styled.div`
  display: flex;
  margin: 0 auto;
  justify-content: center;
  align-items: center;
  width: 100vw;
  display: grid;
  height: 80vh;
`;

const Boards = styled.div`
  display: flex;
  justify-content: center;
  align-items: flex-start;
  width: 100%;
  gap: 10px;
`;

const DeleteWrapper = styled.div`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

const Area = styled.div`
  span {
    font-size: 30px;
  }
`;

const CreateWrapper = styled.div`
  height: 10vh;
  display: flex;
  justify-content: center;
  align-items: center;
`;

function App() {
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onDragEnd = (info: DropResult) => {
    console.log(toDos);

    console.log(info);

    const { destination, source } = info;
    if (!destination) return;
    if (destination.droppableId === "trash") {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        boardCopy.splice(source.index, 1);
        const newBoard = { ...allBoards, [source.droppableId]: boardCopy };
        localStorage.setItem("todo", JSON.stringify(newBoard));
        return newBoard;
      });
      return;
    }

    if (source.droppableId === "boardsdiv") {
      setToDos((allBoards) => {
        const newAll = { ...allBoards };
        const arrBoard = Object.keys(allBoards).map((i) => i);
        arrBoard.splice(source.index, 1);
        arrBoard.splice(destination.index, 0, info.draggableId);
        const newBoard = {} as any;
        for (let i = 0; i < arrBoard.length; i++) {
          newBoard[arrBoard[i]] = [...newAll[arrBoard[i]]];
        }
        localStorage.setItem("todo", JSON.stringify(newBoard));
        return newBoard;
      });
      return;
    }

    if (destination?.droppableId === source.droppableId) {
      setToDos((allBoards) => {
        const boardCopy = [...allBoards[source.droppableId]];
        const taskObj = boardCopy[source.index];
        boardCopy.splice(source.index, 1);
        boardCopy.splice(destination?.index, 0, taskObj);
        const newBoard = { ...allBoards, [source.droppableId]: boardCopy };
        localStorage.setItem("todo", JSON.stringify(newBoard));
        return newBoard;
      });
    } else {
      setToDos((allBoards) => {
        const sourceBoard = [...allBoards[source.droppableId]];
        const targetBoard = [...allBoards[destination.droppableId]];
        const taskObj = sourceBoard[source.index];
        sourceBoard.splice(source.index, 1);
        targetBoard.splice(destination.index, 0, taskObj);
        const newBoard = {
          ...allBoards,
          [source.droppableId]: sourceBoard,
          [destination.droppableId]: targetBoard,
        };
        localStorage.setItem("todo", JSON.stringify(newBoard));
        return newBoard;
      });
    }
  };
  return (
    <DragDropContext onDragEnd={onDragEnd}>
      <CreateWrapper>
        <CreateBoard />
      </CreateWrapper>
      <Wrapper>
        <Droppable droppableId="boardsdiv" type="board" direction="horizontal">
          {(magic) => (
            <Boards ref={magic.innerRef} {...magic.droppableProps}>
              {Object.keys(toDos).map((boardId, index) => (
                <Board
                  boardId={boardId}
                  key={boardId}
                  toDos={toDos[boardId]}
                  boardIndex={index}
                />
              ))}
              {magic.placeholder}
            </Boards>
          )}
        </Droppable>
      </Wrapper>
      <DeleteWrapper>
        <Droppable droppableId="trash">
          {(magic) => (
            <Area ref={magic.innerRef} {...magic.droppableProps}>
              <span>여기로 드래그해서 삭제</span>
            </Area>
          )}
        </Droppable>
      </DeleteWrapper>
    </DragDropContext>
  );
}

export default App;
