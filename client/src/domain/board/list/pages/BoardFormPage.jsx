import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import BasicLayout from "../../../../layouts/BasicLayout";
import {
  createBoard,
  updateBoard,
  getBoardDetail,
  uploadImages,
} from "../../api/boardApi";
import BoardFormComponent from "../components/BoardFormComponent";

export default function BoardFormPage() {
  const navigate = useNavigate();
  const { bno } = useParams();
  const editing = !!bno;

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [existingFiles, setExistingFiles] = useState([]);
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  useEffect(() => {
    if (!editing) return;
    const loadDetail = async () => {
      try {
        const detail = await getBoardDetail(bno);
        setTitle(detail?.title ?? "");
        setContent(detail?.content ?? "");
        const prev = Array.isArray(detail?.images)
          ? detail.images.map((i) => i.fileName)
          : [];
        setExistingFiles(prev);
      } catch (err) {
        console.error(err);
        alert("게시글 정보를 불러오지 못했습니다.");
        navigate("/board");
      }
    };
    loadDetail();
  }, [editing, bno, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim()) return alert("제목을 입력하세요.");
    if (!content.trim()) return alert("내용을 입력하세요.");

    try {
      setLoading(true);
      let imageFileNames = existingFiles;

      if (files.length > 0) {
        imageFileNames = await uploadImages(files);
      }
      if (editing) {
        await updateBoard({
          boardId: bno,
          title,
          content,
          images: imageFileNames,
        });
        alert("수정되었습니다.");
        navigate(`/board/read/${bno}`);
      } else {
        await createBoard({ title, content, images: imageFileNames });
        alert("등록되었습니다.");
        navigate("/board");
      }
    } catch (err) {
      console.error(err);
      alert("저장에 실패했습니다.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <BasicLayout>
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-3xl font-bold text-gray-800 mb-6">
          {editing ? "글 수정" : "글 쓰기"}
        </h1>

        <BoardFormComponent
          title={title}
          setTitle={setTitle}
          content={content}
          setContent={setContent}
          existingFiles={existingFiles}
          setExistingFiles={setExistingFiles}
          files={files}
          setFiles={setFiles}
          onSubmit={handleSubmit}
          editing={editing}
          loading={loading}
        />
      </div>
    </BasicLayout>
  );
}
