package org.zerock.mallapi.domain.board.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mallapi.domain.board.entity.Board;
import org.zerock.mallapi.domain.board.entity.Reply;

import java.util.List;

public interface ReplyRepository extends JpaRepository<Reply, Long> {

    // 게시글의 댓글 페이징
    Page<Reply> findByBoard(Board board, Pageable pageable);

    // 댓글 개수 (상세 화면에서 카운트 표시용)
    long countByBoard(Board board);

    // 보드 삭제 전 댓글 일괄 삭제 (FK 제약 회피)
    void deleteByBoard(Board board);

    // 전체 조회용
    List<Reply> findByBoardOrderByCreatedAtAsc(Board board);
}
