import { render, screen } from "@testing-library/react";
import {TeacherAbout} from "./TeacherAbout";
import { act } from "react-dom/test-utils";

test("Test Teacher About Component", async() => {
  await act(() => {
    render(
      <TeacherAbout />
    );
  });
  const domTag = screen.getByText('This page is to show how a teacher can use the application');

  expect(domTag).toBeInTheDocument();
});

