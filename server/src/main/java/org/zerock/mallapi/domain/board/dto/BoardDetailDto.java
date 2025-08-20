package org.zerock.mallapi.domain.board.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BoardDetailDto {
    private Long bno;
    private Long writerId;
    private String writerEmail;
    private String title;
    private String content;
    private String writerName; // BoardDto와 동일하게 추가
    private List<BoardImageDto> images;
    private List<ReplyDto> replies;
    private LocalDateTime regDate;
    private LocalDateTime modDate;
}