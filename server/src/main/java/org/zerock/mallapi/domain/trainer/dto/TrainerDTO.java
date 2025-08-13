package org.zerock.mallapi.domain.trainer.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainerDTO {
    private Long trainerNo;
    private String name;
    private String specialty;
    // 필요 시 photo 필드도 추가 가능
}