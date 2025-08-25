package org.zerock.mallapi.domain.board.repository;


import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.zerock.mallapi.domain.board.entity.Board;
import org.zerock.mallapi.domain.member.entity.Member;

public interface BoardRepository extends JpaRepository<Board, Long> {    // 목록 + 간단 검색(제목/내용) — 필요없으면 지워도 됨
    Page<Board> findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
            String title, String content, Pageable pageable
    );

    // 제목만 검색
    Page<Board> findByTitleContainingIgnoreCase(String title, Pageable pageable);
    
    // 내용만 검색
    Page<Board> findByContentContainingIgnoreCase(String content, Pageable pageable);
    
    // 글쓴이로 검색 (이메일 기준)
    Page<Board> findByWriter_EmailContainingIgnoreCase(String email, Pageable pageable);

    // 내 글 목록 (Member 객체로 조회) — Member의 PK 이름 몰라도 안전
    Page<Board> findByWriter(Member writer, Pageable pageable);
}