import api from "../../global/api/axios";

// 헬스장 상세 조회
export const fetchGymDetail = (gymNo) =>
    api.get(`/api/gyms/${gymNo}`).then(res => res.data);

// 헬스장 리뷰 목록 조회
export const fetchGymReviews = (gymNo) =>
    api.get(`/api/gyms/${gymNo}/reviews`).then(res => res.data);

// 헬스장 리뷰 작성
export const createGymReview = (gymNo, reviewData) =>
    api.post(`/api/gyms/${gymNo}/reviews`, reviewData).then(res => res.data);