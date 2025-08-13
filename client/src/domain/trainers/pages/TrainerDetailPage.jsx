import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import TrainerProfile from "../components/TrainerProfile";
import TrainerReviewSummary from "../components/TrainerReviewSummary";

const TrainerDetailPage = () => {
    const { trainerno } = useParams();
    const [trainer, setTrainer] = useState(null);

    useEffect(() => {
        // TODO: 추후 API 또는 상태에서 해당 트레이너 데이터 불러오기
        console.log(`트레이너 번호: ${trainerno}`);
        // setTrainer(...) 실행 예정
    }, [trainerno]);

    if (!trainer) {
        return <div>트레이너 정보를 불러오는 중입니다...</div>;
    }

    return (
        <div style={{ maxWidth: "600px", margin: "0 auto", padding: "2rem" }}>
            <h1>{trainer.name}</h1>
            <p>전문 분야: {trainer.specialty}</p>
            <p>소개: {trainer.description}</p>

            <TrainerProfile trainer={trainer} />
            <TrainerReviewSummary trainerId={trainer.trainerno} />
        </div>
    );
};

export default TrainerDetailPage;