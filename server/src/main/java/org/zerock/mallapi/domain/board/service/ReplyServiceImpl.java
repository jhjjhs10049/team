package org.zerock.mallapi.domain.board.service;

import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.access.AccessDeniedException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.board.entity.Board;
import org.zerock.mallapi.domain.board.entity.Reply;
import org.zerock.mallapi.domain.board.repository.BoardRepository;
import org.zerock.mallapi.domain.board.repository.ReplyRepository;
import org.zerock.mallapi.domain.member.entity.Member;
import org.zerock.mallapi.domain.member.repository.MemberRepository;

import java.util.List;

@RequiredArgsConstructor
@Service
@Transactional
public class ReplyServiceImpl implements ReplyService {

    private final ReplyRepository replyRepository;
    private final BoardRepository boardRepository;
    private final MemberRepository memberRepository;

    @Transactional(readOnly = true)
    @Override
    public Page<Reply> list(Long boardId, Pageable pageable) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + boardId));
        return replyRepository.findByBoard(board, pageable);
    }

    @Override
    public Long create(Long boardId, Long writerId, String content) {
        Board board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + boardId));
        Member writer = memberRepository.findById(writerId)
                .orElseThrow(() -> new IllegalArgumentException("작성자(Member)가 없습니다. id=" + writerId));

        Reply reply = Reply.builder()
                .board(board)
                .writer(writer)
                .content(content)
                .build();

        return replyRepository.save(reply).getId();
    }

    @Override
    public void update(Long replyId, String content, Long currentUserId) {
        org.zerock.mallapi.domain.board.entity.Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 없습니다. id=" + replyId));

        // 작성자만 수정 가능
        if (!reply.getWriter().getMemberNo().equals(currentUserId)) {
            throw new AccessDeniedException("본인 댓글만 수정할 수 있습니다.");
        }

        reply.setContent(content);
    }

    @Override
    public void delete(Long replyId, Long currentUserId, boolean isAdmin) {
        org.zerock.mallapi.domain.board.entity.Reply reply = replyRepository.findById(replyId)
                .orElseThrow(() -> new IllegalArgumentException("댓글이 없습니다. id=" + replyId));

        boolean isOwner = reply.getWriter().getMemberNo().equals(currentUserId);
        if (!(isOwner || isAdmin)) {
            throw new AccessDeniedException("본인 댓글 또는 관리자만 삭제할 수 있습니다.");
        }

        replyRepository.delete(reply);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Reply> listAll(Long boardId) {
        var board = boardRepository.findById(boardId)
                .orElseThrow(() -> new IllegalArgumentException("게시글이 없습니다. id=" + boardId));
        return replyRepository.findByBoardOrderByCreatedAtAsc(board);
    }

}
