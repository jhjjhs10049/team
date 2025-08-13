package org.zerock.mallapi.domain.gym.service;

import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.zerock.mallapi.domain.gym.dto.GymDetailDTO;
import org.zerock.mallapi.domain.gym.dto.GymReviewDTO;
import org.zerock.mallapi.domain.gym.entity.FavoriteGyms;
import org.zerock.mallapi.domain.gym.entity.Gym;
import org.zerock.mallapi.domain.gym.entity.GymReview;
import org.zerock.mallapi.domain.gym.repository.FavoriteGymsRepository;
import org.zerock.mallapi.domain.gym.repository.GymRepository;
import org.zerock.mallapi.domain.member.entity.Member;
import org.zerock.mallapi.domain.member.repository.MemberRepository;
import org.zerock.mallapi.domain.trainer.dto.TrainerDTO;

import java.util.List;
import java.util.Map;

@RequiredArgsConstructor
@Service
@Transactional(readOnly = true)
public class GymServiceImpl implements GymService {

    private final GymRepository gymRepository;
    private final FavoriteGymsRepository favoriteGymsRepository;
    private final MemberRepository memberRepository;
    private final GymReviewService gymReviewService;

    @Override
    public GymDetailDTO getGym(Long gymNo, Long memberNo) {
        Gym gym = gymRepository.findById(gymNo)
                .orElseThrow(() -> new IllegalArgumentException("해당 헬스장이 없습니다."));

        Double rate = gymReviewService.getAverageScore(gymNo);
        List<TrainerDTO> trainers = gym.getTrainerList().stream()
                .map(t -> new TrainerDTO(t.getTrainerNo(), t.getName(), t.getSpecialty()))
                .toList();

        List<GymReviewDTO> reviews = gymReviewService.getReviewsByGym(gymNo);

        boolean isFavorite = memberNo != null &&
                favoriteGymsRepository.existsByMember_MemberNoAndGym_GymNo(memberNo, gymNo);
        int favoriteCount = favoriteGymsRepository.countByGym_GymNo(gymNo);

        return GymDetailDTO.builder()
                .gymNo(gym.getGymNo())
                .title(gym.getTitle())
                .content(gym.getContent())
                .address(gym.getAddress())
                .phoneNumber(gym.getPhoneNumber())
                .openingHours(gym.getOpeningHours())
                .facilities(gym.getFacilities())
                .rate(rate)
                .imageList(gym.getImageList())
                .trainers(trainers)
                .reviews(reviews)
                .locationX(gym.getLocationX())
                .locationY(gym.getLocationY())
                .isFavorite(isFavorite)
                .favoriteCount(favoriteCount)
                .build();
    }

    @Transactional
    @Override
    public Map<String, Object> setFavorite(Long gymNo, Long memberNo, boolean favorite) {
        Gym gym = gymRepository.findById(gymNo)
                .orElseThrow(() -> new IllegalArgumentException("헬스장이 없습니다."));
        Member member = memberRepository.getReferenceById(memberNo);

        favoriteGymsRepository.findByMemberAndGym(member, gym).ifPresentOrElse(existing -> {
            if (!favorite) favoriteGymsRepository.delete(existing);
        }, () -> {
            if (favorite) favoriteGymsRepository.save(
                    FavoriteGyms.builder().member(member).gym(gym).build()
            );
        });

        return Map.of(
                "isFavorite", favoriteGymsRepository.existsByMember_MemberNoAndGym_GymNo(memberNo, gymNo),
                "favoriteCount", favoriteGymsRepository.countByGym_GymNo(gymNo)
        );
    }

    private GymReviewDTO toReviewDTO(GymReview r) {
        return GymReviewDTO.builder()
                .reviewNo(r.getReviewNo())
                .score(r.getScore())
                .gymNo(r.getGym().getGymNo())
                .writerNo(r.getWriter().getMemberNo())
                .writerName(r.getWriter().getNickname())
                .comment(r.getComment())
                .createdDate(r.getCreatedDate())
                .modifiedDate(r.getModifiedDate())
                .build();
    }
}