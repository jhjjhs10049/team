import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchGymDetail, fetchGymReviews } from "../api/gymApi";
import ReviewList from "../components/ReviewList";
import ReviewForm from "../components/ReviewForm";

const normalizeReviews = (r) => {
  if (Array.isArray(r)) return r;
  if (Array.isArray(r?.content)) return r.content; // Page 형태
  if (Array.isArray(r?.reviews)) return r.reviews; // { reviews: [...] }
  if (Array.isArray(r?.data)) return r.data; // axios 래핑 등
  if (Array.isArray(r?.items)) return r.items;
  return [];
};

const GymReviewPage = () => {
  const { gymno } = useParams();
  const navigate = useNavigate();

  const [gym, setGym] = useState(null);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const memberNo = localStorage.getItem("memberNo");

  useEffect(() => {
    let alive = true;

    const loadData = async () => {
      try {
        setLoading(true);
        setError("");

        const id = Number(gymno);
        if (!Number.isFinite(id)) {
          setError("잘못된 경로입니다.");
          return;
        }

        const gymData = await fetchGymDetail(id);
        if (!alive) return;
        setGym(gymData);

        const raw = await fetchGymReviews(id);
        if (!alive) return;
        setReviews(normalizeReviews(raw));
      } catch (err) {
        console.error("[GymReviewPage] 데이터 로드 중 오류:", err);
        setError("데이터를 불러오지 못했습니다.");
      } finally {
        if (alive) setLoading(false);
      }
    };

    loadData();
    return () => {
      alive = false;
    };
  }, [gymno]);

  if (loading) return <div>헬스장 정보를 불러오는 중입니다...</div>;
  if (error) return <div>{error}</div>;
  if (!gym) return <div>헬스장 정보가 없습니다.</div>;

  const handleReviewClick = () => {
    if (!memberNo) {
      alert("리뷰를 작성하려면 로그인해야 합니다.");
      navigate("/login");
    }
  };

  return (
    <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem" }}>
      <h1>{gym.title} 리뷰</h1>
      <ReviewList reviews={reviews} />
      <hr style={{ margin: "2rem 0" }} />
      <div onClick={handleReviewClick}>
        <ReviewForm gymNo={gym.gymNo} disabled={!memberNo} />
      </div>
    </div>
  );
};

export default GymReviewPage;
