import { useState } from "react";
import axios from "axios";
import styled from "styled-components";

function MyBookings({ experts }) {
  const [email, setEmail] = useState("");
  const [bookings, setBookings] = useState([]);
  const [error, setError] = useState("");
  const [searched, setSearched] = useState(false);

  const cancelBooking = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/bookings/${id}`);

      setBookings((prev) => prev.filter((b) => b._id !== id));
    } catch (err) {
      console.log(err);
    }
  };

  const getExpertName = (id) => {
    const expert = experts.find((e) => e.id === Number(id));
    return expert ? expert.name : "Unknown";
  };

  const fetchBookings = async () => {
    if (!email) {
      setError("Enter email first");
      return;
    }

    try {
      setError("");
      setSearched(true);

      const res = await axios.get(
        `http://localhost:5000/bookings?email=${email}`,
      );

      setBookings(res.data);
    } catch (err) {
      setError("Failed to fetch bookings");
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.patch(`http://localhost:5000/bookings/${id}/status`, {
        status: newStatus,
      });

      setBookings((prev) =>
        prev.map((b) => (b._id === id ? { ...b, status: newStatus } : b)),
      );
    } catch (err) {
      console.log(err);
    }
  };

  return (
    <Page>
      <Container>
        <Title>My Bookings</Title>

        <Input
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <SearchBtn onClick={fetchBookings}>Search</SearchBtn>

        {error && <Error>{error}</Error>}

        {searched && bookings.length === 0 && (
          <NoData>No bookings found</NoData>
        )}

        {bookings.map((b) => (
          <Card key={b._id}>
            <p>Date: {b.date}</p>
            <p>Time: {b.timeSlot}</p>
            <p>Expert: {getExpertName(b.expertId)}</p>

            <Status $status={b.status}>{b.status}</Status>

            <ButtonGroup>
              {b.status === "Pending" && (
                <SmallBtn onClick={() => updateStatus(b._id, "Confirmed")}>
                  Confirm
                </SmallBtn>
              )}

              {b.status === "Confirmed" && (
                <SmallBtn2 onClick={() => updateStatus(b._id, "Completed")}>
                  Complete
                </SmallBtn2>
              )}

              {b.status == "Pending"  && (
                <SmallBtn3 onClick={() => cancelBooking(b._id)}>
                  Cancel
                </SmallBtn3>
              )}
            </ButtonGroup>
          </Card>
        ))}
      </Container>
    </Page>
  );
}

export default MyBookings;


const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  padding: 40px;
`;

const Container = styled.div`
  max-width: 600px;
  margin: auto;
  text-align: center;
`;

const Title = styled.h2`
  margin-bottom: 20px;
`;

const Input = styled.input`
  padding: 10px;
  width: 100%;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;
`;

const SearchBtn = styled.button`
  padding: 10px 16px;
  background: #020841;
  color: white;
  border: none;
  border-radius: 8px;
  cursor: pointer;
`;

const Card = styled.div`
  background: white;
  padding: 15px;
  margin-top: 15px;
  border-radius: 10px;
  text-align: left;
`;

const ButtonGroup = styled.div`
  display: flex;
  gap: 10px;
  margin-top: 10px;
`;

const SmallBtn = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: #035013;
  color: white;
  cursor: pointer;

  &:hover {
    background: #01310c;
  }
`;
const SmallBtn3 = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: #cd0617;
  color: white;
  cursor: pointer;

  &:hover {
    background: #970915;
  }
`;
const SmallBtn2 = styled.button`
  padding: 6px 10px;
  border: none;
  border-radius: 6px;
  background: #0ea5e9;
  color: white;
  cursor: pointer;

  &:hover {
    background: #0284c7;
  }
`;

const Status = styled.p`
  font-weight: bold;
  color: ${(p) =>
    p.$status === "Confirmed"
      ? "green"
      : p.$status === "Pending"
        ? "orange"
        : "gray"};
`;

const Error = styled.p`
  color: red;
`;

const NoData = styled.p`
  margin-top: 20px;
  color: #64748b;
`;
