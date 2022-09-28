import React from "react";
import "./teacherLanding.css";

export const Pagination = ({
  taskPerPage,
  totalTasks,
  setCurrentPage,
  currentPage,
  nextClick,
  prevClick
}) => {
  const pageNumbers = [];

  for (let i = 1; i <= Math.ceil(totalTasks / taskPerPage); i++) {
    pageNumbers.push(i);
  }

  return (
    <nav>
      {pageNumbers.length > 0 &&
      <ul className="pagination">
        { currentPage > 1 &&
        <button 
        className="page-btn"
        onClick={prevClick}>
            Previous
        </button>
        }

        <p style={{paddingTop:'10px'}}>Page: {currentPage}/{pageNumbers.length}</p>
        {currentPage < pageNumbers.length &&
        <button 
        className="page-btn"
        onClick={nextClick}>
            Next
        </button>
        }

        {/* {pageNumbers.map((number) => (
          <button
            className={number === currentPage ? "active" : ""}
            key={number}
            onClick={() => setCurrentPage(number)}
          >
            {number}
          </button>
        ))} */}
      </ul>}
    </nav>
  );
};
