
import { render, screen } from "@testing-library/react";
import {Questions} from "./Questions";
import { act } from "react-dom/test-utils";

test("Test Questions Component Add", async() => {

  await act(() => {
    render(
      <Questions showQuestion={false}/>
    );
  });
  let domTag = screen.getByText('Add question');

  expect(domTag).toBeInTheDocument();

});

test("Test Questions Component List", async() => {
  let questions = [
    {
      text: 'question1'
    },
    {
      text: 'question2'
    }
  ];
  const QuestionsComp = questions.map(que => {
    return (
      <div key={que.text}>{que.text}</div>
    )
  })
  await act(() => {
    render(
      <Questions showQuestion={true} questionList={QuestionsComp}/>
    );
  });

  let questionText = screen.getByText('question1');
  expect(questionText).toBeInTheDocument();

});

