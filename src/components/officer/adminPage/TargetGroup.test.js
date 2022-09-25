import {fireEvent, render, screen} from "@testing-library/react";
import {TargetGroup} from "./TargetGroup";
import { act } from "react-dom/test-utils";

test("Test Admin Groups Component", async() => {
  let currentGroupId = null;
  const mockGroups = [
    {
      name: 'group1',
      id: 1
    },
    {
      name: 'group2',
      id: 2
    }
  ];

  await act(() => {
    render(
      <TargetGroup
        groups={mockGroups}
        openTargetGroup={group => {
          currentGroupId = group.id;
        }}
      />
    );
  });

  let group1 = screen.getByText(mockGroups[0].name);
  let group2 = screen.getByText(mockGroups[1].name);

  expect(group1).toBeInTheDocument();
  expect(group2).toBeInTheDocument();

  fireEvent.click(group1);
  expect(currentGroupId).toBe(1);

  fireEvent.click(group2);
  expect(currentGroupId).toBe(2);



});

