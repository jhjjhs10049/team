package org.zerock.mallapi.domain.gym.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.gym.dto.GymReviewDTO;
import org.zerock.mallapi.domain.gym.entity.Gym;
import org.zerock.mallapi.domain.gym.entity.GymReview;
import org.zerock.mallapi.domain.gym.repository.GymRepository;
import org.zerock.mallapi.domain.gym.repository.GymReviewRepository;
import org.zerock.mallapi.domain.member.entity.Member;
import org.zerock.mallapi.domain.member.repository.MemberRepository;

import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class GymReviewServiceImpl implements GymReviewService {

    private final GymReviewRepository gymReviewRepository;
    private final GymRepository gymRepository;
    private final MemberRepository memberRepository;

    @Override
    @Transactional(readOnly = true)
    public List<GymReviewDTO> getReviewsByGym(Long gymNo) {
        return gymReviewRepository.findByGym_GymNo(gymNo).stream()
                .map(r -> GymReviewDTO.builder()
                        .reviewNo(r.getReviewNo())
                        .score(r.getScore())
                        .gymNo(gymNo)
                        .writerNo(r.getWriter().getMemberNo())
                        .writerName(r.getWriter().getNickname())
                        .comment(r.getComment())
                        .createdDate(r.getCreatedDate())
                        .modifiedDate(r.getModifiedDate())
                        .build())
                .toList();
    }

    @Override
    public GymReviewDTO addReview(GymReviewDTO dto) {
        Gym gym = gymRepository.findById(dto.getGymNo())
                .orElseThrow(() -> new IllegalArgumentException("헬스장이 없습니다."));
        Member writer = memberRepository.findById(dto.getWriterNo())
                .orElseThrow(() -> new IllegalArgumentException("작성자가 없습니다."));

        GymReview review = GymReview.builder()
                .gym(gym)
                .writer(writer)
                .score(dto.getScore())
                .comment(dto.getComment())
                .build();

        GymReview saved = gymReviewRepository.save(review);

        return GymReviewDTO.builder()
                .reviewNo(saved.getReviewNo())
                .score(saved.getScore())
                .gymNo(saved.getGym().getGymNo())
                .writerNo(saved.getWriter().getMemberNo())
                .writerName(saved.getWriter().getNickname())
                .comment(saved.getComment())
                .createdDate(saved.getCreatedDate())
                .modifiedDate(saved.getModifiedDate())
                .build();
    }

    @Override
    @Transactional(readOnly = true)
    public Double getAverageScore(Long gymNo) {
        return gymReviewRepository.findAverageScoreByGymNo(gymNo);
    }
}