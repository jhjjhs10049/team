package org.zerock.mallapi.domain.board.dto;

import lombok.*;
import java.time.LocalDateTime;
import java.util.List;

@AllArgsConstructor
@NoArgsConstructor
@Data
public class BoardDto {
    private Long bno;
    private Long writerId;
    private String title;
    private String content;
    private String writerEmail; // ← 추가
    private String writerName; // 새로 추가된 필드
    private List<BoardImageDto> images;
    private LocalDateTime regDate;
    private LocalDateTime modDate;
}
