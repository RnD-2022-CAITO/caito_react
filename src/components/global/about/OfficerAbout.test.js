import { render, screen } from "@testing-library/react";
import {OfficerAbout} from "./OfficerAbout";
import { act } from "react-dom/test-utils";

test("Test Officer About Component", async() => {
  await act(() => {
    render(
      <OfficerAbout />
    );
  });
  const domTag = screen.getByText('This page is to show how officer can use the application');

  expect(domTag).toBeInTheDocument();
});

