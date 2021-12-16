import React from "react";
import { Draggable, Droppable } from "react-beautiful-dnd";
import { useForm } from "react-hook-form";
import { useSetRecoilState } from "recoil";
import styled from "styled-components";
import { ITodo, toDoState } from "../atoms";
import DragabbleCard from "./DragabbleCard";

const Wrapper = styled.div<{ isDragging: boolean }>`
  width: 300px;
  padding-top: 10px;
  background-color: ${(props) => props.theme.boardColor};
  border-radius: 5px;
  min-height: 300px;
  display: flex;
  flex-direction: column;
  box-shadow: ${(props) =>
    props.isDragging ? "0px 2px 20px rgba(0, 0, 0, 0.5)" : "none"};
  position: relative;
`;

const Title = styled.h2`
  text-align: center;
  font-weight: 600;
  margin-bottom: 10px;
  font-size: 18px;
`;

interface IAreaProps {
  isDraggingFromThisWith: boolean;
  isDraggingOver: boolean;
}

const Area = styled.div<IAreaProps>`
  background-color: ${(props) =>
    props.isDraggingOver
      ? "#9da0a3"
      : props.isDraggingFromThisWith
      ? "#b2bec3"
      : "transparent"};
  flex-grow: 1;
  transition: background-color 0.3s ease-in-out;
  padding: 20px;
`;

interface IBoardProps {
  toDos: ITodo[];
  boardId: string;
  boardIndex: number;
}

interface IForm {
  toDo: string;
}

const Form = styled.form`
  width: 100%;
  display: flex;
  justify-content: center;
`;

const Delete = styled.span`
  position: absolute;
  right: 10px;
  font-weight: 600;
  cursor: pointer;
`;

const Create = styled.input`
  all: unset;
  border: 1px solid black;
  border-radius: 5px;
  padding: 5px;
  background-color: white;
  cursor: auto;
`;

function Board({ toDos, boardId, boardIndex }: IBoardProps) {
  const setToDos = useSetRecoilState(toDoState);
  const { register, setValue, handleSubmit } = useForm<IForm>();

  const deleteClick = () => {
    setToDos((oldToDos) => {
      const newToDos = { ...oldToDos };
      delete newToDos[boardId];
      localStorage.setItem("todo", JSON.stringify(newToDos));
      return newToDos;
    });
  };

  const onVaild = ({ toDo }: IForm) => {
    const newToDo = {
      id: Date.now(),
      text: toDo,
    };

    setToDos((allBoards) => {
      const newToDos = {
        ...allBoards,
        [boardId]: [...allBoards[boardId], newToDo],
      };
      localStorage.setItem("todo", JSON.stringify(newToDos));

      return newToDos;
    });

    setValue("toDo", "");
  };
  return (
    <Draggable draggableId={boardId} index={boardIndex}>
      {(magic, info) => (
        <Wrapper
          ref={magic.innerRef}
          {...magic.draggableProps}
          isDragging={info.isDragging}
        >
          <Title {...magic.dragHandleProps}>{boardId}</Title>
          <Delete onClick={deleteClick}>X</Delete>
          <Form onSubmit={handleSubmit(onVaild)}>
            <Create
              {...register("toDo", { required: true })}
              type="text"
              placeholder={`${boardId} 추가`}
            />
          </Form>
          <Droppable droppableId={boardId}>
            {(magic, info) => (
              <Area
                isDraggingOver={info.isDraggingOver}
                isDraggingFromThisWith={Boolean(info.draggingFromThisWith)}
                ref={magic.innerRef}
                {...magic.droppableProps}
              >
                {toDos.map((toDo, index) => (
                  <DragabbleCard
                    key={toDo.id}
                    index={index}
                    toDoId={toDo.id}
                    toDoText={toDo.text}
                  />
                ))}
                {magic.placeholder}
              </Area>
            )}
          </Droppable>
        </Wrapper>
      )}
    </Draggable>
  );
}

export default React.memo(Board);
