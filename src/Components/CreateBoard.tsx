import { useForm } from "react-hook-form";
import { useRecoilState } from "recoil";
import styled from "styled-components";
import { toDoState } from "../atoms";

const Create = styled.input`
  all: unset;
  color: black;
  border: 1px solid white;
  padding: 10px;
  border-radius: 5px;
  font-weight: bold;
`;

function CreateBoard() {
  const { register, setValue, handleSubmit } = useForm();
  const [toDos, setToDos] = useRecoilState(toDoState);

  const onVaild = ({ createBoard }: any) => {
    setToDos((oldToDos) => {
      const newToDos = { ...oldToDos, [createBoard]: [] };
      localStorage.setItem("todo", JSON.stringify(newToDos));
      return newToDos;
    });

    setValue("createBoard", "");
  };

  return (
    <form onSubmit={handleSubmit(onVaild)}>
      <Create
        {...register("createBoard", { required: true })}
        type="text"
        placeholder="카테고리 추가"
      />
    </form>
  );
}

export default CreateBoard;
