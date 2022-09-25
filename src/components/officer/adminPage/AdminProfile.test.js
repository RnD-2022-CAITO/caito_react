import {fireEvent, render, screen} from "@testing-library/react";
import {AdminProfile} from "./AdminProfile";
import { act } from "react-dom/test-utils";

test("Test Admin Groups Component", async() => {
  const user = {
    firstName: 'Dog',
    lastName: 'Cat'
  };
  const currentUser = {
    email: 'Dog@gmail.com'
  }
  await act(() => {
    render(
      <AdminProfile
        userData={user}
        currentUser={currentUser}
      />
    );
  });

  const username = screen.getByText(user.firstName + ' ' + user.lastName);
  expect(username).toBeInTheDocument();

  const email = screen.getByText(currentUser.email);
  expect(email).toBeInTheDocument();



});

