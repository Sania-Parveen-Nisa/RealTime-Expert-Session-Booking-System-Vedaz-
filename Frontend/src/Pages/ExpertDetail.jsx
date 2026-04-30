import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import styled from "styled-components";

function ExpertDetails({ experts }) {
  const { id } = useParams();
  const navigate = useNavigate();

    useEffect(() => {
    window.scrollTo({ top: 0, behavior: "smooth" });
  }, []);


const expert = experts?.find((e) => e.id === Number(id));
  if (!expert) return <h2>No Expert Found</h2>;

  return (
    <Page>
      <Container>
        <Left>
          <Name>{expert.name}</Name>
          <Category>{expert.category}</Category>

          <SectionTitle>Experience</SectionTitle>
          <Experience>{expert.exp || "Not specified"}</Experience>

          <Rating>⭐ {expert.rating}</Rating>

          <SectionTitle>About</SectionTitle>
          <Description>
            This mentor helps you with career guidance, interview preparation,
            and real-world project advice.
          </Description>
        </Left>

        <Right>
          <Button onClick={() => navigate(`/booking/${expert.id}`)}>
            Book Now
          </Button>
        </Right>
      </Container>
    </Page>
  );
}

export default ExpertDetails;

const Page = styled.div`
  min-height: 100vh;
  background: linear-gradient(135deg, #eef2ff, #f8fafc);
  padding: 60px 20px;
  font-family: "Segoe UI", sans-serif;
`;

const Container = styled.div`
  max-width: 1100px;
  margin: auto;
  display: grid;
  grid-template-columns: 2fr 1fr;
  gap: 30px;

  @media (max-width: 768px) {
    grid-template-columns: 1fr;
  }
`;

const Left = styled.div`
  background: white;
  padding: 35px;
  border-radius: 16px;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.08);
`;

const Right = styled.div`
  display: flex;
  align-items: flex-start;
`;

const BookingCard = styled.div`
  background: white;
  padding: 25px;
  border-radius: 16px;
  width: 100%;
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08);
  text-align: center;
`;

const Name = styled.h1`
  color: #0f172a;
  font-size: 28px;
  margin-bottom: 5px;
`;

const Category = styled.p`
  color: #1a0a78;
  font-weight: 700;
  margin-bottom: 15px;
`;

const Experience = styled.p`
  font-weight: 600;
  color: #334155;
  margin-bottom: 10px;
`;

const Rating = styled.p`
  color: #f59e0b;
  font-weight: bold;
  margin-bottom: 20px;
`;

const SectionTitle = styled.h3`
  margin-top: 25px;
  color: #1e293b;
  font-size: 18px;
`;

const Description = styled.p`
  margin-top: 10px;
  color: #475569;
  line-height: 1.7;
  font-size: 15px;
`;

const Divider = styled.hr`
  margin: 20px 0;
  border: none;
  border-top: 1px solid #e2e8f0;
`;

const Button = styled.button`
  margin-top: 20px;
  padding: 14px;
  width: 100%;
  border-radius: 10px;
  border: none;
  background: linear-gradient(135deg, #80ced7, #80ced7);
  color: #003249;
  font-weight: bold;
  font-size: 15px;
  cursor: pointer;
  font-weight: 600px;
  transition: 0.3s;

  &:hover {
    transform: translateY(-2px);
    box-shadow: 0 8px 20px rgba(111, 176, 222, 0.3);
  }
`;

const InfoBox = styled.div`
  background: #f1f5f9;
  padding: 12px;
  border-radius: 10px;
  margin-top: 10px;
  font-size: 14px;
  color: #334155;
`;