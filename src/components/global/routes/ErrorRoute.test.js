import { render, screen } from "@testing-library/react";
import ErrorRoute from "./ErrorRoute";
import { act } from "react-dom/test-utils";

test("Test Error Page", async() => {
  let domTag;
  await act(() => {
    render(
      <ErrorRoute err={'already-login'} />
    );
  });
  domTag = screen.getByText('You have already logged in.');
  expect(domTag).toBeInTheDocument();

  await act(() => {
    render(
      <ErrorRoute />
    );
  });
  domTag = screen.getByText('Oops! Seems like you don\'t have permission to access this path!');

  expect(domTag).toBeInTheDocument();
});

