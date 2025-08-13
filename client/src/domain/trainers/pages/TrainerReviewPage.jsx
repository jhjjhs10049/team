import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import TrainerReviewList from "../components/TrainerReviewList";
import TrainerReviewForm from "../components/TrainerReviewForm";

const TrainerReviewPage = () => {
    const { trainerno } = useParams();
    const [reviews, setReviews] = useState([]);

    useEffect(() => {
        console.log(`트레이너 리뷰 로딩: ${trainerno}`);
        // TODO: API 연결 시 여기에 fetch 호출
    }, [trainerno]);

    return (
        <div style={{ maxWidth: "700px", margin: "0 auto", padding: "2rem" }}>
            <h1>트레이너 리뷰</h1>
            <TrainerReviewList reviews={reviews} />
            <hr style={{ margin: "2rem 0" }} />
            <TrainerReviewForm trainerno={trainerno} />
        </div>
    );
};

export default TrainerReviewPage;