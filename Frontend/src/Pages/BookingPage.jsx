import { useParams } from "react-router-dom";
import { useState, useEffect } from "react";
import axios from "axios";
import styled from "styled-components";
import socket from "../socket";

function BookingPage({ experts }) {
  const { id } = useParams();
  const expert = experts.find((e) => e.id === Number(id));

  if (!expert) return <h2>Expert not found</h2>;

  const [form, setForm] = useState({
    name: "",
    email: "",
    phone: "",
  });

  const [bookedSlots, setBookedSlots] = useState({});
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [error, setError] = useState("");

  const slots = ["10:00 AM", "11:00 AM", "12:00 PM"];

  const getDates = (days = 3) => {
    const arr = [];
    for (let i = 0; i < days; i++) {
      const d = new Date();
      d.setDate(d.getDate() + i);
      arr.push(d.toLocaleDateString("en-CA"));
    }
    return arr;
  };

  const dates = getDates(3);

useEffect(() => {
  const fetch = async () => {
    try {
      setLoading(true);
      setError("");

      const res = await axios.get(`${import.meta.env.VITE_API_URL}/bookings`);

      const grouped = {};

      res.data.forEach((b) => {
        if (b.expertId.toString() === id.toString()) {
          if (!grouped[b.date]) grouped[b.date] = [];
          grouped[b.date].push(b.timeSlot);
        }
      });

      setBookedSlots(grouped);

    } catch (err) {
      setError("Failed to load slots");
    } finally {
      setLoading(false);
    }
  };

  fetch();
}, [id]);



  useEffect(() => {
  socket.on("slotBooked", (data) => {
    if (data.expertId.toString() === id.toString()) {
      setBookedSlots((prev) => {
        const existing = prev[data.date] || [];

        if (existing.includes(data.timeSlot)) return prev;

        return {
          ...prev,
          [data.date]: [...existing, data.timeSlot],
        };
      });
    }
  });

  socket.on("slotCancelled", (data) => {
    if (data.expertId.toString() === id.toString()) {
      setBookedSlots((prev) => {
        const existing = prev[data.date] || [];

        return {
          ...prev,
          [data.date]: existing.filter(
            (slot) => slot !== data.timeSlot
          ),
        };
      });
    }
  });

  return () => {
    socket.off("slotBooked");
    socket.off("slotCancelled");
  };
}, [id]);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

const bookSlot = async (time, date) => {
  if (!form.name || !form.email || !form.phone) {
    setError(" Please fill all fields before booking");
    setMessage("");
    return;
  }

  try {
    setLoading(true);
    setError("");
    setMessage("");

    await axios.post(`${import.meta.env.VITE_API_URL}/bookings`, {
      ...form,
      expertId: id,
      date,
      timeSlot: time,
    });

    setBookedSlots((prev) => {
      const existing = prev[date] || [];
      if (existing.includes(time)) return prev;

      return {
        ...prev,
        [date]: [...existing, time],
      };
    });

    setMessage("✅ Booking successful!");

  } catch (err) {
    setError(
      err.response?.data?.message ||
      "Failed to book slot"
    );
    setMessage("");
  } finally {
    setLoading(false);
  }
};




        if (loading) return <h2>Loading slots...</h2>;

  return (
    
    <Page>

      <Container>
        <LeftCard>
          <h2>{expert.name}</h2>
          <Category>{expert.category}</Category>
          <p>Book a session with this mentor</p>
        </LeftCard>

        <RightCard>
          <Title>Book a Slot</Title>

          {message && <SuccessMsg>{message}</SuccessMsg>}
          {error && <ErrorMsg>{error}</ErrorMsg>}

          <Form>
            <Input name="name" placeholder="Name" onChange={handleChange} />
            <Input name="email" placeholder="Email" onChange={handleChange} />
            <Input name="phone" placeholder="Phone" onChange={handleChange} />
          </Form>

          {dates.map((d) => (
            <DateBlock key={d}>
              <DateTitle>{d}</DateTitle>

              <SlotGrid>
                {slots.map((time) => {
                  const isBooked = bookedSlots[d]?.includes(time);

                  return (
                    <SlotButton
                      key={time}
                      $booked={isBooked}
                      disabled={isBooked || loading}
                      onClick={() => bookSlot(time, d)}
                    >
                      {time}
                      <Status>{isBooked ? "Booked" : "Available"}</Status>
                    </SlotButton>
                  );
                })}
              </SlotGrid>
            </DateBlock>
          ))}
        </RightCard>
      </Container>
    </Page>
  );
}

export default BookingPage;
const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(to right, #eef2ff, #f8fafc);
  padding: 40px;

    @media (max-width: 768px) {
    padding: 20px 12px;
  }
   
  

`;

const Container = styled.div`
  max-width: 1100px;
  margin: auto;
  display: grid;
  grid-template-columns: 1fr 2fr;
  gap: 30px;

   @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const LeftCard = styled.div`
  height: 200px;
  background: #1e293b;
  color: white;
  padding: 30px;
  border-radius: 12px;

   @media (max-width: 768px) {
    order: 1;
  }
 
 
`;

const RightCard = styled.div`
  background: white;
  padding: 30px;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.08);

  
  @media (max-width: 768px) {
    order: 2;
  }
  
`;

const Title = styled.h2`
  margin-bottom: 20px;
  color: #0f172a;
`;

const Category = styled.p`
  color: #9ad1d4;
  font-weight: bold;
`;

const Form = styled.div`
  margin-bottom: 20px;
`;

const Input = styled.input`
  width: 100%;
  padding: 12px;
  margin-bottom: 10px;
  border-radius: 8px;
  border: 1px solid #ccc;

   @media (max-width: 768px) {
    padding: 14px;
  }
`;

const DateBlock = styled.div`
  margin-top: 20px;
`;

const DateTitle = styled.h4`
  margin-bottom: 10px;
`;

const SlotGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 10px;

   @media (max-width: 768px) {
    grid-template-columns: repeat(2, 1fr);
  }

  @media (max-width: 480px) {
    grid-template-columns: 1fr;
  }
`;

const SlotButton = styled.button`
  padding: 12px;
  border-radius: 8px;
  border: none;
  font-weight: bold;

  background: ${(p) => (p.$booked ? "#c1121f" : "#05287c")};

  color: white;

  display: flex;
  flex-direction: column;
  align-items: center;

  &:hover {
    opacity: 0.9;
  }

  &:disabled {
    cursor: not-allowed;
    opacity: 0.7;
  }
`;

const Status = styled.span`
  font-size: 12px;
`;

const SuccessMsg = styled.p`
  background: #dcfce7;
  color: #166534;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
`;

const ErrorMsg = styled.p`
  background: #fee2e2;
  color: #991b1b;
  padding: 10px;
  border-radius: 6px;
  margin-bottom: 10px;
`;
