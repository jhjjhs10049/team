import React from "react";
import TrainerCard from "../components/TrainerCard.jsx";

const TrainerListPage = () => {
    // 추후 API 또는 상태로부터 트레이너 배열 받아올 예정
    const trainers = []; // 지금은 빈 배열 (더미 없음)

    return (
        <div style={{ maxWidth: "800px", margin: "0 auto", padding: "2rem" }}>
            <h1>💪 트레이너 목록</h1>
            {trainers.length === 0 ? (
                <p>등록된 트레이너가 없습니다.</p>
            ) : (
                trainers.map(trainer => (
                    <TrainerCard key={trainer.trainerno} trainer={trainer} />
                ))
            )}
        </div>
    );
};

export default TrainerListPage;
