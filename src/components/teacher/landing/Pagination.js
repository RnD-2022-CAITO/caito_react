import React from 'react'
import './teacherLanding.css'

export const Pagination = ({ taskPerPage, totalTasks, setCurrentPage, currentPage}) => {

    const pageNumbers = [];

    for(let i = 1; i <= Math.ceil(totalTasks / taskPerPage); i++){
        pageNumbers.push(i);
    }

    return (
        <nav>
            <ul className="pagination">
                {pageNumbers.map(number => (
                    <button 
                    className={number === currentPage ? "active" : ""}
                    key={number} onClick={() => setCurrentPage(number)}>{number}</button>
                ))}
            </ul> 
        </nav>
    )
}
