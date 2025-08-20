package org.zerock.mallapi.domain.board.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.zerock.mallapi.domain.board.entity.Board;
import org.zerock.mallapi.domain.board.entity.BoardImage;

import java.util.List;

public interface BoardService {

    Page<Board> list(String keyword, Pageable pageable);

    Board get(Long boardId);

    Long create(Long writerId, String title, String content, List<String> imageFileNames);

    // 수정: 작성자만 가능 -> currentUserId만 전달
    void update(Long boardId, String title, String content, java.util.List<String> imageFileNames,
            Long currentUserId);

    // 삭제: 작성자 또는 관리자 가능 -> isAdmin도 전달
    void delete(Long boardId, Long currentUserId, boolean isAdmin);

    List<BoardImage> getImages(Long boardId);

    Page<Board> list(int page, int size, String keyword);
}