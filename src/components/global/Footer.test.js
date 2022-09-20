import { render, screen } from "@testing-library/react";
import {Footer} from "./Footer";
import { act } from "react-dom/test-utils";

test("Test Footer Component", async() => {
  await act(() => {
    render(
      <Footer />
    );
  });
  let rightText = screen.getByText(`© 2022 enlight. All rights reserved.`);
  let termsLink = screen.getByText(`Terms of Service`);
  let policyLink = screen.getByText(`Privacy Policy`);
  let contact = screen.getByText(`Contact Us`);
  expect(rightText).toBeInTheDocument();
  expect(termsLink).toBeInTheDocument();
  expect(policyLink).toBeInTheDocument();
  expect(contact).toBeInTheDocument();
});

