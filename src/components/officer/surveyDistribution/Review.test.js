import { render, screen, fireEvent } from "@testing-library/react";

import { act } from "react-dom/test-utils";
import {Review} from "./Review";
test("Test Review Component", async() => {
  let assignClicked = false,
      clearClicked = false;
  const handleAssign = () => {
    assignClicked = true;
  }
  const handleClear = () => {
    clearClicked = true;
  }
  await act(() => {
    render(
      <Review
        assignTeachers={handleAssign}
        clearSchedule={handleClear}
      />
    );
  });
  let assignButton = screen.getByText('Start sending out survey invitation');
  expect(assignButton).toBeInTheDocument();
  let clearButton = screen.getByText('Discard changes');
  expect(clearButton).toBeInTheDocument();

  fireEvent.click(assignButton);
  expect(assignClicked).toBe(true);

  fireEvent.click(clearButton);
  expect(clearClicked).toBe(true);
});

