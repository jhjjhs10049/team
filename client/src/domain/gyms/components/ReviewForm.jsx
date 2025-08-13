import React, { useState } from "react";

const ReviewForm = ({ gymNo }) => {
    const [rating, setRating] = useState(5);
    const [content, setContent] = useState("");

    const handleSubmit = (e) => {
        e.preventDefault();
        console.log("리뷰 제출:", { gymNo, rating, content });
        alert("임시 리뷰가 제출되었습니다. (추후 저장 로직 구현)");
        setContent("");
        setRating(5);
    };

    return (
        <form onSubmit={handleSubmit}>
            <h3>리뷰 작성</h3>
            <div style={{ marginBottom: "1rem" }}>
                <label>평점: </label>
                <select value={rating} onChange={(e) => setRating(Number(e.target.value))}>
                    {[5, 4, 3, 2, 1].map((r) => (
                        <option key={r} value={r}>{r}점</option>
                    ))}
                </select>
            </div>
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                rows={4}
                style={{ width: "100%", marginBottom: "1rem" }}
                placeholder="리뷰 내용을 입력하세요..."
                required
            />
            <button type="submit" style={{
                padding: "0.5rem 1rem",
                backgroundColor: "#3F75FF",
                color: "#fff",
                border: "none",
                borderRadius: "6px",
                cursor: "pointer"
            }}>
                리뷰 제출
            </button>
        </form>
    );
};

export default ReviewForm;
