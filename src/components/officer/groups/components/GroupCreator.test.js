import { render, screen, fireEvent } from "@testing-library/react";
import GroupCreator from "./GroupCreator";
import { act } from "react-dom/test-utils";

test("Test Group Create Component", async() => {
  let title = 'create group';
  let sub_title = 'create below';
  let placeholder = 'enter here';
  let value = '';
  await act(() => {
    render(
      <GroupCreator
        title={title}
        subTitle={sub_title}
        required={true}
        placeholder={placeholder}
        type={'input'}
        onChange={val => {
          value = val;
        }}
      />
    );
  });
  const input = screen.getByLabelText('input');
  fireEvent.change(input, { target: { value: 'hello world' } });
  expect(input.value).toBe('hello world');
});

