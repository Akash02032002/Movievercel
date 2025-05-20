import React, { useEffect, useState } from "react";
import { ThreeDots } from "react-loader-spinner";
import ReactStars from "react-stars";
import { getDocs } from 'firebase/firestore';
import { moviesRef } from '../firebase/firebase';
import { Link } from "react-router-dom";

const Cards = ({ searchQuery }) => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const recordsPerPage = 14;

  useEffect(() => {
    const getData = async () => {
      try {
        setLoading(true);
        const querySnapshot = await getDocs(moviesRef);
        const fetchedData = querySnapshot.docs.map(doc => ({ ...(doc.data()), id: doc.id }));
        setData(fetchedData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    getData();
  }, []);

  const filteredData = data.filter((item) =>
    item.title.toLowerCase().includes((searchQuery || '').toLowerCase())
  );

  const lastIndex = currentPage * recordsPerPage;
  const firstIndex = lastIndex - recordsPerPage;
  const currentRecords = filteredData.slice(firstIndex, lastIndex);
  const npage = Math.ceil(filteredData.length / recordsPerPage);
  const numbers = [...Array(npage + 1).keys()].slice(1);

  return (
    <div className="flex flex-wrap justify-between px-3 mt-2">
      {loading ? (
        <div className="w-full flex justify-center items-center h-96">
          <ThreeDots height={40} color="white" />
        </div>
      ) : (
        currentRecords.map((e) => (
          <Link to={`/detail/${e.id}`} key={e.id}>
            <div className="card font-medium shadow-lg p-2 hover:-translate-y-3 cursor-pointer mt-6 transition-all duration-500">
              <img className="h-[350px] w-[150px] object-cover rounded-[10px] m-[5px] md: h-72 " src={e.image} alt={e.title} />
              <h1>{e.title}</h1>
              <h1 className="flex items-center">
                <span className="text-gray-500 mr-1">Rating:</span>
                <ReactStars
                  size={20}
                  half={true}
                  value={e.rating / e.rated}
                  edit={false}
                />
              </h1>
              <h1>
                <span className="text-gray-500">Year:</span> {e.year}
              </h1>
            </div>
          </Link>
        ))
      )}

      <nav>
        <ul className="pagination">
          <li className={`page-item ${currentPage === 1 ? 'disabled' : ''}`}>
            <a href="#" className="page-link" onClick={(e) => prePage(e)}>Prev</a>
          </li>

          {numbers.map((n) => (
            <li className={`page-item ${currentPage === n ? 'active' : ''}`} key={n}>
              <a href="#" className="page-link" onClick={(e) => changeCPage(e, n)}>{n}</a>
            </li>
          ))}
          
          <li className={`page-item ${currentPage === npage ? 'disabled' : ''}`}>
            <a href="#" className="page-link" onClick={(e) => nextPage(e)}>Next</a>
          </li>
        </ul>
      </nav>
    </div>
  );

  function prePage(e) {
    e.preventDefault();
    if (currentPage !== 1) {
      setCurrentPage(currentPage - 1);
    }
  }

  function changeCPage(e, id) {
    e.preventDefault();
    setCurrentPage(id);
  }

  function nextPage(e) {
    e.preventDefault();
    if (currentPage !== npage) {
      setCurrentPage(currentPage + 1);
    }
  }
};

export default Cards;
