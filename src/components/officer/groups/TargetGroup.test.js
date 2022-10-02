import { render, screen } from "@testing-library/react";
import {TargetGroup} from "./TargetGroup";
import { act } from "react-dom/test-utils";

test("Test Target Group Component", async() => {
  const groups = [
    {
      id: 1,
      name: 'first group'
    },
    {
      id: 2,
      name: 'second group'
    }
  ]
  await act(() => {
    render(
      <TargetGroup groups={groups}/>
    );
  });
  let domTag = screen.getByText('Click on a group to view their details');

  expect(domTag).toBeInTheDocument();

  let firstGroupName = screen.getByText(groups[0].name);
  expect(firstGroupName).toBeInTheDocument();
  let secondGroupName = screen.getByText(groups[1].name);
  expect(secondGroupName).toBeInTheDocument();
});

