import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { fetchGymDetail } from "../api/gymApi";
import api from "../../global/api/axios";
import { Swiper, SwiperSlide } from "swiper/react";
import "swiper/css";
import "swiper/css/navigation";
import { Navigation } from "swiper/modules";

const GymDetailPage = () => {
  const { gymno } = useParams();
  const navigate = useNavigate();

  const [gym, setGym] = useState(null);
  const [images, setImages] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [reviews, setReviews] = useState([]);
  const [isFavorite, setIsFavorite] = useState(false);
  const [favoriteCount, setFavoriteCount] = useState(0);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const handleScrollTop = () => window.scrollTo({ top: 0, behavior: "smooth" });
  const handleGoReviews = () => {
    console.log(gym);
    navigate(`/gyms/${gym.gymNo}/reviews`);
  };

  const handleToggleFavorite = () => {
    if (!isLoggedIn) {
      //추후 로그인 페이지로 이동 로직 구현 여부 결정.
      return;
    }
    api
      .put(`/api/gyms/${gym.gymNo}/favorite`, { favorite: !isFavorite })
      .then((res) => {
        setIsFavorite(res.data.isFavorite);
        setFavoriteCount(res.data.favoriteCount);
      })
      .catch((err) => {
        if (err.response?.status === 401) {
          alert("로그인 후 이용 가능합니다.");
          navigate("/login");
        } else {
          console.error(err);
        }
      });
  };

  useEffect(() => {
    // 로그인 여부 간단 체크 (토큰 존재 여부 기준)
    const token = localStorage.getItem("accessToken");
    setIsLoggedIn(!!token);
  }, []);

  useEffect(() => {
    let mounted = true;
    const id = Number(gymno);
    if (!id) {
      setError("잘못된 경로입니다.");
      setLoading(false);
      return;
    }

    setLoading(true);
    setError("");

    fetchGymDetail(id)
      .then((data) => {
        if (!mounted) return;
        setGym(data);
        setImages(Array.isArray(data.imageList) ? data.imageList : []);
        setTrainers(Array.isArray(data.trainers) ? data.trainers : []);
        setReviews(Array.isArray(data.reviews) ? data.reviews : []);
        setIsFavorite(Boolean(data.isFavorite));
        setFavoriteCount(data.favoriteCount ?? 0);
      })
      .catch((e) => {
        if (!mounted) return;
        console.error(e);
        if (e?.response?.status === 404)
          setError("해당 헬스장을 찾을 수 없습니다.");
        else if (e?.response?.status === 401)
          setError("권한이 없습니다. 로그인 후 다시 시도하세요.");
        else setError("헬스장 정보를 불러오지 못했습니다.");
      })
      .finally(() => mounted && setLoading(false));

    return () => {
      mounted = false;
    };
  }, [gymno]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;
  if (!gym) return <div>데이터가 없습니다.</div>;

  const safeRate = Number.isFinite(gym.rate) ? gym.rate : 0;

  return (
    <div style={containerStyle}>
      {/* 이미지 슬라이드 */}
      {images.length > 0 ? (
        <Swiper
          modules={[Navigation]}
          navigation
          spaceBetween={10}
          slidesPerView={1}
          style={swiperStyle}
        >
          {images.map((img, idx) => (
            <SwiperSlide key={idx}>
              <img src={img} alt={`gym-img-${idx}`} style={imgStyle} />
            </SwiperSlide>
          ))}
        </Swiper>
      ) : (
        <p>등록된 이미지가 없습니다.</p>
      )}

      {/* 타이틀 + 관심표시 */}
      <div style={titleRowStyle}>
        <h2 style={{ margin: 0, fontSize: "1.3rem" }}>{gym.title}</h2>
        <span
          style={{ fontSize: "24px", cursor: "pointer" }}
          onClick={handleToggleFavorite}
          title={isFavorite ? "즐겨찾기 해제" : "즐겨찾기 등록"}
        >
          {isFavorite ? "⭐" : "☆"} {favoriteCount}
        </span>
      </div>

      <div style={{ marginBottom: "1.5rem", fontSize: "0.95rem" }}>
        <p>
          <strong>📍 주소:</strong> {gym.address || "정보 없음"}
        </p>
        <p>
          <strong>📞 전화번호:</strong> {gym.phoneNumber || "정보 없음"}
        </p>
        <p>
          <strong>🕒 운영시간:</strong> {gym.openingHours || "정보 없음"}
        </p>
        <p>
          <strong>🏋️ 부대시설:</strong>{" "}
          {Array.isArray(gym.facilities) && gym.facilities.length > 0
            ? gym.facilities.join(", ")
            : "없음"}
        </p>
      </div>

      {/* 평점 */}
      <div style={{ marginBottom: "1rem", fontSize: "0.95rem" }}>
        <span>{"★".repeat(Math.round(safeRate))}</span>
        <span style={{ marginLeft: "8px", color: "#777" }}>
          ({safeRate.toFixed(1)}/5)
        </span>
      </div>

      {/* 설명 */}
      <p
        style={{ marginBottom: "1rem", lineHeight: "1.5", fontSize: "0.95rem" }}
      >
        {gym.content || ""}
      </p>

      {/* 대표 리뷰 */}
      <div style={{ marginTop: "2rem" }}>
        <h3 style={{ marginBottom: "0.5rem" }}>💬 대표 리뷰</h3>
        {reviews.length > 0 ? (
          reviews.slice(0, 3).map((r) => {
            const rating = Number.isFinite(r.score) ? Math.round(r.score) : 0;
            const text = r.comment || "";
            return (
              <div key={r.reviewNo} style={reviewCardStyle}>
                <div style={{ fontWeight: "bold" }}>
                  {r.writerName || "익명"} 님
                </div>
                <div>{"⭐".repeat(rating)}</div>
                <div style={{ marginTop: "5px" }}>
                  {text.length > 60 ? `${text.slice(0, 60)}...` : text}
                </div>
              </div>
            );
          })
        ) : (
          <p style={{ color: "#888" }}>등록된 리뷰가 없습니다.</p>
        )}
      </div>

      {/* 트레이너 */}
      <div style={{ marginBottom: "1.5rem" }}>
        <h3 style={{ margin: "0 0 0.5rem 0", fontSize: "1.1rem" }}>Trainer</h3>
        {Array.isArray(trainers) && trainers.length > 0 ? (
          <ul style={{ padding: 0, listStyle: "none" }}>
            {trainers.map((t) => (
              <li key={t.trainerNo} style={trainerItemStyle}>
                <strong>{t.name || ""}</strong> —{" "}
                {t.specialty || "전문 분야 없음"}
              </li>
            ))}
          </ul>
        ) : (
          <p style={{ color: "#aaa" }}>등록된 트레이너가 없습니다.</p>
        )}
      </div>

      {/* 하단 버튼 */}
      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          gap: "10px",
        }}
      >
        <button style={buttonStyle} onClick={handleScrollTop}>
          ⬆️ 맨 위로
        </button>
        <button style={buttonStyle} onClick={handleGoReviews}>
          📝 리뷰 보기/쓰기
        </button>
        <button style={buttonStyle}>➕ 등록</button>
      </div>
    </div>
  );
};

const containerStyle = {
  maxWidth: "500px",
  margin: "0 auto",
  padding: "1.5rem",
  fontFamily: "sans-serif",
  border: "1px solid #ddd",
  borderRadius: "10px",
  boxShadow: "0 4px 8px rgba(0,0,0,0.05)",
  backgroundColor: "#fff",
};
const swiperStyle = {
  width: "100%",
  height: "250px",
  marginBottom: "1.2rem",
  borderRadius: "8px",
  overflow: "hidden",
};
const imgStyle = { width: "100%", height: "100%", objectFit: "cover" };
const titleRowStyle = {
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  marginBottom: "0.5rem",
};
const reviewCardStyle = {
  border: "1px solid #ddd",
  borderRadius: "8px",
  padding: "10px",
  marginBottom: "10px",
  backgroundColor: "#fafafa",
  fontSize: "0.95rem",
};
const trainerItemStyle = {
  border: "1px solid #eee",
  borderRadius: "6px",
  padding: "8px",
  marginBottom: "8px",
  fontSize: "0.9rem",
};
const buttonStyle = {
  flex: 1,
  padding: "10px",
  fontSize: "0.95rem",
  border: "none",
  borderRadius: "6px",
  backgroundColor: "#3F75FF",
  color: "#fff",
  cursor: "pointer",
};

export default GymDetailPage;
