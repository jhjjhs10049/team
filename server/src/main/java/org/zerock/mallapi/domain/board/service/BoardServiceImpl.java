package org.zerock.mallapi.domain.board.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.board.entity.Board;
import org.zerock.mallapi.domain.board.entity.BoardImage;
import org.zerock.mallapi.domain.board.repository.BoardImageRepository;
import org.zerock.mallapi.domain.board.repository.BoardRepository;
import org.zerock.mallapi.domain.board.repository.ReplyRepository;
import org.zerock.mallapi.domain.member.entity.Member;
import org.zerock.mallapi.domain.member.repository.MemberRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class BoardServiceImpl implements BoardService {

    private final BoardRepository boardRepository;
    private final ReplyRepository replyRepository;
    private final BoardImageRepository boardImageRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    @Override
    public Page<Board> list(String keyword, Pageable pageable) {
        if (keyword == null || keyword.isBlank()) {
            return boardRepository.findAll(pageable);
        }
        return boardRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                keyword, keyword, pageable);
    }

    @Transactional(readOnly = true)
    @Override
    public Board get(Long boardId) {
        return boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + boardId));
    }

    @Override
    public Long create(Long writerId, String title, String content, List<String> imageFileNames) {
        Member writer = memberRepository.findById(writerId)
                .orElseThrow(() -> new IllegalArgumentException("작성자(Member)가 없습니다. id=" + writerId));

        Board board = Board.builder()
                .writer(writer)
                .title(title)
                .content(content)
                .build();

        Board saved = boardRepository.save(board);

        // 이미지 저장 (ord = 인덱스)
        if (imageFileNames != null && !imageFileNames.isEmpty()) {
            for (int i = 0; i < imageFileNames.size(); i++) {
                BoardImage img = BoardImage.builder()
                        .board(saved)
                        .fileName(imageFileNames.get(i))
                        .ord(i)
                        .build();
                boardImageRepository.save(img);
            }
        }
        return saved.getId();
    }

    @Override
    public void update(Long boardId, String title, String content, java.util.List<String> imageFileNames,
            Long currentUserId) {
        org.zerock.mallapi.domain.board.entity.Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + boardId));

        // 작성자 본인만 수정 가능 (관리자도 수정 불가)
        if (!board.getWriter().getMemberNo().equals(currentUserId)) {
            throw new AccessDeniedException("본인 글만 수정할 수 있습니다.");
        }

        board.setTitle(title);
        board.setContent(content);

        // 이미지 교체 (이미지는 게시글 소유자만 수정 가능)
        boardImageRepository.deleteByBoard(board);
        if (imageFileNames != null && !imageFileNames.isEmpty()) {
            for (int i = 0; i < imageFileNames.size(); i++) {
                org.zerock.mallapi.domain.board.entity.BoardImage img = org.zerock.mallapi.domain.board.entity.BoardImage
                        .builder()
                        .board(board)
                        .fileName(imageFileNames.get(i))
                        .ord(i)
                        .build();
                boardImageRepository.save(img);
            }
        }
    }

    @Override
    public void delete(Long boardId, Long currentUserId, boolean isAdmin) {
        org.zerock.mallapi.domain.board.entity.Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + boardId));

        boolean isOwner = board.getWriter().getMemberNo().equals(currentUserId);
        if (!(isOwner || isAdmin)) {
            throw new AccessDeniedException("본인 글 또는 관리자만 삭제할 수 있습니다.");
        }

        // 자식 먼저 삭제
        boardImageRepository.deleteByBoard(board);
        replyRepository.deleteByBoard(board);
        boardRepository.delete(board);
    }

    @Transactional(readOnly = true)
    @Override
    public List<BoardImage> getImages(Long boardId) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + boardId));
        return boardImageRepository.findByBoardOrderByOrdAsc(board);
    }

    @Override
    public Page<Board> list(int page, int size, String keyword) {
        Pageable pageable = PageRequest.of(page, size, Sort.by("createdAt").descending());
        if (keyword == null || keyword.isBlank()) {
            return boardRepository.findAll(pageable);
        }
        return boardRepository.findByTitleContainingIgnoreCaseOrContentContainingIgnoreCase(
                keyword, keyword, pageable);
    }
}
