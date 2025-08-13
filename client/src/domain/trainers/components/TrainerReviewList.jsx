import React from "react";

const TrainerReviewList = ({ reviews }) => {
    if (!reviews || reviews.length === 0) {
        return <p>등록된 리뷰가 없습니다.</p>;
    }

    return (
        <div>
            {reviews.map((r) => (
                <div key={r.reviewNo} style={{
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                    padding: "1rem",
                    marginBottom: "1rem",
                    backgroundColor: "#fafafa"
                }}>
                    <strong>{r.writer}</strong> ★{r.rating}
                    <p style={{ marginTop: "0.5rem" }}>{r.content}</p>
                </div>
            ))}
        </div>
    );
};

export default TrainerReviewList;