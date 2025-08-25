import axios from "axios";
import jwtAxios from "../../member/util/JWTUtil";
import { API_SERVER_HOST } from "../../global/api/axios.jsx";

// 공통 prefix
const host = `${API_SERVER_HOST}/api/board`;
const fileHost = `${API_SERVER_HOST}/api/files`;

// 📌 게시판 관련 API

// 목록 (공개 GET)
export const listBoards = async (searchParams, page, size) => {
  // searchParams가 문자열인 경우 (기존 호환성)
  if (typeof searchParams === "string") {
    const res = await axios.get(host, {
      params: { q: searchParams, page, size },
    });
    return res.data; // Page<BoardDto>
  }

  // searchParams가 객체인 경우 (새로운 검색 방식)
  const { keyword, type } = searchParams;
  const params = { page, size };

  if (keyword && keyword.trim()) {
    params.q = keyword.trim();
    params.type = type || "all";
  }

  const res = await axios.get(host, { params });
  return res.data; // Page<BoardDto>
};

// 상세 (공개 GET)
export const getBoardDetail = async (boardId) => {
  const res = await axios.get(`${host}/${boardId}`);
  return res.data; // BoardDetailDto
};

// 생성 (로그인 필요)
export const createBoard = async ({ title, content, images }) => {
  const res = await jwtAxios.post(host, { title, content, images });
  return res.data; // 성공 시 201 Created
};

// 수정 (로그인 필요)
export const updateBoard = async ({ boardId, title, content, images }) => {
  const res = await jwtAxios.put(`${host}/${boardId}`, {
    title,
    content,
    images,
  });
  return res.data; // 성공 시 204 No Content
};

// 삭제 (로그인 필요)
export const deleteBoard = async (boardId) => {
  const res = await jwtAxios.delete(`${host}/${boardId}`);
  return res.data;
};

// 이미지 업로드 (로그인 필요)
export const uploadImages = async (files) => {
  const form = new FormData();
  for (let i = 0; i < files.length; i++) {
    form.append("files", files[i]);
  }

  const res = await jwtAxios.post(`${fileHost}/upload`, form, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data; // ["saved-1.jpg", ...]
};

// 이미지 표시 URL
export const imageUrl = (fileName) =>
  `${fileHost}/view/${encodeURIComponent(fileName)}`;

// 📌 댓글(Reply) 관련 API

// 댓글 목록 조회 (페이징) - JWT 토큰 필요
export const getReplies = async (boardId, page = 0, size = 5) => {
  const res = await jwtAxios.get(`${host}/${boardId}/replies`, {
    params: { page, size },
  });
  return res.data; // Page<ReplyDto> 형태
};

// 댓글 등록
export const addReply = async (boardId, content) => {
  console.log("=== 댓글 등록 요청 시작 ===");
  console.log("boardId:", boardId, "content:", content);

  try {
    const res = await jwtAxios.post(`${host}/${boardId}/replies`, { content });
    console.log("댓글 등록 성공:", res.status);
    return res.data; // 성공 시 201 Created
  } catch (error) {
    console.error("=== 댓글 등록 실패 ===");
    console.error("에러 상세:", error);
    console.error("응답 상태:", error.response?.status);
    console.error("응답 데이터:", error.response?.data);
    throw error;
  }
};

// 댓글 수정
export const updateReply = async (boardId, replyId, content) => {
  console.log("=== 댓글 수정 요청 시작 ===");
  console.log("boardId:", boardId, "replyId:", replyId, "content:", content);

  try {
    const res = await jwtAxios.put(`${host}/${boardId}/replies/${replyId}`, {
      content,
    });
    console.log("댓글 수정 성공:", res.status);
    return res.data; // 성공 시 204 No Content
  } catch (error) {
    console.error("=== 댓글 수정 실패 ===");
    console.error("에러 상세:", error);
    console.error("응답 상태:", error.response?.status);
    console.error("응답 데이터:", error.response?.data);
    throw error;
  }
};

// 댓글 삭제
export const deleteReply = async (boardId, replyId) => {
  console.log("=== 댓글 삭제 요청 시작 ===");
  console.log("boardId:", boardId, "replyId:", replyId);

  try {
    const res = await jwtAxios.delete(`${host}/${boardId}/replies/${replyId}`);
    console.log("댓글 삭제 성공:", res.status);
    return res.data; // 성공 시 204 No Content
  } catch (error) {
    console.error("=== 댓글 삭제 실패 ===");
    console.error("에러 상세:", error);
    console.error("응답 상태:", error.response?.status);
    console.error("응답 데이터:", error.response?.data);
    throw error;
  }
};
