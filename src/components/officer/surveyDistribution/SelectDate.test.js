import {fireEvent, render, screen} from "@testing-library/react";
import {SelectDate} from "./SelectDate";
import { act } from "react-dom/test-utils";

test("Test Select Date Component", async() => {
  let date = '2022-09-24';
  const defaultDate = '2022-09-25';
  const handleSelectDate = (val) => {
    date = val;
  }
  await act(() => {
    render(
      <SelectDate setScheduledDate={handleSelectDate} scheduledDate={defaultDate}/>
    );
  });

  const input = screen.getByLabelText('date-input');
  expect(input.value).toBe(defaultDate);



});

