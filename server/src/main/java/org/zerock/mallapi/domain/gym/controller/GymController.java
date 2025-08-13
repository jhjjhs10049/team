package org.zerock.mallapi.domain.gym.controller;

import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.zerock.mallapi.domain.gym.dto.GymDetailDTO;
import org.zerock.mallapi.domain.gym.dto.GymReviewDTO;
import org.zerock.mallapi.domain.gym.service.GymReviewService;
import org.zerock.mallapi.domain.gym.service.GymService;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/gyms")
@RequiredArgsConstructor
public class GymController {
    private final GymService gymService;
    private final GymReviewService gymReviewService;

    // 헬스장 상세 조회 (평점, 리뷰 포함)
    @GetMapping("/{gymNo}")
    public ResponseEntity<GymDetailDTO> getGymDetail(
            @PathVariable Long gymNo,
            @RequestParam(required = false) Long memberNo
    ) {
        return ResponseEntity.ok(gymService.getGym(gymNo, memberNo));
    }

    // 특정 헬스장의 리뷰 목록 조회
    @GetMapping("/{gymNo}/reviews")
    public ResponseEntity<List<GymReviewDTO>> getReviewsByGym(@PathVariable Long gymNo) {
        return ResponseEntity.ok(gymReviewService.getReviewsByGym(gymNo));
    }

    // 리뷰 등록
    @PostMapping("/{gymNo}/reviews")
    public ResponseEntity<GymReviewDTO> addReview(
            @PathVariable Long gymNo,
            @RequestBody GymReviewDTO dto
    ) {
        dto.setGymNo(gymNo);
        return ResponseEntity.ok(gymReviewService.addReview(dto));
    }

    // 즐겨찾기 등록/해제
    @PostMapping("/{gymNo}/favorite")
    public ResponseEntity<Map<String, Object>> setFavorite(
            @PathVariable Long gymNo,
            @RequestParam Long memberNo,
            @RequestParam boolean favorite
    ) {
        return ResponseEntity.ok(gymService.setFavorite(gymNo, memberNo, favorite));
    }
}