import axios from "axios";
import jwtAxios from "../../member/util/JWTUtil";
import { API_SERVER_HOST } from "../../global/api/axios.jsx";

// 공통 prefix
const host = `${API_SERVER_HOST}/api/board`;
const fileHost = `${API_SERVER_HOST}/api/files`;

// 📌 게시판 관련 API

// 목록 (공개 GET)
export const listBoards = async (q, page, size) => {
  const res = await axios.get(host, { params: { q, page, size } });
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
    headers: { "Content-Type": "multipart/form-data" },
  });
  return res.data; // ["saved-1.jpg", ...]
};

// 이미지 표시 URL
export const imageUrl = (fileName) =>
  `${fileHost}/view/${encodeURIComponent(fileName)}`;

// 📌 댓글(Reply) 관련 API

// 댓글 등록
export const addReply = async (boardId, content) => {
  const res = await jwtAxios.post(`${host}/${boardId}/replies`, { content });
  return res.data; // 성공 시 201 Created
};

// 댓글 수정
export const updateReply = async (boardId, replyId, content) => {
  const res = await jwtAxios.put(`${host}/${boardId}/replies/${replyId}`, {
    content,
  });
  return res.data; // 성공 시 204 No Content
};

// 댓글 삭제
export const deleteReply = async (boardId, replyId) => {
  const res = await jwtAxios.delete(`${host}/${boardId}/replies/${replyId}`);
  return res.data; // 성공 시 204 No Content
};
