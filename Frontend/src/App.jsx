import { useState, useEffect } from "react";
import { Routes, Route, useNavigate } from "react-router-dom";
import styled from "styled-components";
import ExpertDetails from "./Pages/ExpertDetail";
import BookingPage from "./Pages/BookingPage";
import MyBookings from "./Pages/MyBookings";

function App() {
  const [experts, setExperts] = useState([]);

  useEffect(() => {
    fetch("http://localhost:5000/experts")
      .then((res) => res.json())
      .then((data) => setExperts(data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Home experts={experts} />} />
      <Route path="/expert/:id" element={<ExpertDetails experts={experts} />} />
      <Route path="/booking/:id" element={<BookingPage experts={experts} />} />
      <Route path="/my-bookings" element={<MyBookings experts={experts} />} />
    </Routes>
  );
}

export default App;


function Home({ experts }) {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("");
  const [page, setPage] = useState(1);
  const limit = 6;

  const navigate = useNavigate();

  const filteredExperts = experts
    .filter((e) => {
      const searchText = search.toLowerCase().trim();
      return (
        e.name.toLowerCase().includes(searchText) ||
        e.category.toLowerCase().includes(searchText)
      );
    })
    .filter((e) => (category ? e.category === category : true));

  const start = (page - 1) * limit;
  const paginatedExperts = filteredExperts.slice(start, start + limit);

  return (
    <Page>
      <Header>Mentor Booking Platform</Header>
      <SubText>Select a mentor and book your slot</SubText>

      <MyBookingBtn onClick={() => navigate("/my-bookings")}>
        My Bookings
      </MyBookingBtn>

      <FilterBar>
        <SearchInput
          placeholder="Search mentor..."
          value={search}
          onChange={(e) => {
            setSearch(e.target.value);
            setPage(1);
          }}
        />

        <Select
          value={category}
          onChange={(e) => {
            setCategory(e.target.value);
            setPage(1);
          }}
        >
          <option value="">All</option>
          <option value="Career">Career</option>
          <option value="Technology">Technology</option>
        </Select>
      </FilterBar>

      <Grid>
        {paginatedExperts.length > 0 ? (
          paginatedExperts.map((exp) => (
            <Card key={exp.id}>
              <Name>{exp.name}</Name>
              <Category>{exp.category}</Category>
              <Rating>⭐ {exp.rating}</Rating>

              <Button onClick={() => navigate(`/expert/${exp.id}`)}>
                View Details
              </Button>
            </Card>
          ))
        ) : (
          <NoResult>No mentors found</NoResult>
        )}
      </Grid>

      <Pagination>
        <PageBtn disabled={page === 1} onClick={() => setPage(page - 1)}>
          Prev
        </PageBtn>

        <span>Page {page}</span>

        <PageBtn
          disabled={start + limit >= filteredExperts.length}
          onClick={() => setPage(page + 1)}
        >
          Next
        </PageBtn>
      </Pagination>
    </Page>
  );
}


const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  padding: 50px 20px;
  font-family: "Segoe UI", sans-serif;
`;

const Header = styled.h1`
  text-align: center;
  font-size: 34px;
  color: #0f172a;
  margin-bottom: 10px;
`;

const SubText = styled.p`
  text-align: center;
  color: #64748b;
  margin-bottom: 40px;
  font-size: 15px;
`;

const MyBookingBtn = styled.button`
  display: block;
  margin: 0 auto 20px;
  padding: 10px 16px;
  border-radius: 10px;
  border: none;
  background: #0ea5e9;
  color: white;
  font-weight: bold;
  cursor: pointer;

  &:hover {
    background: #0284c7;
  }
`;

const FilterBar = styled.div`
  display: flex;
  justify-content: center;
  gap: 15px;
  margin-bottom: 30px;
  flex-wrap: wrap;
`;

const SearchInput = styled.input`
  padding: 12px;
  border-radius: 10px;
  border: 1px solid #e2e8f0;
  width: 240px;
`;

const Select = styled.select`
  padding: 12px;
  border-radius: 10px;
`;

const Grid = styled.div`
  max-width: 1100px;
  margin: auto;
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(260px, 1fr));
  gap: 25px;
`;

const Card = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  text-align: center;
`;

const Name = styled.h3``;

const Category = styled.p`
  color: #27187e;
  font-size: 18px;
  font-weight:500;
`;

const Rating = styled.p`
  color: #f59e0b;
`;

const Button = styled.button`
  margin-top: 10px;
  padding: 10px;
  background: #003249;
  color: #80ced7;
  border: none;
  font-weight: 500;
  font-size: 15px;
  border-radius: 8px;
  cursor: pointer;
`;

const NoResult = styled.p`
  text-align: center;
  grid-column: 1 / -1;
`;

const Pagination = styled.div`
  margin-top: 20px;
  display: flex;
  justify-content: center;
  gap: 10px;
`;

const PageBtn = styled.button`
  padding: 8px 12px;
  border: none;
  background: #b80c09;
  color: white;
  border-radius: 6px;
  cursor: pointer;

  &:disabled {
    background: #c99393;
  }
`;